<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'rent_id',
        'invoice_no',
        'invoice_date',
        'pdf_url'
    ];

    public function rent()
    {
        return $this->belongsTo(Rent::class);
    }
}
