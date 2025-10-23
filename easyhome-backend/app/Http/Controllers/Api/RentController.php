<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;
use App\Models\Flat;
use Illuminate\Support\Facades\Auth;

class RentController extends Controller
{
    /**
     * 🔹 Get all rent records (for Rent Management page)
     */
    public function index()
    {
        // flat relation include করা হলো যাতে React-এ flat name দেখা যায়
        $rents = Rent::with('flat:id,name,floor,size,status')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($rents);
    }

    /**
     * 🔹 Store a new rent record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'flat_id' => 'required|exists:flats,id',
            'month' => 'required|string|max:20',
            'year' => 'required|integer',
            'rent_amount' => 'required|numeric|min:0',
            'utility_amount' => 'nullable|numeric|min:0',
            'maintenance_charge' => 'nullable|numeric|min:0',
            'status' => 'required|in:Paid,Due',
        ]);

        $total = ($validated['rent_amount'] ?? 0)
            + ($validated['utility_amount'] ?? 0)
            + ($validated['maintenance_charge'] ?? 0);

        $validated['total_amount'] = $total;
        $validated['due_amount'] = $validated['status'] === 'Due' ? $total : 0;

        $rent = Rent::create($validated);

        // flat relation সহ রিটার্ন করো
        $rent->load('flat');

        return response()->json([
            'message' => '✅ Rent added successfully',
            'rent' => $rent
        ], 201);
    }

    /**
     * 🔹 Update rent record
     */
    public function update(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);

        $validated = $request->validate([
            'month' => 'required|string|max:20',
            'year' => 'required|integer',
            'rent_amount' => 'required|numeric|min:0',
            'utility_amount' => 'nullable|numeric|min:0',
            'maintenance_charge' => 'nullable|numeric|min:0',
            'status' => 'required|in:Paid,Due',
        ]);

        $total = ($validated['rent_amount'] ?? 0)
            + ($validated['utility_amount'] ?? 0)
            + ($validated['maintenance_charge'] ?? 0);

        $validated['total_amount'] = $total;
        $validated['due_amount'] = $validated['status'] === 'Due' ? $total : 0;

        $rent->update($validated);

        $rent->load('flat');

        return response()->json([
            'message' => '✅ Rent updated successfully',
            'rent' => $rent
        ]);
    }

    /**
     * 🔹 Handle rent payment
     */
    public function pay(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);

        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:1',
            'payment_method' => 'required|string',
            'payment_date' => 'required|date',
            'transaction_id' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'account_holder' => 'nullable|string',
            'account_number' => 'nullable|string',
        ]);

        $rent->update([
            'amount_paid'     => $validated['amount_paid'],
            'payment_method'  => $validated['payment_method'],
            'transaction_id'  => $validated['transaction_id'] ?? null,
            'bank_name'       => $validated['bank_name'] ?? null,
            'account_holder'  => $validated['account_holder'] ?? null,
            'account_number'  => $validated['account_number'] ?? null,
            'payment_date'    => $validated['payment_date'],
            'status'          => 'Paid',
            'due_amount'      => 0,
        ]);

        $rent->load('flat');

        return response()->json([
            'message' => '✅ Rent payment successful!',
            'rent' => $rent,
        ], 200);
    }

    /**
     * 🔹 Delete rent record
     */
    public function destroy($id)
    {
        $rent = Rent::findOrFail($id);
        $rent->delete();

        return response()->json(['message' => '🗑️ Rent deleted successfully']);
    }
}
