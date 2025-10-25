<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tenant;
use App\Models\User;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // 🟢 ১️⃣ ম্যানুয়ালি যোগ করা টেন্যান্টস (tenants টেবিল)
        $manualTenants = Tenant::with('flat')
            ->select('id', 'flat_id', 'name', 'email', 'phone', 'start_date', 'end_date', 'monthly_rent', 'created_at')
            ->get()
            ->map(function ($t) {
                $t->source = 'tenant_table'; // বুঝার জন্য
                return $t;
            });

        // 🟢 ২️⃣ users টেবিল থেকে যাদের role = 'tenant'
        $userTenants = User::where('role', 'tenant')
            ->select('id', 'name', 'email', 'phone', 'created_at')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'flat_id' => null,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'start_date' => null,
                    'end_date' => null,
                    'monthly_rent' => null,
                    'created_at' => $user->created_at,
                    'flat' => null,
                    'source' => 'user_table',
                ];
            });

        // 🟢 ৩️⃣ দুই উৎস একত্র করা
        $allTenants = $manualTenants->concat($userTenants)
            ->sortByDesc('created_at')
            ->values();

        return response()->json($allTenants);
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

    public function byFlat($flat_id)
    {
        return response()->json(
            \App\Models\Tenant::where('flat_id', $flat_id)->get()
        );
    }

    public function dashboard()
{
    $user = auth()->user();

    if ($user->role !== 'tenant') {
        return response()->json(['message' => 'Access denied.'], 403);
    }

    // ✅ Find tenant record linked to this user
    $tenant = \App\Models\Tenant::where('email', $user->email)->first();

    if (!$tenant) {
        return response()->json([
            'tenant' => $user,
            'flat' => null,
            'latest_rent' => null,
            'recent_requests' => [],
        ]);
    }

    // ✅ Current Flat (fixed)
    $currentFlat = \App\Models\Flat::where('id', $tenant->flat_id)
        ->select('id', 'name', 'flat_number', 'floor', 'rent_amount', 'size', 'status')
        ->first();

    // ✅ Latest Rent
    $latestRent = \App\Models\Rent::where('tenant_id', $tenant->id)
        ->with('flat:id,name,flat_number')
        ->orderBy('created_at', 'desc')
        ->first();

    // ✅ Recent Service Requests
    $recentRequests = \App\Models\ServiceRequest::with(['service:id,name'])
        ->where('tenant_id', $tenant->id)
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get(['id', 'service_id', 'status', 'request_date', 'charge']);

    // ✅ Final Response
    return response()->json([
        'tenant' => $user,
        'flat' => $currentFlat,
        'latest_rent' => $latestRent,
        'recent_requests' => $recentRequests,
    ]);
}

}
