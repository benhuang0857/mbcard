<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $table = 'members';

    protected $guarded = [];

    public function portfolio()
    {
        return $this->hasOne('App\Portfolio', 'uid', 'id');
    }

    public function companies()
    {
        return $this->hasMany('App\Company', 'uid', 'id');
    }

    // 會員收藏的對象
    public function favorites()
    {
        return $this->belongsToMany(Member::class, 'member_favorites', 'member_id', 'favorite_member_id');
    }

    // 收藏了該會員的人
    public function favoritedBy()
    {
        return $this->belongsToMany(Member::class, 'member_favorites', 'favorite_member_id', 'member_id');
    }
}
