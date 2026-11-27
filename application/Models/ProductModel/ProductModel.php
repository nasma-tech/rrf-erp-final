<?php

namespace App\Models\ProductModel;

use App\Models\brandsModel\brandsModel;
use App\Models\MeasurementUnitModel\MeasurementUnitModel;
use App\Models\ProductChildModel\ProductChildModel;
use App\Models\ProductGradeModel\ProductGradeModel;
use App\Models\ProductGroupModel\ProductGroupModel;
use App\Models\ProductQualitiesModel\ProductQualitiesModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Collection;

class ProductModel extends Model
{
    use SoftDeletes;

    protected $table = 'products';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'parent_id',
        'parent_unit_ratio',
        'label',
        'serial_number',
        'group_id',
        'grade_id',
        'brand_id',
        'quality_level_id',
        'measurement_unit_id',
        'unit_id',
        'cost_price',
        'sale_price',
        'customer_price',
        'file_address',
        'description',
        'complete_description',
        'saleable',
        'user_id',
    ];


    public function scopeSaleable($query)
    {
        if (userObject()->userId <= 0) {
            return $query->where('saleable', 1);
        } else {
            return $query;
        }
    }

    public function measurementUnit(): BelongsTo
    {
        return $this->belongsTo(MeasurementUnitModel::class, 'measurement_unit_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(brandsModel::class, 'brand_id');
    }

    public function productGroup(): BelongsTo
    {
        return $this->belongsTo(ProductGroupModel::class, 'group_id');
    }

    public function grade(): BelongsTo
    {
        return $this->belongsTo(ProductGradeModel::class, 'grade_id');
    }

    public function quality(): BelongsTo
    {
        return $this->belongsTo(ProductQualitiesModel::class, 'quality_level_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProductModel::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ProductModel::class, 'parent_id');
    }

    public function productChildren(): HasMany
    {
        return $this->hasMany(
            ProductChildModel::class,
            'product_id',
            'id'
        );
    }

}