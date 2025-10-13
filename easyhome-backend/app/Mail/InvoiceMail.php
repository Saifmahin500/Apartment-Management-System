<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function build()
    {
        $pdf = Pdf::loadView('invoices.pdf', ['invoice' => $this->invoice]);

        return $this->subject('Your Invoice from EasyHome')
            ->markdown('emails.invoice')
            ->attachData($pdf->output(), $this->invoice->invoice_number . '.pdf');
    }
}
