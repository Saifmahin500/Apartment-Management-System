<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\Flat;
use App\Models\Tenant;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Mail\InvoiceMail;
use Illuminate\Support\Facades\Mail;
use App\Models\Rent;


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

        $rent = Rent::where('flat_id', $request->flat_id)
            ->latest()
            ->first();

        $invoice = Invoice::create([
            'invoice_number' => 'INV-' . now()->format('YmdHis'),
            'flat_id' => $request->flat_id,
            'tenant_id' => $request->tenant_id,
            'rent_amount' => $rent->rent_amount ?? 0,
            'utility_amount' => $rent->utility_amount ?? 0,
            'maintenance_charge' => $rent->maintenance_charge ?? 0,
            'total_amount' => $request->total_amount,
            'due_date' => $request->due_date,
            'status' => 'Unpaid',
            'notes' => $request->notes,
        ]);

        return response()->json(['message' => 'Invoice created successfully', 'invoice' => $invoice]);
    }

    public function downloadPdf($id)
    {
        $invoice = Invoice::with(['flat', 'tenant', 'rent'])->findOrFail($id);
        $pdf = Pdf::loadView('invoices.pdf', compact('invoice'));
        return $pdf->stream('invoice-' . $invoice->invoice_number . '.pdf');
    }

    public function sendEmail($id)
    {
        $invoice = Invoice::with(['flat', 'tenant'])->findOrFail($id);

        // 🧾 Rent Breakdown attach
        $rent = Rent::where('flat_id', $invoice->flat_id)->latest()->first();
        $invoice->rent_amount = $rent->rent_amount ?? 0;
        $invoice->utility_amount = $rent->utility_amount ?? 0;
        $invoice->maintenance_charge = $rent->maintenance_charge ?? 0;

        
        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $invoice]);

     
        Mail::to($invoice->tenant->email)->send(new InvoiceMail($invoice, $pdf));

        return response()->json(['message' => 'Invoice email sent with PDF attached!']);
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

    public function filter(Request $request)
    {
        $query = Invoice::with(['flat', 'tenant']);
        if ($request->month && $request->year) {
            $query->whereMonth('due_date', $request->month)
                ->whereYear('due_date', $request->year);
        }
        return response()->json($query->get());
    }
}
