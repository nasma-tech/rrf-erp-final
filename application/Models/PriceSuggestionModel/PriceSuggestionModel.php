<?php

namespace App\Models\PriceSuggestionModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PriceSuggestionModel extends Model
{
    protected $table = '';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    use SoftDeletes;

    protected $fillable = [
        //col Name
    ];

}