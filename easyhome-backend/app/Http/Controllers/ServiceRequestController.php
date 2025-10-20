<?php

namespace App\Http\Controllers;

use App\Models\ServiceRequest;
use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ServiceRequestController extends Controller
{

    public function index()
    {

        $user = Auth::user();

        if ($user->role === 'admin') {
            $requests = ServiceRequest::with(['tenant', 'flat', 'service'])->latest()->get();
        } else {
            $requests = ServiceRequest::with(['service', 'flat'])
                ->where('tenant_id', $user->tenant->id)
                ->latest()
                ->get();
        }

        return response()->json($requests);
    }
    public function store(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'flat_id' => 'required|exists:flats,id',
            'service_id' => 'required|exists:services,id',
            'request_date' => 'required|date',
        ]);

        $data = [
            'tenant_id' => $user->tenant->id,
            'flat_id' => $request->flat_id,
            'service_id' => $request->service_id,
            'request_date' => $request->request_date,
            'status' => 'pending',
        ];

        $serviceRequest = ServiceRequest::create($data);

        return response()->json([
            'message' => 'Service request submitted successfully',
            'data' => $serviceRequest
        ], 201);
    }
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:approved,rejected,completed',
            'charge' => 'nullable|numeric|min:0',
            'admin_note' => 'nullable|string',
        ]);

        $serviceRequest = ServiceRequest::findOrFail($id);
        $serviceRequest->status = $request->status;
        $serviceRequest->admin_note = $request->admin_note ?? null;

        if ($request->status === 'approved') {
            $serviceRequest->charge = $request->charge ?? 0;

            $rent = Rent::where('flat_id', $serviceRequest->flat_id)
                ->where('month', now()->format('F'))
                ->first();

            if ($rent) {
                $rent->utility_amount += $serviceRequest->charge;
                $rent->total_amount += $serviceRequest->charge;
                $rent->save();
            }
        }

        $serviceRequest->save();

        return response()->json([
            'message' => 'Service request status updated successfully',
            'data' => $serviceRequest
        ]);
    }
}
