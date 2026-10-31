<?php

namespace App\Controllers\Products;

use App\Controllers\scheme\ControllerScheme;
use App\Models\brandsModel\brandsModel;
use App\Models\ProductGroupModel\ProductGroupModel;
use App\Models\ProductModel\ProductModel;
use App\Models\ProductQualitiesModel\ProductQualitiesModel;
use App\Models\UnitModel\UnitModel;

class Products extends ControllerScheme
{
    const string singleName = 'محصول';
    const string pluralName = 'محصولات';
    protected string $defaultModel = ProductModel::class;

    public function main()
    {
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
            'js/Products/Products'
        ],
            ['vendors/css/tables/datatable/datatables.min'],
            [
            ])->display('Products/Products.tpl');
    }

    public function addIndex()
    {
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->ui([
            'vendors/js/charts/apextree.min',
            'vendors/js/splide/splide.min',
            'js/Products/add-Products'
        ], [
            'vendors/css/splide/splide.min',
            'css/Products/add-Products'
        ],
            [
                "parentProducts" => ProductModel::all(),
                "productGroups" => ProductGroupModel::all(),
                'units' => [],
                'brands' => brandsModel::all(),
                'productQualities' => ProductQualitiesModel::all()
            ]
        )->display('Products/add-Products.tpl');
    }

    public function editIndex($id)
    {
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        //name this model
        view->setModel();
        view->ui([
            //'js/Products/edit-Products'
        ], [], [
            //var
        ])->display('Products/edit-Products.tpl');
    }

    public function add()
    {
        $this->validateCSRF();
//        var_print($_FILES);
//        die();
    }
}
