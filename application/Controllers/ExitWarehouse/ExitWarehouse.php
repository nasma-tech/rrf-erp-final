<?php

namespace App\Controllers\ExitWarehouse;

use App\Controllers\scheme\ControllerScheme;
use App\Models\ExitWarehouseModel\ExitWarehouseModel;
use App\Models\ExitWarehousePackageModel\ExitWarehousePackageModel;
use App\Models\ProductModel\ProductModel;

class ExitWarehouse extends ControllerScheme
{
    const string singleName = 'خروج از انبار';
    const string pluralName = 'خروج از انبار';

    protected string $defaultModel = ExitWarehouseModel::class;

    public function addExitPackage(
        int      $warehouseId,
        string   $title,
        int|null $partId = null
    )
    {
        return ExitWarehousePackageModel::query()->create([
            'warehouse_id' => $warehouseId,
            'product_part_id' => $partId,
            'title' => $title,
            'user_id' => userObject()->userId
        ]);
    }

    public function addExitProduct(
        int              $exitPackageId,
        int              $productId,
        int|float|string $amount,
        int|null         $productChildId = null,
        string|null      $exitDatetime = null,
        bool             $exitStatus = false
    )
    {
        $product = ProductModel::query()
            ->with('productChildren')
            ->find($productId);

        if (!$product) {
            return false;
        }

        $productChild = null;

        if (!empty($productChildId)) {
            $productChild = $product->productChildren()
                ->where('id', $productChildId)
                ->first();

            if (!$productChild) {
                throw new \InvalidArgumentException(
                    'بسته‌بندی انتخاب‌شده متعلق به این محصول نیست.'
                );
            }
        }

        $amount = numberNormalizer->removePriceSeparator($amount);

        if (!is_numeric($amount) || (float)$amount <= 0) {
            throw new \InvalidArgumentException(
                'مقدار خروج از انبار باید بزرگ‌تر از صفر باشد.'
            );
        }

        return ExitWarehouseModel::query()->create([
            'exit_package_id' => $exitPackageId,
            'product_id' => $product->id,
            'product_child_id' => $productChild?->id,
            'amount' => $amount,
            'unit_id' => $product->measurement_unit_id,
            'exit_datetime' => $exitDatetime ?: date('Y-m-d H:i:s'),
            'exit_status' => $exitStatus,
            'user_id' => userObject()->userId,
        ]);
    }
}