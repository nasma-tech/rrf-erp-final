<?php

namespace App\Models\ExitWarehouseModel;

use App\Models\ExitWarehousePackageModel\ExitWarehousePackageModel;
use App\Models\ProductChildModel\ProductChildModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExitWarehouseModel extends Model
{
    protected $table = 'exitWarehouse';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        'exit_package_id',
        'product_id',
        'product_child_id',
        'amount',
        'unit_id',
        'exit_datetime',
        'exit_status',
        'user_id',
        'updated_at',
        'deleted_at',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(
            ExitWarehousePackageModel::class,
            'exit_package_id',
            'id'
        );
    }

    public function productChild(): BelongsTo
    {
        return $this->belongsTo(
            ProductChildModel::class,
            'product_child_id',
            'id'
        );
    }
}