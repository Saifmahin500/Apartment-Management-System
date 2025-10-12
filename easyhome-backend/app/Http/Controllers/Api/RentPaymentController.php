<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RentPayment;
use App\Models\Rent;

class RentPaymentController extends Controller
{
    /**
     * 🔹 Store new payment record for a rent
     */
    public function store(Request $request, $rentId)
    {
        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:1',
            'payment_method' => 'required|string|max:50',
            'transaction_id' => 'nullable|string|max:100',
            'payment_date' => 'required|date',
        ]);

        $rent = Rent::findOrFail($rentId);

        // Create payment entry
        $payment = RentPayment::create([
            'rent_id' => $rent->id,
            'amount_paid' => $validated['amount_paid'],
            'payment_method' => $validated['payment_method'],
            'transaction_id' => $validated['transaction_id'] ?? null,
            'payment_date' => $validated['payment_date'],
        ]);

        // Update rent info
        $due = max(0, ($rent->due_amount ?? 0) - $validated['amount_paid']);
        $status = $due <= 0 ? 'Paid' : 'Due';

        $rent->update([
            'due_amount' => $due,
            'status' => $status,
        ]);

        return response()->json([
            'message' => 'Payment recorded successfully',
            'payment' => $payment,
            'rent' => $rent
        ]);
    }

    /**
     * 🔹 Get all payments for a rent
     */
    public function getPayments($rentId)
    {
        $payments = RentPayment::where('rent_id', $rentId)
            ->orderBy('payment_date', 'desc')
            ->get();

        return response()->json($payments);
    }
}
