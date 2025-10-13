@component('mail::message')
# 🏠 Hello {{ $invoice->tenant->name }},

Here is your latest invoice for **{{ $invoice->flat->name }}**.

---

## 💡 Rent Breakdown:

| Description | Amount (৳) |
| :----------- | ----------: |
| 🏘️ **Rent** | {{ number_format($invoice->rent_amount ?? 0, 2) }} |
| ⚡ **Utility** | {{ number_format($invoice->utility_amount ?? 0, 2) }} |
| 🧰 **Maintenance** | {{ number_format($invoice->maintenance_charge ?? 0, 2) }} |
| 💰 **Total** | **{{ number_format($invoice->total_amount, 2) }}** |

---

## 📅 Invoice Summary:

- **Due Date:** {{ \Carbon\Carbon::parse($invoice->due_date)->format('F j, Y') }}
- **Status:** @if($invoice->status === 'Paid') ✅ Paid @else 🕒 Unpaid @endif

@if($invoice->notes)
> 📝 **Note:**  
> {{ $invoice->notes }}
@endif

---

@component('mail::button', ['url' => url('/invoices/' . $invoice->id . '/pdf')])
📄 Download Invoice PDF
@endcomponent

Thanks,<br>
**{{ config('app.name', 'EasyHome') }} Team**

@endcomponent
