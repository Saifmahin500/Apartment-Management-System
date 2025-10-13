@component('mail::message')
# Hello {{ $invoice->tenant->name }},

Here is your invoice for **{{ $invoice->flat->name }}**.

---

### 🧾 Invoice Summary:
**💰 Total:** ৳{{ number_format($invoice->total_amount, 2) }}
**📅 Due Date:** {{ \Carbon\Carbon::parse($invoice->due_date)->format('F j, Y') }}
**📊 Status:** {{ $invoice->status }}

@if($invoice->notes)
**📝 Notes:**
{{ $invoice->notes }}
@endif

---

@component('mail::button', ['url' => url('/invoices/' . $invoice->id . '/pdf')])
📄 Download Invoice PDF
@endcomponent

Thanks,<br>
**{{ config('app.name', 'EasyHome') }} Team**
@endcomponent