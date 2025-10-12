<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'flat_id',
        'tenant_id',
        'total_amount',
        'status',
        'due_date',
        'paid_at',
        'notes'
    ];

    public function flat()
    {
        return $this->belongsTo(Flat::class);
    }

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}

