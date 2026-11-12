<?php

namespace App\Controllers\PriceSuggestion;

use App\Controllers\scheme\ControllerScheme;
use App\Models\ContactProjectsFollowUpModel\ContactProjectsFollowUpModel;
use App\Models\ContactProjectsModel\ContactProjectsModel;
use App\Models\PriceSuggestionModel\PriceSuggestionModel;

class PriceSuggestion extends ControllerScheme
{
    const string singleName = 'پیشنهاد قیمت';
    const string pluralName = 'پیشنهادات قیمت';
    protected string $defaultModel = PriceSuggestionModel::class;

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
            //'js/PriceSuggestion/PriceSuggestion'
        ],
            ['vendors/css/tables/datatable/datatables.min'],
            [
                //vars
            ])->display('PriceSuggestion/PriceSuggestion.tpl');
    }

    public function addIndex()
    {
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->ui([
            //'js/PriceSuggestion/add-PriceSuggestion'
        ], [],
            [//vars
            ]
        )->display('PriceSuggestion/add|edit-PriceSuggestion.tpl');
    }

    public function editIndex($id)
    {
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        //name this model
        view->setModel();
        view->ui([
            //'js/PriceSuggestion/edit-PriceSuggestion'
        ], [], [
            //var
        ])->display('PriceSuggestion/add|edit-PriceSuggestion.tpl');
    }

    public function createPriceSuggestion($projectId, $followUpId): void
    {
        $contactProjectData = ContactProjectsModel::query()
            ->with([
                'contactData'
            ])->find($projectId);
        $contactProjectFollowUpData = ContactProjectsFollowUpModel::query()->find($followUpId);
        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->ui([
            //'js/PriceSuggestion/add-PriceSuggestion'
        ], [],
            [
                'contactProjectData' => $contactProjectData,
                'contactProjectFollowUpData' => $contactProjectFollowUpData
            ]
        )->display('PriceSuggestion/add|edit-PriceSuggestion.tpl');
    }
}
