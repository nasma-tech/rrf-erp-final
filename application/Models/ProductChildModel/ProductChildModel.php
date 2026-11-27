<?php

namespace App\Models\ProductChildModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductChildModel extends Model
{
    protected $table = 'productChildren';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        "product_id",
        "label",
        "unit_id",
        "convert_ratio",
        "cost_price",
        "sale_price",
        "customer_price",
        "saleable",
        "user_id",
        "created_at",
        "updated_at",
        "deleted_at",
    ];

}