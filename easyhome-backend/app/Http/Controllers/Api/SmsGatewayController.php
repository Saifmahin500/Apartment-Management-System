<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SmsGateway;
use Illuminate\Http\Request;

class SmsGatewayController extends Controller
{
    
    public function index()
    {
        return response()->json(SmsGateway::all());
    }

    
    public function store(Request $request)
    {
        $request->validate([
            'provider_name' => 'required|string|max:255',
            'api_key' => 'nullable|string',
            'sender_id' => 'nullable|string',
            'status' => 'boolean'
        ]);

        $gateway = SmsGateway::create($request->all());
        return response()->json(['message' => 'SMS Gateway added successfully', 'data' => $gateway]);
    }

    
    public function show($id)
    {
        $gateway = SmsGateway::findOrFail($id);
        return response()->json($gateway);
    }

    
    public function update(Request $request, $id)
    {
        $gateway = SmsGateway::findOrFail($id);
        $gateway->update($request->all());
        return response()->json(['message' => 'SMS Gateway updated successfully', 'data' => $gateway]);
    }

    
    public function destroy($id)
    {
        $gateway = SmsGateway::findOrFail($id);
        $gateway->delete();
        return response()->json(['message' => 'SMS Gateway deleted']);
    }
}
