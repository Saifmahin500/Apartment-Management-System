<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Flat;
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

    public function flat()
    {
        return $this->belongsTo(Flat::class, 'flat_id');
    }

    /**
     * Automatically update flat status when tenant created/updated/deleted
     */
    protected static function boot()
    {
        parent::boot();

        // ✅ যখন নতুন tenant তৈরি হয়
        static::created(function ($tenant) {
            if ($tenant->flat_id) {
                Flat::where('id', $tenant->flat_id)->update(['status' => 'occupied']);
            }
        });

        // ✅ যখন tenant আপডেট হয় (ফ্ল্যাট পরিবর্তন করলে পুরনো ফ্ল্যাট আবার available হবে)
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

        // ✅ যখন tenant ডিলিট হয়
        static::deleted(function ($tenant) {
            if ($tenant->flat_id) {
                Flat::where('id', $tenant->flat_id)->update(['status' => 'available']);
            }
        });
    }

    // Optional helper for formatted dates
    public function getFormattedStartDateAttribute()
    {
        return $this->start_date ? Carbon::parse($this->start_date)->format('d-m-Y') : null;
    }

    public function getFormattedEndDateAttribute()
    {
        return $this->end_date ? Carbon::parse($this->end_date)->format('d-m-Y') : null;
    }
}
