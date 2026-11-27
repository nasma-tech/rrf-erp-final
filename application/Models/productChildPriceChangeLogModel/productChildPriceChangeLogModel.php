<?php

namespace App\Models\productChildPriceChangeLogModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class productChildPriceChangeLogModel extends Model
{
    protected $table = 'product_child_price_change_logs';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        'product_child_id',
        'cost_price',
        'sale_price',
        'customer_price',
        'user_id',
        'modified_at',
    ];

}