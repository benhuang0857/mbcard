<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $table = "companies";

    protected $fillable = [
        'uid',
        'name',
        'bg_color', 
        'video', 
        'voice', 
        'facebook', 
        'instagram', 
        'linkedin', 
        'line',
        'description',
        'status'
    ];

    public function member()
    {
        return $this->belongsTo('App\Member', 'uid', 'id');
    }
}
