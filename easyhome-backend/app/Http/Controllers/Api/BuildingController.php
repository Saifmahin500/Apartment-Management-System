<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Building;
use Illuminate\Http\Request;

class BuildingController extends Controller
{
    public function index()
    {
        return response()->json(Building::with('creator')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'address' => 'required|string',
            'total_floors' => 'required|integer',
            'total_flats' => 'required|integer'
        ]);

        $building = Building::create([
            'name' => $request->name,
            'address' => $request->address,
            'total_floors' => $request->total_floors,
            'total_flats' => $request->total_flats,
            'created_by' => $request->user()->id,
        ]);

        return response()->json(['message' => 'Building created successfully', 'data' => $building]);
    }

    public function show($id)
    {
        $building = Building::with('flats')->findOrFail($id);
        return response()->json($building);
    }

    public function update(Request $request, $id)
    {
        $building = Building::findOrFail($id);
        $building->update($request->all());

        return response()->json(['message' => 'Building updated successfully', 'data' => $building]);
    }

    public function destroy($id)
    {
        $building = Building::findOrFail($id);
        $building->delete();

        return response()->json(['message' => 'Building deleted successfully']);
    }
}
