<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;
use App\Models\RentRequest;

class RentController extends Controller
{
    /**
     * 🔹 Get all rent requests for admin dashboard
     */
    public function index()
    {

        $requests = RentRequest::with([
            'tenant:id,name,email,phone',
            'flat:id,name,floor,size,status'
        ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($requests);
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

    /**
     * 🔹 Handle tenant rent payment
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
        ]);

        return response()->json([
            'message' => '✅ Rent payment successful!',
            'rent' => $rent,
        ], 200);
    }

    /**
     * 🔹 Tenant rent request
     */
    public function requestRent(Request $request)
    {
        $user = auth()->user();

        if (!$user || $user->role !== 'tenant') {
            return response()->json(['message' => 'Only tenants can send rent requests.'], 403);
        }

        $request->validate([
            'flat_id' => 'required|exists:flats,id',
        ]);

        $exists = RentRequest::where('tenant_id', $user->id)
            ->where('flat_id', $request->flat_id)
            ->where('status', 'pending')
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'You already have a pending request for this flat.'], 400);
        }

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
     * 🔹 Approve / Reject rent request (for Admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected',
            'charge' => 'nullable|numeric|min:0'
        ]);

        $rentRequest = RentRequest::findOrFail($id);
        $rentRequest->status = $request->status;

        if ($request->status === 'approved') {
            $rentRequest->charge = $request->charge;
        }

        $rentRequest->save();

        return response()->json([
            'message' => "Rent request {$request->status} successfully!",
            'request' => $rentRequest
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
