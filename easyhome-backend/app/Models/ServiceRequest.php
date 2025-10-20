<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'flat_id',
        'service_id',
        'request_date',
        'status',
        'admin_note',
        'charge',
    ];
    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function flat()
    {
        return $this->belongsTo(Flat::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
