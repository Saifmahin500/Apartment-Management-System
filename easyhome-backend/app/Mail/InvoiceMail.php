<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceMail extends Mailable
{
    use Queueable, SerializesModels;

    public $invoice;
    public $pdf;

    public function __construct($invoice, $pdf = null)
    {
        $this->invoice = $invoice;
        $this->pdf = $pdf;
    }

    public function build()
    {
        $mail = $this->subject('🧾 Your Invoice from EasyHome')
                     ->markdown('emails.invoice')
                     ->with(['invoice' => $this->invoice]);

        
        if ($this->pdf) {
            $mail->attachData(
                $this->pdf->output(),
                'invoice-' . $this->invoice->invoice_number . '.pdf',
                ['mime' => 'application/pdf']
            );
        }

        return $mail;
    }
}

