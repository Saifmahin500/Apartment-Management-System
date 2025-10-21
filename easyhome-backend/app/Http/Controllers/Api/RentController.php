<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;
use App\Models\RentRequest;

class RentController extends Controller
{
    /**
     * 🔹 Get all rents with related flat info
     */
    public function index()
    {
        $rents = Rent::with('flat')->orderBy('year', 'desc')->orderBy('month', 'desc')->get();
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

        return response()->json([
            'message' => 'Rent added successfully',
            'rent' => $rent
        ], 201);
    }

    public function pay(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);

        // 🧩 Validate inputs
        $validated = $request->validate([
            'amount_paid' => 'required|numeric|min:1',
            'payment_method' => 'required|string',
            'payment_date' => 'required|date',
            'transaction_id' => 'nullable|string',
            'bank_name' => 'nullable|string',
            'account_holder' => 'nullable|string',
            'account_number' => 'nullable|string',
        ]);

        // 🧠 Save payment info to rents table
        $rent->update([
            'amount_paid'     => $validated['amount_paid'],
            'payment_method'  => $validated['payment_method'],
            'transaction_id'  => $validated['transaction_id'] ?? null,
            'bank_name'       => $validated['bank_name'] ?? null,
            'account_holder'  => $validated['account_holder'] ?? null,
            'account_number'  => $validated['account_number'] ?? null,
            'payment_date'    => $validated['payment_date'],
            'status'          => 'Paid',
        ]);

        return response()->json([
            'message' => '✅ Rent payment successful!',
            'rent' => $rent,
        ], 200);
    }

    public function requestRent(Request $request)
{
    $user = auth()->user();

    // ✅ Tenant validation
    if (!$user || $user->role !== 'tenant') {
        return response()->json(['message' => 'Only tenants can send rent requests.'], 403);
    }

    // ✅ Validate flat ID
    $request->validate([
        'flat_id' => 'required|exists:flats,id',
    ]);

    // ✅ Prevent duplicate pending request
    $exists = RentRequest::where('tenant_id', $user->id)
        ->where('flat_id', $request->flat_id)
        ->where('status', 'pending')
        ->exists();

    if ($exists) {
        return response()->json(['message' => 'You already have a pending request for this flat.'], 400);
    }

    // ✅ Create new rent request
    $rentRequest = RentRequest::create([
        'tenant_id' => $user->id,
        'flat_id' => $request->flat_id,
        'status' => 'pending',
    ]);

    return response()->json([
        'message' => 'Rent request submitted successfully!',
        'request' => $rentRequest,
    ]);
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
            'status' => 'in:Paid,Due',
        ]);

        $total = ($validated['rent_amount'] ?? 0)
            + ($validated['utility_amount'] ?? 0)
            + ($validated['maintenance_charge'] ?? 0);

        $validated['total_amount'] = $total;
        $validated['due_amount'] = $validated['status'] === 'Due' ? $total : 0;

        $rent->update($validated);

        return response()->json(['message' => 'Rent updated successfully', 'rent' => $rent]);
    }

    /**
     * 🔹 Delete rent record
     */
    public function destroy($id)
    {
        $rent = Rent::findOrFail($id);
        $rent->delete();

        return response()->json(['message' => 'Rent deleted successfully']);
    }
}
