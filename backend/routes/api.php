<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MealController;

Route::get('/meals/{date}', [MealController::class, 'index']);
Route::post('/meals', [MealController::class, 'store']);
Route::delete('/foods/{foodId}', [MealController::class, 'deleteFood']);