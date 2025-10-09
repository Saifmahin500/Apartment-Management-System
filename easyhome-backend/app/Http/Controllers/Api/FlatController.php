<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Flat;
use Illuminate\Support\Facades\Storage;

class FlatController extends Controller
{
    // 🔹 Get all flats
    public function index()
    {
        return response()->json(Flat::all());
    }

    // 🔹 Store flat
    public function store(Request $request)
    {
        $request->validate([
            'building_id' => 'nullable|integer',
            'name' => 'required|string|max:255',
            'flat_number' => 'nullable|string|max:255',
            'floor' => 'required|integer',
            'rent_amount' => 'required|numeric',
            'size' => 'nullable|string|max:50',
            'status' => 'in:available,occupied',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('flats', 'public');
        }

        $flat = Flat::create([
            'building_id' => $request->building_id,
            'name' => $request->name,
            'flat_number' => $request->flat_number,
            'floor' => $request->floor,
            'rent_amount' => $request->rent_amount,
            'size' => $request->size,
            'image' => $imagePath,
            'status' => $request->status ?? 'available',
            'is_occupied' => $request->status === 'occupied' ? 1 : 0,
        ]);

        return response()->json(['message' => 'Flat added successfully', 'flat' => $flat]);
    }

    // 🔹 Update flat
    public function update(Request $request, $id)
    {
        $flat = Flat::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'floor' => 'required|integer',
            'rent_amount' => 'required|numeric',
            'size' => 'nullable|string|max:50',
            'status' => 'in:available,occupied',
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($flat->image) {
                Storage::disk('public')->delete($flat->image);
            }
            $flat->image = $request->file('image')->store('flats', 'public');
        }

        $flat->update($request->all());

        return response()->json(['message' => 'Flat updated successfully', 'flat' => $flat]);
    }

    // 🔹 Delete flat
    public function destroy($id)
    {
        $flat = Flat::findOrFail($id);
        if ($flat->image) {
            Storage::disk('public')->delete($flat->image);
        }
        $flat->delete();

        return response()->json(['message' => 'Flat deleted successfully']);
    }
}
