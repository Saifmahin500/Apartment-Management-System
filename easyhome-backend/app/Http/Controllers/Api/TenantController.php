<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenants = Tenant::with('flat')->latest()->get();

        return response()->json($tenants);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:tenants,email',
        'phone' => 'required|string|max:20',
        'flat_id' => 'required|exists:flats,id',
        'start_date' => 'required|date', 
        'end_date' => 'nullable|date',
        'monthly_rent' => 'nullable|numeric',
    ]);

    $tenant = Tenant::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Tenant added successfully!',
        'tenant' => $tenant
    ], 201);
}


    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $tenant = Tenant::with('flat')->findOrFail($id);
        return response()->json($tenant);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $tenant = Tenant::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:tenants,email,' . $id,
            'phone' => 'required|string|max:20',
            'flat_id' => 'required|exists:flats,id',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'monthly_rent' => 'nullable|numeric'
        ]);

        $tenant->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Tenant updated successfully!',
            'tenant' => $tenant
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $tenant = Tenant::findOrFail($id);
        $tenant->delete();

        return response()->json(['success' => true, 'message' => 'Tenant deleted successfully!']);
    }
}
