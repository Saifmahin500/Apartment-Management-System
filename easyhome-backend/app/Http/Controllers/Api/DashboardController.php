<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\Flat;
use App\Models\RentPayment;
use App\Models\Expense;
use App\Models\Invoice;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function summary()
    {
        try {
            // 🧍‍♂️ Tenant Summary
            $totalTenants = Tenant::count();

            // 🏢 Flats Summary
            $totalFlats = Flat::count();
            $rentedFlats = Flat::where('status', 'rented')->count();
            $availableFlats = $totalFlats - $rentedFlats;

            // 💰 Rent Summary
            $totalRentCollected = RentPayment::sum('amount_paid');
            $thisMonthRent = RentPayment::whereMonth('created_at', now()->month)->sum('amount_paid');

            // 💵 Expense Summary
            $totalExpenses = Expense::sum('amount');
            $thisMonthExpense = Expense::whereMonth('created_at', now()->month)->sum('amount');

            // 📄 Invoice Summary
            $totalInvoices = Invoice::count();
            $thisMonthInvoices = Invoice::whereMonth('created_at', now()->month)->count();

            return response()->json([
                'status' => true,
                'message' => 'Dashboard summary fetched successfully',
                'data' => [
                    'total_tenants' => $totalTenants,
                    'total_flats' => $totalFlats,
                    'rented_flats' => $rentedFlats,
                    'available_flats' => $availableFlats,
                    'total_rent_collected' => $totalRentCollected,
                    'this_month_rent' => $thisMonthRent,
                    'total_expenses' => $totalExpenses,
                    'this_month_expense' => $thisMonthExpense,
                    'total_invoices' => $totalInvoices,
                    'this_month_invoices' => $thisMonthInvoices,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch dashboard summary',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function recent()
    {
        try {

            $recentRents = \App\Models\RentPayment::latest()
                ->take(5)
                ->get(['id', 'amount_paid', 'payment_date']);


            $recentExpenses = \App\Models\Expense::latest()
                ->take(5)
                ->get(['id', 'title', 'amount', 'date']);

            return response()->json([
                'status' => true,
                'data' => [
                    'rents' => $recentRents,
                    'expenses' => $recentExpenses,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
