<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::group(['middleware' => ['cors', 'json.response']], function () {
    // ...
});

Route::group(['namespace' => 'Api', 'prefix' => 'v1'], function () {
    Route::post('login', [AuthenticationController::class, 'store']);
    Route::post('logout', [AuthenticationController::class, 'destroy'])->middleware('auth:api');
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('create-event', [EventController::class, 'create']);
    Route::patch('edit-event/{id}', [EventController::class, 'update']);
    Route::delete('delete-event/{id}', [EventController::class, 'remove']);

    Route::post('create-event-type', [EventTypeController::class, 'create']);
    Route::patch('edit-event-type/{id}', [EventTypeController::class, 'update']);
    Route::delete('delete-event-type/{id}', [EventTypeController::class, 'remove']);
});
