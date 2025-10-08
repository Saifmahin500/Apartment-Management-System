<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rent;
use Illuminate\Http\Request;

class RentController extends Controller
{
    public function index()
    {
        return response()->json(Rent::with('flat')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'flat_id' => 'required|exists:flats,id',
            'month' => 'required|string',
            'year' => 'required|integer',
            'rent_amount' => 'required|numeric',
        ]);

        $total = $request->rent_amount + $request->utility_amount + $request->maintenance_charge;

        $rent = Rent::create([
            'flat_id' => $request->flat_id,
            'month' => $request->month,
            'year' => $request->year,
            'rent_amount' => $request->rent_amount,
            'utility_amount' => $request->utility_amount ?? 0,
            'maintenance_charge' => $request->maintenance_charge ?? 0,
            'total_amount' => $total,
            'due_amount' => $total,
            'status' => 'Due'
        ]);

        return response()->json(['message' => 'Rent record created successfully', 'data' => $rent]);
    }

    public function show($id)
    {
        return response()->json(Rent::with(['flat', 'payments'])->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $rent = Rent::findOrFail($id);
        $rent->update($request->all());
        return response()->json(['message' => 'Rent updated successfully', 'data' => $rent]);
    }

    public function destroy($id)
    {
        $rent = Rent::findOrFail($id);
        $rent->delete();
        return response()->json(['message' => 'Rent deleted successfully']);
    }
}
