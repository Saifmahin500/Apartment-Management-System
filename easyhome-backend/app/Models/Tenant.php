<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'flat_id',
        'name',
        'email',
        'phone',
        'start_date',
        'end_date',
        'monthly_rent'
    ];

    public function flat()
    {
        return $this->belongsTo(Flat::class);
    }
}
