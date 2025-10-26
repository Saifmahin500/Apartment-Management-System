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
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\TenantDashboardController;
use App\Http\Controllers\Api\TenantRentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceRequestController;

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

// Public Routes 
Route::get('/flats/simple', [FlatController::class, 'simpleList']);
Route::get('/public/flats/{id}', [FlatController::class, 'showPublic']);

Route::get('/rents/latest/{flat_id}', function ($flat_id) {
    return Rent::where('flat_id', $flat_id)->latest()->first();
});

Route::get('/public/services', [ServiceController::class, 'index']);

// Protected Routes 
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/dashboard-summary', [DashboardController::class, 'summary']);
    Route::get('/dashboard-recent', [DashboardController::class, 'recent']);

    // Buildings & Flats
    Route::apiResource('buildings', BuildingController::class);
    Route::apiResource('flats', FlatController::class);

    // Tenants
    Route::apiResource('tenants', TenantController::class);
    Route::get('/tenant/dashboard', [TenantController::class, 'dashboard']);
    Route::get('/tenants/by-flat/{flat_id}', [TenantController::class, 'byFlat']);
    Route::post('/tenant/rent-request', [RentController::class, 'requestRent']);
    Route::post('/tenant/pay-rent', [TenantRentController::class, 'payRent']);
    Route::get('/tenant/rent-summary', [TenantDashboardController::class, 'rentSummary']);


    // ✅ Admin Rent Requests Routes (newly added)
    Route::get('/admin/rent-requests', [RentController::class, 'index']);
    Route::put('/admin/rent-requests/{id}/status', [RentController::class, 'updateStatus']);
    // ✅ end

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
    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings/update', [SettingController::class, 'update']);

    // Services Routes
    Route::apiResource('services', ServiceController::class)->except(['index']);
    Route::apiResource('service-requests', ServiceRequestController::class);
    Route::put('/service-requests/{id}/status', [ServiceRequestController::class, 'updateStatus']);
});

Route::get('/invoices/{id}/pdf', [InvoiceController::class, 'downloadPdf']);
