<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
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
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SettingsController;
use App\Models\Rent;



Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| 🌐 Public Routes (No Authentication Needed)
|--------------------------------------------------------------------------
*/
Route::get('/flats/simple', [FlatController::class, 'simpleList']); // ✅ For dropdowns


Route::get('/rents/latest/{flat_id}', function ($flat_id) {
    return Rent::where('flat_id', $flat_id)->latest()->first();
});

/*
|--------------------------------------------------------------------------
| 🔒 Protected Routes (Require Sanctum Auth)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard-recent', [DashboardController::class, 'recent']);


    
    // Buildings & Flats
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('flats', FlatController::class);

    // Tenants
    Route::apiResource('tenants', TenantController::class);
    Route::get('/tenants/by-flat/{flat_id}', [TenantController::class, 'byFlat']);


    // Rent & Payments
    Route::apiResource('rents', RentController::class);
    Route::post('rents/{rent}/pay', [RentPaymentController::class, 'store']);
    Route::get('rents/{rent}/payments', [RentPaymentController::class, 'getPayments']);

    // Expenses
    Route::apiResource('expense-categories', ExpenseCategoryController::class);
    Route::apiResource('expenses', ExpenseController::class);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    // SMS Gateway & Invoices
    Route::apiResource('sms-gateways', SmsGatewayController::class);
    Route::apiResource('invoices', InvoiceController::class);
    Route::post('/invoices/{id}/email', [InvoiceController::class, 'sendEmail']);
    Route::get('/invoices/filter', [InvoiceController::class, 'filter']);

    // Profile Routes
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::post('/profile/update', [ProfileController::class, 'updateProfile']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);

    // Settings Routes
    Route::get('/settings', [SettingsController::class, 'getSettings']);
    Route::post('/settings/update', [SettingsController::class, 'updateSettings']);

});

Route::get('/invoices/{id}/pdf', [InvoiceController::class, 'downloadPdf']);
