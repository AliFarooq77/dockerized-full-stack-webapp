<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meal extends Model
{
    protected $fillable = ['name', 'icon'];
    //
    public function foods(){
        return $this->hasMany(Food::class);
    }
}
