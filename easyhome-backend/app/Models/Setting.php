<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'site_name',
        'site_logo',
        'email',
        'phone',
        'address',
        'currency',
        'payment_method',
    ];

    /**
     * Accessor for full logo URL.
     */
    public function getSiteLogoUrlAttribute()
    {
        if ($this->site_logo) {
            return asset('storage/' . $this->site_logo);
        }
        return asset('images/default-logo.png');
    }
}
