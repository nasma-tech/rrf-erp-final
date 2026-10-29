<?php
namespace App\Controllers\brands;
use App\Controllers\ProductGrad\ProductGrad;
use App\Controllers\scheme\ControllerScheme;
use App\Models\brandsModel\brandsModel;
use App\Models\ProductCategoriesModel\ProductCategoriesModel;
use App\Models\ProductGradModel\ProductGradModel;
use App\Models\ProductGroupModel\ProductGroupModel;
use App\Models\ProductQualitiesModel\ProductQualitiesModel;
use App\Models\UnitModel\UnitModel;
use UnitsModel;

class brands extends ControllerScheme{
        const string singleName = 'برند';
        const string pluralName = 'برندها';
        protected string $defaultModel = brandsModel::class;
        
        public function main(){
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->setModel(brandsModel::all());
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
            //'js/brands/brands'
        ],
            ['vendors/css/tables/datatable/datatables.min'],
            [
            //vars
                ])->display('brands/brands.tpl');
    }
    
        public function addIndex(){
                view->setPageTitle(self::pluralName);
                view->setSingleName(self::singleName);
                view->setPluralName(self::pluralName);
                view->ui([
                    //'js/brands/add-brands'
                ], [],
                    [//vars
                        'brands'=> brandsModel::all(),
                        'groups' => productGroupModel::all(),
                        'categories' => ProductCategoriesModel::all(),
                        'grades' => ProductGradModel::all(),
                        'qualities' => ProductQualitiesModel::all(),
                        'units' => UnitModel::all()
                    ]
                )->display('brands/add-brands.tpl');
            }
            
        public function editIndex($id){
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        //name this model
        view->setModel(brandsModel::query()->find($id));
        view->ui([
            //'js/brands/edit-brands'
        ],[], [
        //var
            'brands'
        ])->display('brands/edit-brands.tpl');
    }
}
