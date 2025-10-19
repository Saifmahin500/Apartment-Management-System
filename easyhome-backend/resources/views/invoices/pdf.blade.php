<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice - {{ $invoice->invoice_number }}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: #fff;
      color: #333;
      font-size: 13px;
      padding: 10px;
      position: relative;
    }

    /* ===== Watermark ===== */
    body::before {
      content: "EasyHome";
      position: fixed;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      font-size: 80px;
      color: rgba(23, 162, 184, 0.08);
      font-weight: 900;
      pointer-events: none;
      z-index: 0;
    }

    .invoice-container {
      background: #ffffff;
      max-width: 750px;
      margin: 0 auto;
      padding: 20px;
      border-radius: 6px;
      border: 1px solid #e0e0e0;
      position: relative;
      z-index: 1;
    }

    /* Header Section */
    .header {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #17A2B8;
      align-items: center;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-logo {
      width: 45px;
      height: 45px;
      border-radius: 6px;
      object-fit: cover;
    }

    .brand-info h2 {
      color: #17A2B8;
      font-size: 20px;
      font-weight: 700;
    }

    .brand-info p {
      color: #6c757d;
      font-size: 12px;
      margin: 0;
    }

    .company-info {
      text-align: right;
    }

    .company-info h4 {
      color: #212529;
      font-size: 13px;
      font-weight: 600;
    }

    .company-info p {
      font-size: 11px;
      color: #6c757d;
      line-height: 1.4;
      margin: 0;
    }

    /* Invoice Details Section */
    .invoice-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 15px 0;
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
      border-left: 4px solid #17A2B8;
    }

    .detail-group h5 {
      color: #6c757d;
      font-size: 11px;
      text-transform: uppercase;
      margin-bottom: 6px;
      font-weight: 700;
    }

    .detail-item {
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
    }

    .detail-label {
      color: #6c757d;
      font-size: 12px;
    }

    .detail-value {
      color: #212529;
      font-size: 12px;
      font-weight: 600;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 10px;
      text-transform: uppercase;
    }

    .status-badge.Paid {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.Unpaid {
      background: #f8d7da;
      color: #721c24;
    }

    .status-badge.Sent {
      background: #d1ecf1;
      color: #0c5460;
    }

    /* Items Table */
    .items-section {
      margin: 20px 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background: #17A2B8;
      color: white;
    }

    th {
      padding: 10px;
      text-align: left;
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
    }

    th.amount {
      text-align: right;
    }

    td {
      padding: 8px;
      border-bottom: 1px solid #e9ecef;
      font-size: 12px;
    }

    .amount-cell {
      text-align: right;
      font-weight: 600;
      color: #17A2B8;
    }

    .total-row td {
      padding: 10px 8px;
      border-top: 2px solid #17A2B8;
      font-weight: 700;
      font-size: 13px;
      color: #212529;
    }

    .total-row .amount {
      text-align: right;
      font-size: 14px;
      color: #17A2B8;
    }

    /* Summary Section */
    .summary-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 15px;
      margin-top: 15px;
      align-items: start;
    }

    .notes {
      padding: 10px;
      background: #fff3cd;
      border-left: 3px solid #ffc107;
      border-radius: 5px;
    }

    .notes h6 {
      color: #856404;
      font-size: 11px;
      margin-bottom: 5px;
      font-weight: 700;
    }

    .notes p {
      color: #856404;
      font-size: 12px;
      line-height: 1.4;
      margin: 0;
    }

    .summary-box {
      background: #f1fdfd;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #17A2B8;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }

    .summary-item strong {
      color: #212529;
    }

    .summary-item span {
      color: #17A2B8;
      font-weight: 600;
    }

    /* Signature Section */
    .signature {
      margin-top: 25px;
      display: flex;
      justify-content: flex-end;
      text-align: center;
    }

    .signature-box {
      width: 200px;
      border-top: 1px solid #333;
      padding-top: 5px;
      font-size: 12px;
      color: #333;
    }

    /* Footer */
    .footer {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid #e9ecef;
      text-align: center;
    }

    .footer-text {
      color: #6c757d;
      font-size: 11px;
      line-height: 1.6;
    }

    .footer-brand {
      color: #17A2B8;
      font-weight: 700;
      font-size: 12px;
      margin: 4px 0;
    }

    /* Print optimization */
    @media print {
      * {
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        page-break-inside: avoid !important;
      }

      html,
      body {
        height: 100%;
        overflow: hidden;
      }

      .invoice-container {
        box-shadow: none;
        border-radius: 0;
        transform: scale(0.95);
        transform-origin: top left;
      }

      body::before {
        opacity: 0.08;
      }
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
    <!-- Header -->
    <div class="header">
      <div class="brand">
        <img src="{{ public_path('images/easyhome_logo.png') }}" alt="Logo" class="brand-logo">
        <div class="brand-info">
          <h2>EasyHome</h2>
          <p>Apartment Management</p>
        </div>
      </div>
      <div class="company-info">
        <h4>EasyHome Apartment System</h4>
        <p>Mirpur 10, Dhaka, Bangladesh<br>+880 1856590532<br>easyhome@mail.com</p>
      </div>
    </div>

    <!-- Invoice Details -->
    <div class="invoice-details">
      <div class="detail-group">
        <h5>Invoice Info</h5>
        <div class="detail-item"><span class="detail-label">Invoice No:</span><span
            class="detail-value">{{ $invoice->invoice_number }}</span></div>
        <div class="detail-item"><span class="detail-label">Issue Date:</span><span
            class="detail-value">{{ \Carbon\Carbon::parse($invoice->created_at)->format('M d, Y') }}</span></div>
        <div class="detail-item"><span class="detail-label">Due Date:</span><span
            class="detail-value">{{ \Carbon\Carbon::parse($invoice->due_date)->format('M d, Y') }}</span></div>
      </div>

      <div class="detail-group">
        <h5>Tenant Info</h5>
        <div class="detail-item"><span class="detail-label">Flat:</span><span
            class="detail-value">{{ $invoice->flat->name ?? '-' }}</span></div>
        <div class="detail-item"><span class="detail-label">Tenant:</span><span
            class="detail-value">{{ $invoice->tenant->name ?? '-' }}</span></div>
        <div class="detail-item"><span class="detail-label">Status:</span><span
            class="status-badge {{ $invoice->status }}">{{ $invoice->status }}</span></div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="items-section">
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Rent</strong></td>
            <td>Monthly apartment rent</td>
            <td class="amount-cell">  {{ number_format($rent, 2) }}</td>
          </tr>
          <tr>
            <td><strong>Utility</strong></td>
            <td>Electricity, Gas, Water bills</td>
            <td class="amount-cell">  {{ number_format($utility, 2) }}</td>
          </tr>
          <tr>
            <td><strong>Maintenance</strong></td>
            <td>Building and service maintenance</td>
            <td class="amount-cell">  {{ number_format($maintenance, 2) }}</td>
          </tr>
          <tr class="total-row">
            <td colspan="2" class="label">Grand Total</td>
            <td class="amount">  {{ number_format($total, 2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Summary Section -->
    <div class="summary-section">
      @if($invoice->notes)
      <div class="notes">
        <h6>📝 Notes</h6>
        <p>{{ $invoice->notes }}</p>
      </div>
      @endif

      <div class="summary-box">
        <div class="summary-item"><strong>Rent:</strong><span>  {{ number_format($rent, 2) }}</span></div>
        <div class="summary-item"><strong>Utility:</strong><span>  {{ number_format($utility, 2) }}</span></div>
        <div class="summary-item"><strong>Maintenance:</strong><span>  {{ number_format($maintenance, 2) }}</span></div>
        <hr style="border:none;border-top:1px solid #17A2B8;margin:6px 0;">
        <div class="summary-item" style="font-weight:700;"><strong>Total:</strong><span>  {{ number_format($total, 2) }}</span></div>
      </div>
    </div>

    <!-- Signature Section -->
    <div class="signature">
      <div class="signature-box">
        Authorized Signature<br>
        <small>EasyHome Management</small>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-text">
        <p>Thank you for staying with us! We appreciate your cooperation.</p>
        <p class="footer-brand">EasyHome Management System</p>
        <p style="font-size:10px;color:#999;">This is a system-generated invoice. For inquiries, please contact us.</p>
      </div>
    </div>
  </div>
</body>

</html>
