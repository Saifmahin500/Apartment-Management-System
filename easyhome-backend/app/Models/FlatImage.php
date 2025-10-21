<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FlatImage extends Model
{
    use HasFactory;

    protected $fillable = ['flat_id', 'image'];

    public function flat()
    {
        return $this->belongsTo(Flat::class, 'flat_id');
    }
}
