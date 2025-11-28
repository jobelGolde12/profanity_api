<?php

use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\Route;

Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
})->where('any', '.*');


Route::prefix('profanity')->name('profanity.')->group(function () {
    Route::get('/filipino', [RequestController::class, 'pureFilipino'])->name('filipino');
    Route::get('/regional', [RequestController::class, 'regional'])->name('regional');
    Route::get('/combined', [RequestController::class, 'both'])->name('combined');

    Route::post('/filipino', [RequestController::class, 'storeFilipino'])->name('filipino.store');
    Route::post('/regional', [RequestController::class, 'storeRegional'])->name('regional.store');

    Route::put('/filipino/{id}', [RequestController::class, 'updateFilipino'])->name('filipino.update');
    Route::put('/regional/{id}', [RequestController::class, 'updateRegional'])->name('regional.update');

    Route::delete('/filipino/{id}', [RequestController::class, 'deleteFilipino'])->name('filipino.delete');
    Route::delete('/regional/{id}', [RequestController::class, 'deleteRegional'])->name('regional.delete');
});
Route::get('/debug-headers', [RequestController::class, 'debugHeaders']);
