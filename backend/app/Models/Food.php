<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    protected $fillable = ['name', 'calories', 'protein', 'carbs', 'fat', 'date'];
    protected $table = 'foods';
    //
    public function meal(){
        return $this->belongsTo(Meal::class);
    }
}
