<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BuildingController;
use App\Http\Controllers\Api\FlatController;
use App\Http\Controllers\Api\TenantController;
use App\Http\Controllers\Api\RentController;
use App\Http\Controllers\Api\RentPaymentController;
use App\Http\Controllers\Api\ExpenseCategoryController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SmsGatewayController;
use App\Http\Controllers\Api\InvoiceController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// ========== Auth Routes ==========
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});


Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('flats', FlatController::class);
    Route::apiResource('tenants', TenantController::class);
    Route::apiResource('rents', RentController::class);
    Route::apiResource('rent-payments', RentPaymentController::class);
    Route::apiResource('expense-categories', ExpenseCategoryController::class);
    Route::apiResource('expenses', ExpenseController::class);
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::apiResource('sms-gateways', SmsGatewayController::class);
    Route::apiResource('invoices', InvoiceController::class);
});
