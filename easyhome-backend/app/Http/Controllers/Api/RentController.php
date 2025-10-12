<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Rent;

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
