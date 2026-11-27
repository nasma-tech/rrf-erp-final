<?php

namespace App\Controllers\WarehouseInventory;

use App\Controllers\scheme\ControllerScheme;
use App\Models\EntryWarehouseModel\EntryWarehouseModel;
use App\Models\ExitWarehouseModel\ExitWarehouseModel;
use App\Models\ProductModel\ProductModel;
use InvalidArgumentException;

class WarehouseInventory extends ControllerScheme
{
    const string singleName = '';
    const string pluralName = '';
    protected string|bool $defaultModel = false;

    public function inventoryInquiry(
        int        $productId,
        array|null $warehouseIds = null,
        int|null   $productChildId = null
    ): array
    {

        $getProducts = ProductModel::query()
            ->select([
                'id',
                'label',
                'measurement_unit_id',
                'serial_number'
            ])
            ->with([
                'measurementUnit:id,label',

                'productChildren' => function ($query) {
                    $query
                        ->withTrashed()
                        ->select([
                            'id',
                            'product_id',
                            'label',
                            'unit_id',
                            'convert_ratio'
                        ]);
                }
            ])
            ->find($productId);

        if (!$getProducts) {
            return [];
        }

        $selectedChild = null;

        if ($productChildId !== null) {

            $selectedChild = $getProducts->productChildren
                ->firstWhere('id', $productChildId);

            if (!$selectedChild) {
                throw new \InvalidArgumentException(
                    'بسته‌بندی انتخاب‌شده متعلق به این محصول نیست.'
                );
            }
        }

        $inventoryBuckets = [];

        $inventoryBuckets[0] = [
            'product_child_id' => null,
            'label' => $getProducts->measurementUnit?->label,
            'convert_ratio' => 1,
            'total_entry' => 0,
            'total_reserved' => 0,
            'total_exit' => 0,
            'total_remaining' => 0,
        ];

        foreach ($getProducts->productChildren as $child) {

            $ratio = (float)$child->convert_ratio;

            if ($ratio <= 0) {
                throw new \RuntimeException(
                    "نسبت تبدیل بسته‌بندی شماره {$child->id} معتبر نیست."
                );
            }

            $inventoryBuckets[$child->id] = [
                'product_child_id' => $child->id,
                'label' => $child->label,
                'unit_id' => $child->unit_id,
                'convert_ratio' => $ratio,

                'total_entry' => 0,
                'total_reserved' => 0,
                'total_exit' => 0,
                'total_remaining' => 0,
            ];
        }

        $relations = [
            'package',
            'productChild' => function ($query) {
                $query->withTrashed()->select([
                    'id',
                    'product_id',
                    'label',
                    'unit_id',
                    'convert_ratio'
                ]);
            }
        ];

        $warehouseFilter = function ($query) use ($warehouseIds) {

            $query->when(
                !empty($warehouseIds),
                fn($query) => $query->whereHas(
                    'package.warehouse',
                    fn($query) => $query->whereIn('id', $warehouseIds)
                )
            );
        };

        $getEntry = EntryWarehouseModel::query()
            ->with($relations)
            ->where($warehouseFilter)
            ->where([
                'product_id' => $productId,
                'unit_id' => $getProducts->measurement_unit_id,
            ])
            ->get();

        $getReserve = ExitWarehouseModel::query()
            ->with($relations)
            ->where($warehouseFilter)
            ->where([
                'product_id' => $productId,
                'unit_id' => $getProducts->measurement_unit_id,
                'exit_status' => 0
            ])
            ->get();

        $getExit = ExitWarehouseModel::query()
            ->with($relations)
            ->where($warehouseFilter)
            ->where([
                'product_id' => $productId,
                'unit_id' => $getProducts->measurement_unit_id,
                'exit_status' => 1
            ])
            ->get();

        $calculateMovements = function ($items, string $type) use (&$inventoryBuckets) {
            foreach ($items as $item) {

                $childId = $item->product_child_id ?: 0;

                if (!isset($inventoryBuckets[$childId])) {

                    if (!$item->productChild) {
                        throw new \RuntimeException(
                            "بسته‌بندی رکورد شماره {$item->id} قابل بازیابی نیست."
                        );
                    }

                    $ratio = (float)$item->productChild->convert_ratio;

                    if ($ratio <= 0) {
                        throw new \RuntimeException(
                            "نسبت تبدیل بسته‌بندی رکورد شماره {$item->id} معتبر نیست."
                        );
                    }

                    $inventoryBuckets[$childId] = [
                        'product_child_id' => $item->product_child_id,
                        'label' => $item->productChild->label,
                        'unit_id' => $item->productChild->unit_id,
                        'convert_ratio' => $ratio,
                        'total_entry' => 0,
                        'total_reserved' => 0,
                        'total_exit' => 0,
                        'total_remaining' => 0,
                    ];
                }

                $amount = (float)$item->amount;

                if ($amount < 0) {
                    throw new \RuntimeException(
                        "مقدار رکورد شماره {$item->id} معتبر نیست."
                    );
                }

                $inventoryBuckets[$childId][$type] += $amount;
            }
        };

        $calculateMovements($getEntry, 'total_entry');
        $calculateMovements($getReserve, 'total_reserved');
        $calculateMovements($getExit, 'total_exit');

        foreach ($inventoryBuckets as &$bucket) {
            $bucket['total_remaining'] = $bucket['total_entry'] - ($bucket['total_reserved'] + $bucket['total_exit']);
            $bucket['base_total_entry'] = $bucket['total_entry'] * $bucket['convert_ratio'];
            $bucket['base_total_reserved'] = $bucket['total_reserved'] * $bucket['convert_ratio'];
            $bucket['base_total_exit'] = $bucket['total_exit'] * $bucket['convert_ratio'];
            $bucket['base_total_remaining'] = $bucket['total_remaining'] * $bucket['convert_ratio'];
        }

        unset($bucket);

        $selectedBucketId = $productChildId ?? 0;

        $selectedInventory = $inventoryBuckets[$selectedBucketId];

        $otherPackagingInventory = collect($inventoryBuckets)
            ->reject(
                fn($bucket, $key) => (int)$key === (int)$selectedBucketId
            )
            ->values()
            ->toArray();

        $summary = [
            'base_total_entry' => 0,
            'base_total_reserved' => 0,
            'base_total_exit' => 0,
            'base_total_remaining' => 0,
        ];

        foreach ($inventoryBuckets as $bucket) {
            $summary['base_total_entry'] += $bucket['base_total_entry'];
            $summary['base_total_reserved'] += $bucket['base_total_reserved'];
            $summary['base_total_exit'] += $bucket['base_total_exit'];
            $summary['base_total_remaining'] += $bucket['base_total_remaining'];
        }

        $entryPackages = $getEntry
            ->pluck('package')
            ->filter()
            ->unique('id')
            ->map(fn($package) => $package->only([
                'id',
                'title',
                'description',
                'entry_datetime',
            ]))
            ->values()
            ->toArray();

        $reservePackages = $getReserve
            ->pluck('package')
            ->filter()
            ->unique('id')
            ->map(fn($package) => $package->only([
                'id',
                'title',
                'created_at'
            ]))
            ->values()
            ->toArray();

        $exitPackages = $getExit
            ->pluck('package')
            ->filter()
            ->unique('id')
            ->map(fn($package) => $package->only([
                'id',
                'title',
                'created_at'
            ]))
            ->values()
            ->toArray();

        return [
            'productData' => $getProducts->toArray(),
            'selected_inventory' => $selectedInventory,
            'other_packaging_inventory' => $otherPackagingInventory,
            'entry_packages' => $entryPackages,
            'reserve_packages' => $reservePackages,
            'exit_packages' => $exitPackages,
            'summary' => $summary
        ];
    }

