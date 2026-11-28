<?php

namespace App\Models\ExitWarehousePackageModel;

use App\Models\ExitWarehouseModel\ExitWarehouseModel;
use App\Models\ProductPartModel\ProductPartModel;
use App\Models\WarehousesModel\WarehousesModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ExitWarehousePackageModel extends Model
{
    protected $table = 'exitWarehousePackages';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        "warehouse_id",
        "product_part_id",
        "title",
        "user_id",
        "updated_at",
        "deleted_at",
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(
            WarehousesModel::class,
            'warehouse_id',
            'id'
        );
    }

    public function productPart(): BelongsTo
    {
        return $this->belongsTo(
            ProductPartModel::class,
            'product_part_id',
            'id'
        );
    }

    public function exitWarehouseItems(): HasMany
    {
        return $this->hasMany(
            ExitWarehouseModel::class,
            'exit_package_id',
            'id'
        );
    }
}