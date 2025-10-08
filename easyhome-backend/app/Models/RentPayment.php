<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'rent_id',
        'amount_paid',
        'payment_method',
        'transaction_id',
        'payment_date'
    ];

    public function rent()
    {
        return $this->belongsTo(Rent::class);
    }
}
