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
        'product_id',
        'request_amount',
        'user_id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];


}