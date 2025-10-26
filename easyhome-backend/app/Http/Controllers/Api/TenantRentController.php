<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;
use Illuminate\Support\Facades\Auth;

class TenantRentController extends Controller
{
    /**
     * ✅ Pay Rent API
     * Tenant নিজের ভাড়া পরিশোধ করতে পারবে
     */
    public function payRent(Request $request)
    {
        try {
            $request->validate([
                'month' => 'required|string',
                'year'  => 'required|integer',
            ]);

            $user = Auth::user();
            if (!$user || !$user->tenant) {
                return response()->json(['message' => 'Tenant not found!'], 404);
            }

            $tenant = $user->tenant;

            // 🎯 Rent record খুঁজে বের করা
            $rent = Rent::where('tenant_id', $tenant->id)
                ->where('month', $request->month)
                ->where('year', $request->year)
                ->first();

            if (!$rent) {
                return response()->json(['message' => 'Rent record not found!'], 404);
            }

            if ($rent->status === 'Paid') {
                return response()->json(['message' => 'This rent is already paid.'], 400);
            }

            // 💳 Rent Paid করা হচ্ছে
            $rent->status = 'Paid';
            $rent->payment_date = now();
            $rent->save();

            return response()->json([
                'message' => '✅ Rent payment successful!',
                'rent' => $rent,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Rent payment failed!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
