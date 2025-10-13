<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <title>Invoice - {{ $invoice->invoice_number }}</title>
  <style>
    body {
      font-family: 'DejaVu Sans', sans-serif;
      background: #f9f9f9;
      margin: 0;
      padding: 0;
      color: #333;
    }

    .invoice-container {
      background: #fff;
      width: 90%;
      margin: 30px auto;
      padding: 30px 40px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }

    .header h2 {
      color: #007bff;
      margin: 0;
    }

    .company-info {
      text-align: right;
      font-size: 13px;
    }

    .invoice-details {
      margin-top: 20px;
      background: #f3f6fc;
      padding: 15px;
      border-radius: 6px;
    }

    .invoice-details p {
      margin: 6px 0;
      font-size: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
    }

    table,
    th,
    td {
      border: 1px solid #ccc;
    }

    th {
      background: #007bff;
      color: white;
      padding: 10px;
      text-align: left;
    }

    td {
      padding: 10px;
    }

    .status {
      display: inline-block;
      padding: 5px 10px;
      color: #fff;
      border-radius: 5px;
      font-weight: bold;
    }

    .status.Paid {
      background: #28a745;
    }

    .status.Unpaid {
      background: #dc3545;
    }

    .footer {
      text-align: center;
      font-size: 13px;
      color: #666;
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 10px;
    }
  </style>
</head>

<body>
  @php
  $rent = $invoice->rent->rent_amount ?? 0;
  $utility = $invoice->rent->utility_amount ?? 0;
  $maintenance = $invoice->rent->maintenance_charge ?? 0;
  $total = $rent + $utility + $maintenance;
  @endphp

  <div class="invoice-container">
    <div class="header">
      <h2>🏢 EasyHome Invoice</h2>
      <div class="company-info">
        <strong>EasyHome Apartment System</strong><br>
        Mirpur 10, Dhaka, Bangladesh<br>
        📞 +880 1856590532<br>
        ✉️ easyhome@mail.com
      </div>
    </div>

    <div class="invoice-details">
      <p><strong>Invoice No:</strong> {{ $invoice->invoice_number }}</p>
      <p><strong>Flat:</strong> {{ $invoice->flat->name ?? '-' }}</p>
      <p><strong>Tenant:</strong> {{ $invoice->tenant->name ?? '-' }}</p>
      <p><strong>Issue Date:</strong> {{ \Carbon\Carbon::parse($invoice->created_at)->format('F d, Y') }}</p>
      <p><strong>Due Date:</strong> {{ \Carbon\Carbon::parse($invoice->due_date)->format('F d, Y') }}</p>
      <p><strong>Status:</strong>
        <span>{{ $invoice->status }}</span>
      </p>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th style="text-align:right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Rent</td>
          <td>Monthly apartment rent</td>
          <td style="text-align:right">{{ number_format($rent, 2) }}</td>
        </tr>
        <tr>
          <td>Utility</td>
          <td>Electricity, Gas, Water bills</td>
          <td style="text-align:right">{{ number_format($utility, 2) }}</td>
        </tr>
        <tr>
          <td>Maintenance</td>
          <td>Building and service maintenance</td>
          <td style="text-align:right">{{ number_format($maintenance, 2) }}</td>
        </tr>
        <tr>
          <th colspan="2" style="text-align:right">Grand Total</th>
          <th style="text-align:right">{{ number_format($total, 2) }}</th>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      Thank you for staying with us!<br>
      <strong>EasyHome Management System</strong><br>
      This is a system-generated invoice.
    </div>
  </div>
</body>

</html>