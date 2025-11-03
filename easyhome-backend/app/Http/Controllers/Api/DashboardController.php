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
    /**
     * 🧭 Dashboard Summary API
     * Fetches overall stats for tenants, flats, rent, expenses, and invoices.
     */
    public function summary()
    {
        try {
            // 🧍‍♂️ Total Tenants
            $totalTenants = Tenant::count();

            // 🏢 Flats Summary
            $totalFlats = Flat::count();
            $occupiedFlats = Flat::where('status', 'occupied')->count();
            $availableFlats = Flat::where('status', 'available')->count();

            // 💰 Rent Summary
            $totalRentCollected = RentPayment::sum('amount_paid');
            $thisMonthRent = RentPayment::whereMonth('created_at', now()->month)
                ->sum('amount_paid');

            // 💵 Expense Summary
            $totalExpenses = Expense::sum('amount');
            $thisMonthExpense = Expense::whereMonth('created_at', now()->month)
                ->sum('amount');

            // 📄 Invoice Summary
            $totalInvoices = Invoice::count();
            $thisMonthInvoices = Invoice::whereMonth('created_at', now()->month)->count();

            // ✅ Prepare Response
            return response()->json([
                'status' => true,
                'message' => 'Dashboard summary fetched successfully',
                'data' => [
                    'total_tenants' => $totalTenants,
                    'total_flats' => $totalFlats,
                    'rented_flats' => $occupiedFlats,
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

    /**
     * 🕒 Recent Activity API
     * Fetches latest rents and expenses for dashboard recent section.
     */
    public function recent()
    {
        try {
            // 🧾 Recent Rent Payments
            $recentRents = RentPayment::latest()
                ->take(5)
                ->get([
                    'id',
                    'amount_paid',
                    'payment_date',
                    'created_at'
                ]);

            // 💸 Recent Expenses
            $recentExpenses = Expense::latest()
                ->take(5)
                ->get([
                    'id',
                    'title',
                    'amount',
                    'date',
                    'created_at'
                ]);

            return response()->json([
                'status' => true,
                'message' => 'Recent dashboard data fetched successfully',
                'data' => [
                    'rents' => $recentRents,
                    'expenses' => $recentExpenses,
                ]
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch recent data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
