<?php
namespace App\Controllers\Warehouses;
use App\Controllers\scheme\ControllerScheme;
use App\Models\brandsModel\brandsModel;
use App\Models\CountryModel\CountryModel;
use App\Models\WarehousesModel\WarehousesModel;

class Warehouses extends ControllerScheme{
        const string singleName = 'انبار';
        const string pluralName = 'انبارها';
        protected string $defaultModel = WarehousesModel::class;
        
        public function main(){
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->ui([
            'vendors/js/tables/datatable/datatables.min',
            'vendors/js/tables/datatable/dataTables.bootstrap4.min',
            'vendors/js/tables/datatable/dataTables.buttons.min',
            'vendors/js/tables/datatable/buttons.html5.min',
            'vendors/js/tables/datatable/buttons.print.min',
            'vendors/js/tables/datatable/buttons.bootstrap.min',
            'vendors/js/tables/datatable/jszip.min',
            'vendors/js/tables/datatable/pdfmake.min',
            'vendors/js/tables/datatable/vfs_fonts',
            'vendors/js/tables/datatable/buttons.colVis.min',
            //'js/Warehouses/Warehouses'
        ],
            ['vendors/css/tables/datatable/datatables.min'],
            [
            //vars
                ])->display('Warehouses/Warehouses.tpl');
    }
    
        public function addIndex(){
                view->setPageTitle(self::pluralName);
                view->setSingleName(self::singleName);
                view->setPluralName(self::pluralName);
                view->ui([
                    'js/Warehouses/add-Warehouses'
                ], [],
                    [//vars
                        'brands' => brandsModel::query()->get(),
                        'countries' => countryModel::query()->get(),
                    ]
                )->display('Warehouses/add-Warehouses.tpl');
            }
            
        public function editIndex($id){
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        //name this model
        view->setModel();
        view->ui([
            //'js/Warehouses/edit-Warehouses'
        ],[], [
        //var
        ])->display('Warehouses/edit-Warehouses.tpl');
    }
}