    public function checkProductAvailability(
        int        $productId,
        int|null   $productChildId,
        float      $requestAmount,
        array|null $warehouseIds = null
    ): array
    {
        if ($requestAmount <= 0) {
            throw new InvalidArgumentException('مقدار درخواست باید بیشتر از صفر باشد.');
        }

        $product = ProductModel::query()
            ->with([
                'measurementUnit:id,label',
                'productChildren' => fn($query) => $query->select([
                    'id',
                    'product_id',
                    'label',
                    'unit_id',
                    'convert_ratio',
                ]),
            ])
            ->find($productId);

        if (!$product) {
            throw new InvalidArgumentException('محصول موردنظر یافت نشد.');
        }

        $selectedChild = null;

        if ($productChildId !== null) {
            $selectedChild = $product->productChildren
                ->firstWhere('id', $productChildId);

            if (!$selectedChild) {
                throw new InvalidArgumentException(
                    'بسته‌بندی انتخاب‌شده معتبر نیست.'
                );
            }
        }

        $convertRatio = (float)(
            $selectedChild?->convert_ratio ?? 1
        );

        if ($convertRatio <= 0) {
            throw new InvalidArgumentException(
                'نسبت تبدیل بسته‌بندی معتبر نیست.'
            );
        }

        // دریافت موجودی واحد انتخاب‌شده و سایر واحدها
        $inventory = $this->inventoryInquiry(
            $productId,
            $warehouseIds,
            $productChildId
        );

        $selectedInventory = $inventory['selected_inventory'];

        $selectedAvailable = (float)(
            $selectedInventory['total_remaining'] ?? 0
        );

        // مرحله اول: بررسی موجودی واحد انتخاب‌شده
        $selectedSufficient = $selectedAvailable >= $requestAmount;

        $requestedBaseAmount = $requestAmount * $convertRatio;

        $result = [
            'product' => [
                'id' => $product->id,
                'title' => $product->label,
                'base_unit' => $product->measurementUnit?->label,
            ],

            'requested' => [
                'product_child_id' => $productChildId,
                'label' => $selectedChild?->label
                    ?? $product->measurementUnit?->label,
                'amount' => $requestAmount,
                'convert_ratio' => $convertRatio,
                'base_amount' => $requestedBaseAmount,
            ],

            'selected_inventory' => [
                'available' => $selectedAvailable,
                'sufficient' => $selectedSufficient,
                'shortage' => max(0, $requestAmount - $selectedAvailable),
            ],

            'availability' => [
                'status' => null,
                'can_fulfill' => false,
                'checked_by' => null,
                'requested_base_amount' => $requestedBaseAmount,
                'available_base_amount' => null,
            ],

            'other_packaging_inventory' => [],
        ];

        if ($selectedSufficient) {
            $result['availability'] = [
                'status' => 'available',
                'can_fulfill' => true,
                'checked_by' => 'selected_unit',
                'requested_base_amount' => $requestedBaseAmount,
                'available_base_amount' =>
                    (float)($selectedInventory['base_total_remaining'] ?? 0),
            ];

            return $result;
        }

        $summary = $inventory['summary'];

        $totalBaseAvailable = (float)(
            $summary['base_total_remaining'] ?? 0
        );

        $canFulfill = $totalBaseAvailable >= $requestedBaseAmount;

        $result['availability'] = [
            'status' => $canFulfill ? 'alternative_available' : 'unavailable',
            'can_fulfill' => $canFulfill,
            'checked_by' => 'all_units',
            'requested_base_amount' => $requestedBaseAmount,
            'available_base_amount' => $totalBaseAvailable,
            'shortage_base_amount' => max(
                0,
                $requestedBaseAmount - $totalBaseAvailable
            ),
        ];

        $result['other_packaging_inventory'] = array_map(
            static fn($item) => [
                'product_child_id' => $item['product_child_id'],
                'label' => $item['label'],
                'available' => $item['total_remaining'],
                'base_available' => $item['base_total_remaining'],
            ],
            $inventory['other_packaging_inventory']
        );

        return $result;
    }


    //************** ajax endpoints **************//

    public function checkProductAvailabilityForm(): void
    {
        csrf->csrfValidate();
        $data = $this->requestArray();
        $output = $this->defaultOutput();

        $needle = [
            'product_id',
            'product_child_id',
            'request_amount'
        ];

        if (validator->validateRequestsData($needle)) {
            $output = $this->checkProductAvailability($data['product_id'], ($data['product_child_id'] ?: null), $data['request_amount']);
        }

        echo json_encode($output, JSON_UNESCAPED_UNICODE);
    }

    //************** ajax endpoints **************//

}