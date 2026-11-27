<?php

namespace App\Controllers\Products;

use App\Controllers\scheme\ControllerScheme;
use App\Models\brandsModel\brandsModel;
use App\Models\MeasurementUnitModel\MeasurementUnitModel;
use App\Models\priceChangeLogsModel\priceChangeLogsModel;
use App\Models\ProductChildModel\ProductChildModel;
use App\Models\productChildPriceChangeLogModel\productChildPriceChangeLogModel;
use App\Models\ProductGradeModel\ProductGradeModel;
use App\Models\ProductGroupModel\ProductGroupModel;
use App\Models\ProductModel\ProductModel;
use App\Models\ProductQualitiesModel\ProductQualitiesModel;

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
        view->setModel($this->defaultModel::Saleable()->get());
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
            'js/Products/addOrEdit-Products'
        ], [
            'vendors/css/splide/splide.min',
            'css/Products/add-Products'
        ], [
            "parentProducts" => ProductModel::all(),
            "productGroups" => ProductGroupModel::all(),
            'measurement_unit' => measurementUnitModel::all(),
            'brands' => brandsModel::all(),
            'productQualities' => ProductQualitiesModel::all(),
            'productGrades' => ProductGradeModel::all()
        ])->display('Products/addOrEdit-Products.tpl');
    }

    public function editIndex($id)
    {
        $getData = $this->defaultModel::query()
            ->with('productChildren')
            ->findOrFail($id);

        view->setPageTitle(self::pluralName);
        view->setSingleName(self::singleName);
        view->setPluralName(self::pluralName);
        view->setModel($getData);

        view->ui([
            'vendors/js/charts/apextree.min',
            'vendors/js/splide/splide.min',
            'js/Products/addOrEdit-Products'
        ], [
            'vendors/css/splide/splide.min',
            'css/Products/add-Products'
        ], [
            "parentProducts" => ProductModel::where('id', '!=', $id)->get(),
            "productGroups" => ProductGroupModel::all(),
            'measurement_unit' => measurementUnitModel::all(),
            'brands' => brandsModel::all(),
            'productQualities' => ProductQualitiesModel::all(),
            'productGrades' => ProductGradeModel::all()
        ])->display('Products/addOrEdit-Products.tpl');
    }

    /**
     * @throws \Throwable
     */
    public function add(): void
    {
        csrf->csrfValidate();

        $data = $this->requestArray();

        $needle = [
            "parent_id",
            "parent_unit_ratio",
            "label",
            "serial_number",
            "group_id",
            "brand_id",
            "quality_level_id",
            "grade_id",
            "measurement_unit_id",
            "cost_price",
            "sale_price",
            "customer_price",
            "description",
            "complete_description",
        ];

        if (validator->validateRequestsData($needle)) {

            $files = fileHelper->normalizeUploadedFiles('images');
            $add = $this->defaultModel::query()->getConnection()->transaction(function () use ($data) {

                $add = $this->defaultModel::query()->create([
                    "parent_id" => ($data['parent_id'] ?: null),
                    "parent_unit_ratio" => numberNormalizer->removePriceSeparator($data['parent_unit_ratio'] ?: 0),
                    "label" => trim($data['label']),
                    "serial_number" => trim($data['serial_number']),
                    "group_id" => $data['group_id'],
                    "brand_id" => $data['brand_id'],
                    "quality_level_id" => $data['quality_level_id'],
                    "grade_id" => $data['grade_id'],
                    "measurement_unit_id" => $data['measurement_unit_id'],
                    "cost_price" => numberNormalizer->removePriceSeparator($data['cost_price']),
                    "sale_price" => numberNormalizer->removePriceSeparator($data['sale_price']),
                    "customer_price" => numberNormalizer->removePriceSeparator($data['customer_price']),
                    "description" => trim($data['description']),
                    "complete_description" => trim($data['complete_description']),
                    "user_id" => userObject()->userId
                ]);
                if (!$add) {
                    throw new \RuntimeException('ثبت محصول با شکست مواجه شد.');
                }

                $productChildren = $data['product_children'] ?? [];

                foreach ($productChildren as $child) {

                    $convertRatio = (float)numberNormalizer->removePriceSeparator(
                        $child['convert_ratio']
                    );

                    if ($convertRatio <= 0) {
                        throw new \InvalidArgumentException(
                            'نرخ تبدیل بسته‌بندی باید بزرگ‌تر از صفر باشد.'
                        );
                    }

                    ProductChildModel::query()->create([
                        "product_id" => $add->id,
                        "label" => trim($child['label']),
                        "unit_id" => $child['unit_id'],
                        "convert_ratio" => $convertRatio,
                        "cost_price" => round(
                            (float)$add->cost_price * $convertRatio,
                            2
                        ),
                        "sale_price" => round(
                            (float)$add->sale_price * $convertRatio,
                            2
                        ),
                        "customer_price" => round(
                            (float)$add->customer_price * $convertRatio,
                            2
                        ),
                        "saleable" => !empty($child['saleable']),
                        "user_id" => userObject()->userId,
                    ]);
                }

                return $add;
            });

            if ($add) {
                $add->update([
                    'file_address' => fileHelper->uploadMultipleFiles(
                        "Products",
                        $files,
                        $add->id
                    )
                ]);
                $this->priceChangeLog($add->id);
                $this->successCallBack("/Products/main");
            }
        }
    }

    /**
     * @throws \Throwable
     */
    public function edit($id): void
    {
        csrf->csrfValidate();

        $data = $this->requestArray();

        $needle = [
            "parent_id",
            "parent_unit_ratio",
            "label",
            "serial_number",
            "group_id",
            "brand_id",
            "quality_level_id",
            "grade_id",
            "measurement_unit_id",
            "cost_price",
            "sale_price",
            "customer_price",
            "description",
            "complete_description",
        ];

        if (!validator->validateRequestsData($needle)) {
            return;
        }

        $add = $this->defaultModel::query()->find($id);

        if (!$add) {
            throw new \RuntimeException('محصول موردنظر پیدا نشد.');
        }

        $add->getConnection()->transaction(function () use ($add, $data) {

            $add->update([
                "parent_id" => ($data['parent_id'] ?: null),
                "parent_unit_ratio" => numberNormalizer->removePriceSeparator($data['parent_unit_ratio'] ?: 0),
                "label" => trim($data['label']),
                "serial_number" => trim($data['serial_number']),
                "group_id" => $data['group_id'],
                "brand_id" => $data['brand_id'],
                "quality_level_id" => $data['quality_level_id'],
                "grade_id" => $data['grade_id'],
                "measurement_unit_id" => $data['measurement_unit_id'],
                "cost_price" => numberNormalizer->removePriceSeparator($data['cost_price']),
                "sale_price" => numberNormalizer->removePriceSeparator($data['sale_price']),
                "customer_price" => numberNormalizer->removePriceSeparator($data['customer_price']),
                "description" => trim($data['description']),
                "complete_description" => trim($data['complete_description']),
            ]);

            $productChildren = $data['product_children'] ?? [];
            $savedChildIds = [];

            foreach ($productChildren as $child) {

                $convertRatio = (float)numberNormalizer->removePriceSeparator(
                    $child['convert_ratio'] ?? 0
                );

                if ($convertRatio <= 0) {
                    throw new \InvalidArgumentException(
                        'نرخ تبدیل بسته‌بندی باید بزرگ‌تر از صفر باشد.'
                    );
                }

                $childData = [
                    "label" => trim($child['label']),
                    "unit_id" => $child['unit_id'],
                    "convert_ratio" => $convertRatio,
                    "cost_price" => numberNormalizer->removePriceSeparator($child['cost_price'] ?? 0),
                    "sale_price" => numberNormalizer->removePriceSeparator($child['sale_price'] ?? 0),
                    "customer_price" => numberNormalizer->removePriceSeparator($child['customer_price'] ?? 0),
                    "saleable" => !empty($child['saleable']),
                ];

                $childId = (int)($child['id'] ?? 0);

                if ($childId > 0) {

                    $productChild = $add->productChildren()
                        ->where('id', $childId)
                        ->first();

                    if (!$productChild) {
                        throw new \InvalidArgumentException(
                            'بسته‌بندی ارسالی متعلق به این محصول نیست.'
                        );
                    }

                    $productChild->update($childData);

                } else {

                    $productChild = $add->productChildren()->create([
                        ...$childData,
                        "user_id" => userObject()->userId,
                    ]);
                }

                $savedChildIds[] = $productChild->id;

                $this->childPriceChangeLog($productChild->id);
            }

            $removedChildren = $add->productChildren();

            if (!empty($savedChildIds)) {
                $removedChildren->whereNotIn('id', $savedChildIds);
            }

            $removedChildren->delete();
        });

        $this->priceChangeLog($add->id);

        $this->successCallBack("/Products/main", "رکورد با موفقیت ویرایش شد");
    }


    //************** ajax endpoints **************//

    public function getProductsFilterForm(): void
    {
        csrf->csrfValidate();
        $data = $this->requestArray();
        $output = $this->defaultOutput();

        $needle = [
            'selectedBrands'
        ];

        if (validator->validateRequestsData($needle)) {
            $output = $this->getProductsFilter($data['selectedBrands']);
        }

        echo json_encode($output, JSON_UNESCAPED_UNICODE);
    }

    public function getProductDataFilterByBrand(): void
    {
        $brandId = $this->requestArray()['brandId'];
        if ($brandId) {
            echo json_encode(array_map(function ($item) {
                return [
                    'id' => $item['id'],
                    'title' => $item['label'],
                    'serialNumber' => $item['serial_number'],
                    'unitPrice' => $item['sale_price'],
                    'unitName' => $item['measurement_unit']['label'],
                ];
            }, ProductModel::query()
                ->with([
                    'measurementUnit'
                ])->where('brand_id', $brandId)->get()->toArray()));
        }
    }

    public function getProductData(): void
    {
        echo json_encode(array_map(function ($item) {
            return [
                'id' => $item['id'],
                'title' => $item['label'],

            ];
        }, ProductModel::query()
            ->get()->toArray()));
    }

    //************** ajax endpoints **************//


    //************** methods **************//

    public function getProductsFilter($selectedBrands): array
    {
        $products = ProductModel::query()
            ->select([
                'id',
                'label',
                'serial_number',
                'brand_id',
                'measurement_unit_id',
            ])
            ->with([
                'measurementUnit:id,label',
            ])
            ->when(!empty($selectedBrands), function ($query) use ($selectedBrands) {
                $query->whereIn(
                    'brand_id',
                    array_values(array_unique($selectedBrands))
                );
            })
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->label,
                    'serial_number' => $product->serial_number,
                    'unit_title' => $product->measurementUnit?->label,
                ];
            });

        return [
            'status' => true,
            'message' => 'عملیات با موفقیت انجام شد',
            'data' => [
                'products' => $products,
            ],
        ];
    }

    public function priceChangeLog(int $productId, string|null $modifiedAt = null): bool
    {
        $get = $this->defaultModel::query()->find($productId);

        if (is_null($modifiedAt)) {
            $modifiedAt = date("Y-m-d H:i:s");
        }
        if ($get) {
            $output = priceChangeLogsModel::query()->create([
                'product_id' => $get->id,
                'cost_price' => $get->cost_price,
                'sale_price' => $get->sale_price,
                'customer_price' => $get->customer_price,
                'user_id' => userObject()->userId,
                'modified_at' => $modifiedAt
            ]);
        }

        return boolval($output ?? false);
    }

    public function childPriceChangeLog(int $productChildId, string|null $modifiedAt = null): bool
    {
        $get = ProductChildModel::query()->find($productChildId);

        if (!$get) {
            return false;
        }

        if (is_null($modifiedAt)) {
            $modifiedAt = date("Y-m-d H:i:s");
        }

        $output = productChildPriceChangeLogModel::query()->create([
            'product_child_id' => $get->id,
            'cost_price' => $get->cost_price,
            'sale_price' => $get->sale_price,
            'customer_price' => $get->customer_price,
            'user_id' => userObject()->userId,
            'modified_at' => $modifiedAt
        ]);

        return boolval($output);
    }

    //************** methods **************//
}