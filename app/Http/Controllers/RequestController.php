<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PureFilipinoModel;
use App\Models\RegionalModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RequestController extends Controller
{
private function formatResponse($data, $status = 200)
{
    $acceptHeader = strtolower(request()->header('Accept', ''));
    $formatParam = strtolower(request()->get('format', ''));

    if ($formatParam === 'json') {
        return response()->json($data, $status);
    }

    if ($formatParam === 'xml') {
        return $this->convertToXml($data, $status);
    }

    if (str_contains($acceptHeader, 'application/json') ||
        str_contains($acceptHeader, 'json')) 
    {
        return response()->json($data, $status);
    }

    if (str_contains($acceptHeader, 'application/xml') ||
        str_contains($acceptHeader, 'text/xml') ||
        str_contains($acceptHeader, 'xml')) 
    {
        return $this->convertToXml($data, $status);
    }

    return response()->json($data, $status);
}


    private function convertToXml($data, $status = 200)
{
    try {
        Log::info('Starting XML conversion', ['data_type' => gettype($data)]);
        
        // Handle different data types
        if ($data instanceof \Illuminate\Database\Eloquent\Collection) {
            $data = $data->toArray();
            Log::info('Converted collection to array', ['count' => count($data)]);
        }
        
        // Handle arrays - ensure it's properly structured for XML
        if (is_array($data)) {
            // If it's a list array (numeric keys), wrap it
            if (!empty($data) && array_keys($data) === range(0, count($data) - 1)) {
                $data = ['item' => $data];
                Log::info('Wrapped array in item element');
            }
        }
        
        Log::info('Data prepared for XML', ['data_sample' => is_array($data) ? array_slice($data, 0, 2) : $data]);

        
        // Create XML with a root element
        $xml = new \SimpleXMLElement('<?xml version="1.0" encoding="UTF-8"?><response></response>');
        
        $this->arrayToXml($data, $xml);
        
        $xmlContent = $xml->asXML();
        
        // Validate XML was created
        if (!$xmlContent) {
            throw new \Exception('Failed to generate XML content');
        }
        
        Log::info('XML conversion successful');
        Log::info('XML content sample: ' . substr($xmlContent, 0, 200));
        
        return response($xmlContent, $status)
            ->header('Content-Type', 'application/xml');
            
    } catch (\Exception $e) {
        // Fallback to JSON if XML conversion fails
        Log::error('XML conversion failed: ' . $e->getMessage());
        Log::error('Stack trace: ' . $e->getTraceAsString());
        Log::error('Data that failed conversion:', ['data' => $data]);
        
        // Return JSON but log that it was supposed to be XML
        return response()->json([
            'error' => 'XML conversion failed',
            'message' => $e->getMessage(),
            'fallback_data' => $data
        ], $status);
    }
}


   
private function arrayToXml($data, &$xml)
{
    foreach ($data as $key => $value) {
        // Convert numeric keys to 'item'
        if (is_numeric($key)) {
            $key = 'item';
        }
        
        // Sanitize key name for XML
        $key = $this->sanitizeXmlKey($key);
        
        if (is_array($value)) {
            $subnode = $xml->addChild($key);
            $this->arrayToXml($value, $subnode);
        } else {
            // Handle different value types
            if ($value === null) {
                $value = '';
            } elseif (is_bool($value)) {
                $value = $value ? 'true' : 'false';
            } elseif (is_object($value)) {
                $value = (string)$value;
            }
            
            // Ensure value is a string and properly encoded
            $xml->addChild($key, htmlspecialchars((string)$value, ENT_XML1, 'UTF-8'));
        }
    }
}

   private function sanitizeXmlKey($key)
{
    if (empty($key)) {
        return 'item';
    }
    
    // Remove invalid XML characters from key names
    $key = preg_replace('/[^a-zA-Z0-9_]/', '_', $key);
    
    // Ensure key doesn't start with a number or is empty
    if (empty($key) || is_numeric(substr($key, 0, 1))) {
        $key = 'item_' . $key;
    }
    
    return $key;
}
    public function pureFilipino()
    {
        try {
            $api = PureFilipinoModel::all();
            Log::info('PureFilipino data fetched', ['count' => $api->count()]);
            return $this->formatResponse($api);
        } catch (\Exception $e) {
            Log::error('Error in pureFilipino: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function regional()
    {
        try {
            $api = RegionalModel::all();
            Log::info('Regional data fetched', ['count' => $api->count()]);
            return $this->formatResponse($api);
        } catch (\Exception $e) {
            Log::error('Error in regional: ' . $e->getMessage());
            return response()->json(['error' => 'Internal Server Error'], 500);
        }
    }

    public function both()
{
    try {
        $api1 = PureFilipinoModel::all();
        $api2 = RegionalModel::all();

        $combined = $api1->toBase()->merge($api2)->values();

        Log::info('Combined data fetched', ['count' => $combined->count()]);

        return $this->formatResponse($combined->toArray());

    } catch (\Exception $e) {
        Log::error('Error in both: ' . $e->getMessage());
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}


    public function storeFilipino(Request $request)
    {
        $request->validate([
            'word' => 'required|string|unique:pure_filipino,word'
        ]);
        
        try {
            PureFilipinoModel::create([
                'word' => $request->word,
            ]);
            return $this->formatResponse(["message" => "Successfully created"], 201);
        } catch(\Exception $e) {
            return $this->formatResponse(['error' => 'An error while posting data'], 500);
        }
    }

    public function storeRegional(Request $request)
    {
        $request->validate([
            'word' => 'required|string|unique:regional,word'
        ]);
        
        try {
            RegionalModel::create([
                'word' => $request->word,
            ]);
            return $this->formatResponse(["message" => "Successfully created"], 201);
        } catch(\Exception $e) {
            return $this->formatResponse(['error' => 'An error while posting data'], 500);
        }
    }

    public function updateFilipino(Request $request, $id)
    {
        $validated = $request->validate([
            'word' => 'required|string|unique:pure_filipino,word,' . $id,
        ]);

        try {
            $word = PureFilipinoModel::findOrFail($id);
            $word->update(['word' => $validated['word']]);

            return $this->formatResponse(['message' => 'Successfully updated'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update Filipino word', ['error' => $e->getMessage()]);
            return $this->formatResponse(['error' => 'An error occurred while updating data'], 500);
        }
    }

    public function updateRegional(Request $request, $id)
    {
        $validated = $request->validate([
            'word' => 'required|string|unique:regional,word,' . $id,
        ]);

        try {
            $word = RegionalModel::findOrFail($id);
            $word->update(['word' => $validated['word']]);

            return $this->formatResponse(['message' => 'Successfully updated'], 200);
        } catch (\Exception $e) {
            Log::error('Failed to update Regional word', ['error' => $e->getMessage()]);
            return $this->formatResponse(['error' => 'An error occurred while updating data'], 500);
        }
    }
    public function debugHeaders()
{
    $acceptHeader = request()->header('Accept');
    $formatParam = request()->get('format');
    $allParams = request()->all();
    
    Log::info('DEBUG HEADERS:', [
        'accept_header' => $acceptHeader,
        'format_param' => $formatParam,
        'all_params' => $allParams,
        'full_url' => request()->fullUrl()
    ]);
    
    return response()->json([
        'accept_header' => $acceptHeader,
        'format_param' => $formatParam,
        'all_params' => $allParams,
        'full_url' => request()->fullUrl()
    ]);
}
     /**
     * Delete Filipino profanity word by ID
     */
    public function deleteFilipino($id)
    {
        try {
            $word = PureFilipinoModel::findOrFail($id);
            $word->delete();

            return $this->formatResponse([
                'message' => 'Filipino profanity word deleted successfully',
                'deleted_id' => (int)$id
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Filipino word not found for deletion', ['id' => $id]);
            return $this->formatResponse([
                'error' => 'Filipino profanity word not found',
                'id' => $id
            ], 404);

        } catch (\Exception $e) {
            Log::error('Failed to delete Filipino word', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return $this->formatResponse([
                'error' => 'An error occurred while deleting the Filipino profanity word'
            ], 500);
        }
    }

    /**
     * Delete Regional profanity word by ID
     */
    public function deleteRegional($id)
    {
        try {
            $word = RegionalModel::findOrFail($id);
            $word->delete();

            return $this->formatResponse([
                'message' => 'Regional profanity word deleted successfully',
                'deleted_id' => (int)$id
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning('Regional word not found for deletion', ['id' => $id]);
            return $this->formatResponse([
                'error' => 'Regional profanity word not found',
                'id' => $id
            ], 404);

        } catch (\Exception $e) {
            Log::error('Failed to delete Regional word', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);
            return $this->formatResponse([
                'error' => 'An error occurred while deleting the Regional profanity word'
            ], 500);
        }
    }
}