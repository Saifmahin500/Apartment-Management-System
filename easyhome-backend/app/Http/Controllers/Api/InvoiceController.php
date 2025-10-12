<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Flat;
use App\Models\Tenant;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['flat', 'tenant'])->orderBy('id', 'desc')->get();
        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $request->validate([
            'flat_id' => 'required|exists:flats,id',
            'tenant_id' => 'required|exists:tenants,id',
            'total_amount' => 'required|numeric|min:0',
            'due_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('YmdHis'),
            'flat_id' => $request->flat_id,
            'tenant_id' => $request->tenant_id,
            'total_amount' => $request->total_amount,
            'due_date' => $request->due_date,
            'status' => 'Unpaid',
            'notes' => $request->notes,
        ]);

        return response()->json(['message' => 'Invoice created successfully', 'invoice' => $invoice]);
    }

    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);
    
        $invoice->update([
            'status' => $request->status,
            'notes' => $request->notes,
            'paid_at' => $request->status === 'Paid' ? now() : null,
        ]);
    
        return response()->json(['message' => 'Invoice updated successfully']);
    }
    

    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted successfully']);
    }
}

