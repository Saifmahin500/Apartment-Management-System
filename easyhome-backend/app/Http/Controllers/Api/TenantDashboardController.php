<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;

class TenantDashboardController extends Controller
{
    // ✅ Rent Summary API
    public function rentSummary()
    {
        $tenant = auth()->user();

        if (!$tenant || $tenant->role !== 'tenant') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 🧮 Summary Data
        $totalRent = Rent::where('tenant_id', $tenant->id)->sum('total_amount');
        $paidRent  = Rent::where('tenant_id', $tenant->id)->where('status', 'Paid')->sum('total_amount');
        $dueRent   = Rent::where('tenant_id', $tenant->id)->where('status', 'Due')->sum('total_amount');

        $latestRent = Rent::where('tenant_id', $tenant->id)
            ->where('status', 'Paid')
            ->orderBy('updated_at', 'desc')
            ->first();

        return response()->json([
            'total'       => $totalRent,
            'paid'        => $paidRent,
            'due'         => $dueRent,
            'last_month'  => $latestRent ? ($latestRent->month . ' ' . $latestRent->year) : 'N/A',
        ]);
    }
}
