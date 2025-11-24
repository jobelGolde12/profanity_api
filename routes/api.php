<?php

use App\Http\Controllers\RequestController;
use Illuminate\Support\Facades\Route;

Route::prefix('profanity')->name('profanity.')->group(function () {
    Route::get('/filipino', [RequestController::class, 'pureFilipino'])->name('filipino');
    Route::get('/regional', [RequestController::class, 'regional'])->name('regional');
    Route::get('/combined', [RequestController::class, 'both'])->name('combined');

    Route::post('/filipino', [RequestController::class, 'storeFilipino'])->name('filipino.store');
    Route::post('/regional', [RequestController::class, 'storeRegional'])->name('regional.store');

    Route::put('/filipino/{id}', [RequestController::class, 'updateFilipino'])->name('filipino.update');
    Route::put('/regional/{id}', [RequestController::class, 'updateRegional'])->name('regional.update');
});
Route::get('/debug-headers', [RequestController::class, 'debugHeaders']);
