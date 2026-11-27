<?php

namespace App\Models\ContactProjectRequestsModel;

use App\Models\ProductChildModel\ProductChildModel;
use App\Models\ProductModel\ProductModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactProjectRequestsModel extends Model
{
    protected $table = 'ContactProjectRequests';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        'contact_project_id',
        'product_id',
        'product_child_id',
        'request_amount',
        'user_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function productInfo(): BelongsTo
    {
        return $this->belongsTo(
            ProductModel::class,
            'product_id',
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