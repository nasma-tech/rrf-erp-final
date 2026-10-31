<?php

namespace App\Models\ProductModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductModel extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        "parent_id",
        "parent_unit_ratio",
        "label",
        "serial_number",
        "group_id",
        "grade_id",
        "brand_id",
        "quality_level_id",
        "measurement_unit_id",
        "cost_price",
        "sale_price",
        "customer_price",
        "file_address",
        "description",
        "complete_description",
        "user_id",
    ];

}