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
        "group_id",
        "grade_id",
        "brand_id",
        "quality_level_id",
        "unit_id",
        "parent_unit_ratio",
        "title",
        "serial_number",
        "column_name",
        "sale_price",
        "customer_price",
        "file_address",
        "user_id",
        "updated_at",
        "deleted_at",
    ];

}