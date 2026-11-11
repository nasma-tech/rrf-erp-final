<?php

namespace App\Models\ImplementationTeamModifyLogModel;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ImplementationTeamModifyLogModel extends Model
{
    protected $table = 'tbl_ImplementationTeamModifyLog';
    protected $primaryKey = 'id';
    public $timestamps = false;

    use SoftDeletes;

    protected $fillable = [
        "team_id",
        "team_title",
        "team_data_json",
        "nodes_data_json",
        "user_id",
        "updated_at",
        "deleted_at"
    ];

}