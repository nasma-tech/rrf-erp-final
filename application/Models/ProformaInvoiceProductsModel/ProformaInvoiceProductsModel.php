<?php

namespace App\Models\ProformaInvoiceProductsModel;

use App\Models\MeasurementUnitModel\MeasurementUnitModel;
use App\Models\ProductChildModel\ProductChildModel;
use App\Models\ProductModel\ProductModel;
use App\Models\ProductPartItemModel\ProductPartItemModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaInvoiceProductsModel extends Model
{
    protected $table = 'ProformaInvoiceProducts';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        'proforma_invoice_id',
        'product_id',
        'product_child_id',
        'unit_id',
        'amount',
        'unit_price',
        'unit_price_edit',
        'sum_unit_price',
        'discount_type',
        'discount_unit_amount',
        'discount_unit_amount_cash',
        'discount_amount',
        'total_unit_price',
        'total_product_price',
        'updated_at',
        'deleted_at'
    ];

    public function product(): HasOne
    {
        return $this->hasOne(ProductModel::class, 'id', 'product_id');
    }

    public function allocation(): HasMany
    {
        return $this->hasMany(ProductPartItemModel::class, 'invoice_product_id', 'id');
    }

    public function productChild(): HasOne
    {
        return $this->hasOne(ProductChildModel::class, 'id', 'product_child_id');
    }

    public function unit(): ?MeasurementUnitModel
    {
        if ($this->product_child_id) {
            return $this->productChild?->measurementUnit;
        }

        return $this->product?->measurementUnit;
    }
}