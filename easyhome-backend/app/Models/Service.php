<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'base_charge',
    ];

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class);
    }
}
