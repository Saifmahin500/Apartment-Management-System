<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Rent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class InvoiceController extends Controller
{
    // Get all invoices
    public function index()
    {
        return response()->json(Invoice::with('rent')->latest()->get());
    }

    // Create a new invoice (for rent)
    public function store(Request $request)
    {
        $request->validate([
            'rent_id' => 'required|exists:rents,id',
            'invoice_date' => 'required|date'
        ]);

        // Generate a unique invoice number
        $invoiceNo = 'INV-' . strtoupper(Str::random(8));

        $invoice = Invoice::create([
            'rent_id' => $request->rent_id,
            'invoice_no' => $invoiceNo,
            'invoice_date' => $request->invoice_date,
            'pdf_url' => $request->pdf_url ?? null,
        ]);

        return response()->json(['message' => 'Invoice created successfully', 'data' => $invoice]);
    }

    // Show single invoice
    public function show($id)
    {
        $invoice = Invoice::with('rent')->findOrFail($id);
        return response()->json($invoice);
    }

    // Update invoice (for example, update PDF link)
    public function update(Request $request, $id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->update($request->all());
        return response()->json(['message' => 'Invoice updated successfully', 'data' => $invoice]);
    }

    // Delete invoice
    public function destroy($id)
    {
        $invoice = Invoice::findOrFail($id);
        $invoice->delete();
        return response()->json(['message' => 'Invoice deleted']);
    }
}
