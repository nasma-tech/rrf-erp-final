<?php

namespace App\Models\priceChangeLogsModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class priceChangeLogsModel extends Model
{
    protected $table = 'price_change_logs';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        //col Name
        "product_id",
        "previous_price",
        "new_price",
        "user_id",
        "modified_at",
        "created_at",
        "deleted_at",
    ];

}