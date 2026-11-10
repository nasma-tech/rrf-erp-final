<?php

namespace App\Models\ContactProjectRequestsModel;

use App\Models\CarsBrandModel\CarsBrandModel;
use App\Models\CarsGroupModel\CarsGroupModel;
use App\Models\CarsModelModel\CarsModelModel;
use App\Models\CarsTipModel\CarsTipModel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ContactProjectRequestsModel extends Model
{
    protected $table = 'ContactProjectRequests';
    protected $primaryKey = 'id';
    public $timestamps = false;
    
    use SoftDeletes;

    protected $fillable = [
        'contact_project_id',
        'car_group_id',
        'car_brand_id',
        'car_model_id',
        'car_tip_id',
        'request_amount',
        'user_id',
        'updated_at',
        'deleted_at'
    ];

    public function carGroupData(): HasOne
    {
        return $this->hasOne(CarsGroupModel::class,'id','car_group_id');
    }

    public function carBrandData(): HasOne
    {
        return $this->hasOne(CarsBrandModel::class,'id','car_brand_id');
    }

    public function carModelData(): HasOne
    {
        return $this->hasOne(CarsModelModel::class,'id','car_model_id');
    }

    public function carTipData(): HasOne
    {
        return $this->hasOne(CarsTipModel::class,'id','car_tip_id');
    }

}