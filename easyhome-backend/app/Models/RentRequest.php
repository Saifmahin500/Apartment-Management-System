<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentRequest extends Model
{
    use HasFactory;

    protected $fillable = ['tenant_id', 'flat_id', 'status'];

    public function tenant()
        {
            return $this->belongsTo(User::class, 'tenant_id');
        }

        public function flat()
        {
            return $this->belongsTo(Flat::class, 'flat_id');
        }

}

