<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RentPayment;
use App\Models\Rent;
use Illuminate\Http\Request;

class RentPaymentController extends Controller
{
    public function index()
    {
        return response()->json(RentPayment::with('rent')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'rent_id' => 'required|exists:rents,id',
            'amount_paid' => 'required|numeric',
            'payment_method' => 'nullable|string',
            'payment_date' => 'required|date',
        ]);

        $payment = RentPayment::create($request->all());

        // update due balance
        $rent = Rent::find($request->rent_id);
        $rent->due_amount -= $request->amount_paid;
        $rent->status = $rent->due_amount <= 0 ? 'Paid' : 'Due';
        $rent->save();

        return response()->json(['message' => 'Payment added successfully', 'data' => $payment]);
    }

    public function show($id)
    {
        return response()->json(RentPayment::with('rent')->findOrFail($id));
    }

    public function destroy($id)
    {
        $payment = RentPayment::findOrFail($id);
        $payment->delete();
        return response()->json(['message' => 'Payment deleted successfully']);
    }
}
