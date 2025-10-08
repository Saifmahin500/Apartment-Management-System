<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rent extends Model
{
    use HasFactory;

    protected $fillable = [
        'flat_id',
        'month',
        'year',
        'rent_amount',
        'utility_amount',
        'maintenance_charge',
        'total_amount',
        'due_amount',
        'status'
    ];

    public function flat()
    {
        return $this->belongsTo(Flat::class);
    }

    public function payments()
    {
        return $this->hasMany(RentPayment::class);
    }
}
