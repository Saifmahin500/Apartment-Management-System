<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: DejaVu Sans, sans-serif; }
    h2 { text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    td, th { border: 1px solid #ddd; padding: 8px; }
  </style>
</head>
<body>
  <h2>Invoice - {{ $invoice->invoice_number }}</h2>
  <p><strong>Tenant:</strong> {{ $invoice->tenant->name }}</p>
  <p><strong>Flat:</strong> {{ $invoice->flat->name }}</p>
  <p><strong>Total:</strong> ৳{{ $invoice->total_amount }}</p>
  <p><strong>Status:</strong> {{ $invoice->status }}</p>
  <p><strong>Due Date:</strong> {{ $invoice->due_date }}</p>
  <hr>
  <p>{{ $invoice->notes }}</p>
</body>
</html>
