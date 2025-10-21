<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Flat extends Model
{
    use HasFactory;

    protected $fillable = [
        'building_id',
        'name',
        'flat_number',
        'floor',
        'rent_amount',
        'size',
        'image',
        'status',
        'is_occupied',
    ];

    public function building()
    {
        return $this->belongsTo(Building::class);
    }

    public function tenant()
    {
        return $this->hasOne(Tenant::class);
    }
    public function images()
    {
        return $this->hasMany(FlatImage::class, 'flat_id', 'id');
    }

}
