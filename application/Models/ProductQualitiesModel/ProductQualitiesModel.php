<?php

namespace App\Models\ProductQualitiesModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductQualitiesModel extends Model
{
    protected $table = 'product_quality_levels';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        "label",
        "user_id",
        "create_at",
        "update_at",
        "deleted_at",
    ];

}