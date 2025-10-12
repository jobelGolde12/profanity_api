<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PureFilipinoModel;
use App\Models\RegionalModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class RequestController extends Controller
{
    public function pureFilipino(){
        $api = PureFilipinoModel::all();
         return response()->json($api);
    }

     public function regional(){
        $api = RegionalModel::all();
         return response()->json($api);
    }

    public function both(){
        $api1 = PureFilipinoModel::all();
        $api2 = RegionalModel::all();
        $combined = $api1->toBase()->merge($api2)->values();
         return response()->json($combined);
    }

    public function storeFilipino(Request $request){
         $request->validate([
            'word' => 'required|string|unique:pure_filipino,word'
        ]);
        
       try{
         PureFilipinoModel::create([
            'word' => $request->word,
        ]);
        return response()->json(["message" => "Successfully created"], 201);
       }catch(\Exception $e){
        return response()->json(['error' => 'An error while posting data '], 500); 
       }

    }

    public function storeRegional(Request $request){
         $request->validate([
            'word' => 'required|string|unique:pure_filipino,word'
        ]);
        
       try{
         RegionalModel::create([
            'word' => $request->word,
        ]);
        return response()->json(["message" => "Successfully created"], 201);
       }catch(\Exception $e){
        return response()->json(['error' => 'An error while posting data '], 500); 
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

                return response()->json(['message' => 'Successfully updated'], 200);
            } catch (\Exception $e) {
                Log::error('Failed to update Filipino word', ['error' => $e->getMessage()]);
                return response()->json(['error' => 'An error occurred while updating data'], 500);
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

                return response()->json(['message' => 'Successfully updated'], 200);
            } catch (\Exception $e) {
                Log::error('Failed to update Regional word', ['error' => $e->getMessage()]);
                return response()->json(['error' => 'An error occurred while updating data'], 500);
            }
        }


}
