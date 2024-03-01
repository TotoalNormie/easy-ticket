<?php

use App\Http\Controllers\Api\AuthenticationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventTypeController;
use App\Http\Controllers\OrderedTicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PDFController;
use App\Http\Middleware\AdminMiddleware;
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


Route::group(['middleware' => ['cors', 'json.response']], function () {
    // ...
});

Route::group(['namespace' => 'Api', 'prefix' => 'v1'], function () {
    Route::post('login', [AuthenticationController::class, 'store']);
    Route::delete('logout', [AuthenticationController::class, 'destroy'])->middleware(['auth:api', 'cors']);
    Route::post('register', [AuthenticationController::class, 'register']);
    Route::get('check-auth', [AuthenticationController::class, 'checkAuth'])->middleware('auth:api');
});

Route::middleware(['auth:api'])->group(function () {
    Route::post('buy-ticket', [OrderedTicketController::class, 'buy']);
    Route::post('get-ticket', [OrderedTicketController::class, 'generatePDF']);
    Route::get('get-tickets', [OrderedTicketController::class, 'getUserTickets']);
});

Route::middleware(['auth:api', AdminMiddleware::class])->group(function () {
    Route::post('create-event', [EventController::class, 'create']);
    Route::post('edit-event/{id}', [EventController::class, 'update'])->middleware(['cors']);
    Route::delete('delete-event/{id}', [EventController::class, 'remove'])->middleware(['cors']);

    Route::post('create-event-type', [EventTypeController::class, 'create']);
    Route::post('edit-event-type/{id}', [EventTypeController::class, 'update'])->middleware(['cors']);
    Route::delete('delete-event-type/{id}', [EventTypeController::class, 'remove'])->middleware(['cors']);
});

Route::get('pdf', [PDFController::class, 'generatePDF']);
Route::post('/create-payment-intent', [PaymentController::class, 'createPaymentIntent']);
Route::get('/events', [EventController::class, 'get']);
Route::get('/event-types', [EventTypeController::class, 'get']);
Route::get('/event/{id}', [EventController::class, 'getById']);
