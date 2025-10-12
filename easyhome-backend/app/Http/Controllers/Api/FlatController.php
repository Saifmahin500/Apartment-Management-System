<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Flat;
use Illuminate\Support\Facades\Storage;

class FlatController extends Controller
{
    /**
     * 🔹 Get all flats (with images)
     */
    public function index()
    {
        $flats = Flat::with('images')->get();
        return response()->json($flats);
    }

    /**
     * 🔹 Get simple flat list (for dropdowns)
     */
    public function simpleList()
    {
        $flats = Flat::select('id', 'name', 'status', 'rent_amount')->get();
        return response()->json($flats);
    }

    /**
     * 🔹 Store a new flat
     */
    public function store(Request $request)
    {
        $request->validate([
            'building_id' => 'required|exists:buildings,id',
            'name' => 'required|string|max:255',
            'flat_number' => 'nullable|string|max:255',
            'floor' => 'required|integer',
            'rent_amount' => 'required|numeric',
            'size' => 'nullable|string|max:50',
            'status' => 'required|in:available,occupied',
            'images.*' => 'nullable|image|mimes:jpg,png,jpeg|max:2048',
        ]);

        // ✅ Step 1: Create flat (without image)
        $flat = Flat::create([
            'building_id' => $request->building_id,
            'name' => $request->name,
            'flat_number' => $request->flat_number ?? $request->name,
            'floor' => $request->floor,
            'rent_amount' => $request->rent_amount,
            'size' => $request->size,
            'status' => $request->status,
            'is_occupied' => $request->status === 'occupied' ? 1 : 0,
        ]);

        // ✅ Step 2: Handle multiple images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('flats', 'public');
                $flat->images()->create(['image' => $path]);
            }
        }

        return response()->json([
            'message' => 'Flat created successfully',
            'flat' => $flat->load('images')
        ], 201);
    }

    /**
     * 🔹 Update flat
     */
    public function update(Request $request, $id)
    {
        $flat = Flat::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'floor' => 'required|integer',
            'rent_amount' => 'required|numeric',
            'size' => 'nullable|string|max:50',
            'status' => 'in:available,occupied',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        $flat->update([
            'name' => $request->name,
            'floor' => $request->floor,
            'rent_amount' => $request->rent_amount,
            'size' => $request->size,
            'status' => $request->status,
            'is_occupied' => $request->status === 'occupied' ? 1 : 0,
        ]);

        // Optional: Add new images
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('flats', 'public');
                $flat->images()->create(['image' => $path]);
            }
        }

        return response()->json([
            'message' => 'Flat updated successfully',
            'flat' => $flat->load('images')
        ]);
    }

    /**
     * 🔹 Delete flat
     */
    public function destroy($id)
    {
        $flat = Flat::findOrFail($id);

        // Delete all associated images
        if ($flat->images) {
            foreach ($flat->images as $img) {
                Storage::disk('public')->delete($img->image);
                $img->delete();
            }
        }

        $flat->delete();

        return response()->json(['message' => 'Flat deleted successfully']);
    }
}
