<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Invoice;
use App\Models\Notification;
use Carbon\Carbon;

class CheckInvoiceDue extends Command
{
    protected $signature = 'invoices:check-due';
    protected $description = 'Check for due invoices and send notifications';

    public function handle()
    {
        $today = Carbon::today();

        $dueInvoices = Invoice::whereDate('due_date', '<=', $today)
            ->where('status', 'Unpaid')
            ->get();

        foreach ($dueInvoices as $inv) {
            Notification::create([
                'user_id' => $inv->tenant_id,
                'title' => 'Invoice Due Reminder',
                'message' => "Invoice {$inv->invoice_number} is due on {$inv->due_date}. Please make payment.",
                'type' => 'System',
                'status' => 'Unread',
            ]);
        }

        $this->info('✅ Due invoice notifications created successfully!');
    }
}
