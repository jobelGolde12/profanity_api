<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PureFilipinoModel;
use App\Models\RegionalModel;
use Illuminate\Http\Request;
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
}
