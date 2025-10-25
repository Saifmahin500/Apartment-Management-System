<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Flat;
use App\Models\Rent;
use App\Models\ServiceRequest;
use Carbon\Carbon;

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
        'monthly_rent',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // ✅ সম্পর্কসমূহ
    public function flat()
    {
        return $this->belongsTo(Flat::class, 'flat_id');
    }

    public function rents()
    {
        return $this->hasMany(Rent::class, 'tenant_id');
    }

    public function serviceRequests()
    {
        return $this->hasMany(ServiceRequest::class, 'tenant_id');
    }

    // ✅ ফ্ল্যাট স্ট্যাটাস আপডেট হ্যান্ডলিং
    protected static function boot()
    {
        parent::boot();

        static::created(function ($tenant) {
            if ($tenant->flat_id) {
                Flat::where('id', $tenant->flat_id)->update(['status' => 'occupied']);
            }
        });

        static::updated(function ($tenant) {
            if ($tenant->isDirty('flat_id')) {
                $originalFlat = $tenant->getOriginal('flat_id');
                if ($originalFlat) {
                    Flat::where('id', $originalFlat)->update(['status' => 'available']);
                }
                if ($tenant->flat_id) {
                    Flat::where('id', $tenant->flat_id)->update(['status' => 'occupied']);
                }
            }
        });

        static::deleted(function ($tenant) {
            if ($tenant->flat_id) {
                Flat::where('id', $tenant->flat_id)->update(['status' => 'available']);
            }
        });
    }

    // ✅ তারিখ ফরম্যাটিং
    public function getFormattedStartDateAttribute()
    {
        return $this->start_date ? Carbon::parse($this->start_date)->format('d-m-Y') : null;
    }

    public function getFormattedEndDateAttribute()
    {
        return $this->end_date ? Carbon::parse($this->end_date)->format('d-m-Y') : null;
    }
}
