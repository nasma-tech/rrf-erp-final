$(function () {

    $("#country_id").change(function () {
        let countryId = $(this).val();

        $("#city_id").empty().attr('disabled', true);

        $(this).getOptionsValue({
            urlAddress: '/states/getStatesFilterByCountry',
            dataSend: {
                countryId
            },
            callback: result => {
                $("#state_id").html(`<option selected disabled>یک استان انتخاب کنید</option>`);

                $.each(result, function (key, item) {
                    $("#state_id").append(`<option value="${item.id}">${item.title}</option>`);
                });
            }
        });
    });

    $("#state_id").change(function () {
        let value = $(this).val();

        $(this).getOptionsValue({
            urlAddress: '/cities/getFilterCities',
            dataSend: {
                value
            },
            callback: result => {
                $("#city_id")
                    .attr('disabled', false)
                    .html(`<option selected disabled>یک شهر انتخاب کنید</option>`);

                $.each(result, function (key, item) {
                    $("#city_id").append(`<option value="${item.id}">${item.title}</option>`);
                });
            }
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Products cache
    |--------------------------------------------------------------------------
    */

    let productsById = {};
    let productsLoaded = false;
    let productsLoading = false;
    let productsLoadingBrandId = null;
    let productsLoadCallbacks = [];

    const resetProductsCache = () => {
        productsById = {};
        productsLoaded = false;
        productsLoading = false;
        productsLoadingBrandId = null;
        productsLoadCallbacks = [];
    };

    const ensureProductsLoaded = (callback = null) => {
        let brandId = $("#brand_id").val();

        if (!brandId) {
            if (callback) {
                callback([]);
            }

            return;
        }

        if (productsLoaded && String(productsLoadingBrandId) === String(brandId)) {
            if (callback) {
                callback(Object.values(productsById));
            }

            return;
        }

        if (productsLoading && String(productsLoadingBrandId) === String(brandId)) {
            if (callback) {
                productsLoadCallbacks.push(callback);
            }

            return;
        }

        resetProductsCache();

        productsLoading = true;
        productsLoadingBrandId = brandId;

        if (callback) {
            productsLoadCallbacks.push(callback);
        }

        $("#Products").getOptionsValue({
            urlAddress: "/Products/getProductDataFilterByBrand",
            dataSend: {
                brandId
            },
            callback: result => {
                productsById = {};

                $.each(result || [], function (key, item) {
                    productsById[String(item.id)] = item;
                });

                productsLoaded = true;
                productsLoading = false;

                let callbacks = [...productsLoadCallbacks];

                productsLoadCallbacks = [];

                $.each(callbacks, function (key, callback) {
                    callback(result || []);
                });
            }
        });
    };

    const getProductById = productId => {
        return productsById[String(productId)] || null;
    };

    const getSelectedProduct = $row => {
        let productId = $row.find('.product_id').val();

        return getProductById(productId);
    };

    const normalizePrice = value => {
        if (value === null || value === undefined || value === '') {
            return 0;
        }

        return Number(String(value).replaceAll(',', '')) || 0;
    };

    const formatPrice = value => {
        return Number(value || 0).toLocaleString();
    };

    /*
    |--------------------------------------------------------------------------
    | Product packaging
    |--------------------------------------------------------------------------
    */

    const fillProductChildren = ($row, product, selectedChildId = null) => {
        let $childSelect = $row.find('.product_child_id');

        $childSelect.empty();

        $childSelect.append(`
            <option value="">
                واحد اصلی - ${product.unitName || ''}
            </option>
        `);

        $.each(product.children || [], function (key, child) {
            $childSelect.append(`
                <option
                    value="${child.id}"
                    data-price="${child.unitPrice}"
                    data-unit="${child.unitName || ''}"
                >
                    ${child.label} - ${child.unitName || ''}
                </option>
            `);
        });

        $childSelect.prop('disabled', false);

        $childSelect.val(
            selectedChildId !== null && selectedChildId !== undefined && selectedChildId !== ''
                ? String(selectedChildId)
                : ''
        );

        $row.find('.product_unit_id').val(product.unitId || '');
    };

    const getSelectedPackagingPrice = ($row, product) => {
        let childId = $row.find('.product_child_id').val();

        if (!childId) {
            return normalizePrice(product.unitPrice);
        }

        let $selectedChild = $row.find('.product_child_id option:selected');

        return normalizePrice($selectedChild.data('price'));
    };

    const resetRowDiscount = $row => {
        $row.find('.discountType').val('');
        $row.find('.discountUnitAmount').val('');
        $row.find('.discountAmount').val('');

        $row.find('.removeDiscountButton').hide();
        $row.find('.discountButton').show();
    };

    const updateRowPrice = ($row, price) => {
        let formattedPrice = formatPrice(price);

        $row.find('.product_unit_price')
            .prop('readonly', false)
            .val(formattedPrice)
            .priceInput();

        $row.find('.unitPriceAfterDiscount')
            .val(formattedPrice);

        $row.find('.discountAmount').val('');
        $row.find('.discountUnitAmount').val('');
        $row.find('.discountType').val('');

        let amount = normalizePrice($row.find('.product_amount').val());

        $row.find('.productSumRow').val(
            formatPrice(amount * price)
        );

        $row.find('.productSumRowWithOutDiscount').val(
            formatPrice(amount * price)
        );

        sumAllRow();
    };

    /*
    |--------------------------------------------------------------------------
    | Existing rows initialization
    |--------------------------------------------------------------------------
    */

    const initializeExistingRows = () => {
        ensureProductsLoaded(result => {

            $("#mainProduct tr").each(function () {
                let $row = $(this);
                let product = getSelectedProduct($row);

                if (!product) {
                    return;
                }

                let $productSelect = $row.find('.product_id');

                let selectedChildId =
                    $productSelect.attr('data-selected-child') ||
                    $row.find('.product_child_id').val() ||
                    '';

                fillProductChildren($row, product, selectedChildId);

                // در ردیف‌های قبلی قیمت ذخیره‌شده را دست‌کاری نمی‌کنیم.
                // فقط واحد اصلی محصول را در فیلد مخفی قرار می‌دهیم.
                $row.find('.product_unit_id').val(product.unitId || '');

                if ($row.find('.product_id').hasClass('select2-hidden-accessible')) {
                    $row.find('.product_id').trigger('change.select2');
                }
            });

        });
    };

    /*
    |--------------------------------------------------------------------------
    | Row numbering
    |--------------------------------------------------------------------------
    */

    const countProductRow = () => {
        let count = 1;

        $("#mainProduct tr").each(function () {
            $(this).find('td').eq(0).text(count);
            count++;
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Calculate all rows
    |--------------------------------------------------------------------------
    */

    const sumAllRow = () => {
        let result = {
            sumRow: 0,
            sumDiscount: 0,
            netSumAllProduct: 0,
            finalSum: 0
        };

        $("#mainProduct tr").each(function () {
            let $row = $(this);

            let sumRow = normalizePrice(
                $row.find('.productSumRowWithOutDiscount').val()
            );

            let discountAmount = normalizePrice(
                $row.find('.discountAmount').val()
            );

            result.sumRow += sumRow;
            result.sumDiscount += discountAmount;
        });

        if (result.sumRow > 0) {
            result.netSumAllProduct = result.sumRow - result.sumDiscount;
        }

        let finalSum = result.netSumAllProduct;

        $(".chargesDeductionCheckBox").each(function () {
            let coefficient = Number($(this).data('coefficient'));
            let merge = $(this).data('merge');
            let identifier = $(this).data('identifier');

            if (this.checked) {
                let percentageAmount = 0;

                if (merge) {
                    percentageAmount = result.netSumAllProduct * (coefficient - 1);
                } else {
                    percentageAmount = finalSum * (coefficient - 1);
                }

                $(`#${identifier}_tr`).text(
                    Math.round(percentageAmount).toLocaleString()
                );

                finalSum += percentageAmount;
            } else {
                $(`#${identifier}_tr`).text(0);
            }
        });

        result.finalSum = finalSum;

        $("#sumAllProductRow").text(result.sumRow.toLocaleString());
        $("#sumAllDiscountRow").text(result.sumDiscount.toLocaleString());
        $("#netSumAllProductRow").text(result.netSumAllProduct.toLocaleString());
        $("#finalSum").text(result.finalSum.toLocaleString());

        return result;
    };

    $("#mainChargesDeductions").on('change', '.chargesDeductionCheckBox', function () {
        let sumSummary = sumAllRow();
        let finalSum = sumSummary.netSumAllProduct;

        $(".chargesDeductionCheckBox").each(function () {
            let coefficient = Number($(this).data('coefficient'));
            let coefficientPercent = coefficient - 1;
            let merge = $(this).data('merge');
            let identifier = $(this).data('identifier');

            if (this.checked) {
                let baseAmount = merge ? sumSummary.netSumAllProduct : finalSum;
                let percentageAmount = baseAmount * coefficientPercent;

                $(`#${identifier}_tr`).text(
                    Math.round(percentageAmount).toLocaleString()
                );

                finalSum += percentageAmount;
            } else {
                $(`#${identifier}_tr`).text(0);
            }
        });

        $("#finalSum").text(Math.round(finalSum).toLocaleString());
    });

    /*
    |--------------------------------------------------------------------------
    | Product row template
    |--------------------------------------------------------------------------
    */

    const makeProductRow = rowCounter => {
        return `
            <tr>
                <td class="border"></td>

                <td class="border">
                    <select
                        class="form-control product_id"
                        id="product_id_${rowCounter}"
                        name="productList[${rowCounter}][product_id]"
                    >
                        <option value="" selected disabled>انتخاب کنید</option>
                    </select>
                </td>

                <td class="border">
                    <select
                        class="form-control product_child_id"
                        name="productList[${rowCounter}][product_child_id]"
                        disabled
                    >
                        <option value="">واحد اصلی</option>
                    </select>

                    <input
                        type="hidden"
                        class="product_unit_id"
                        name="productList[${rowCounter}][unit_id]"
                        value=""
                    >
                </td>

                <td class="border">
                    <input
                        class="form-control product_amount"
                        readonly
                        required
                        name="productList[${rowCounter}][product_amount]"
                    />
                </td>

                <td class="border">
                    <input
                        class="form-control product_unit_price"
                        readonly
                        required
                        name="productList[${rowCounter}][product_unit_price]"
                    />
                </td>

                <td class="border">
                    <div class="input-group">
                        <input
                            class="form-control text-center productSumRowWithOutDiscount"
                            type="hidden"
                            value="0"
                            readonly
                        >

                        <input
                            class="form-control text-center productSumRow"
                            value="0"
                            readonly
                        >

                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">ریال</span>
                        </div>
                    </div>

                    <input
                        class="form-control discountType"
                        type="hidden"
                        readonly
                        name="productList[${rowCounter}][discount_type]"
                    >

                    <div class="input-group" style="margin-top: 3px">
                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">واحد تخفیف</span>
                        </div>

                        <input
                            class="form-control discountUnitAmount text-center"
                            readonly
                            placeholder="واحد تخفیف"
                            name="productList[${rowCounter}][discount_unit_amount]"
                        >
                    </div>

                    <div class="input-group" style="margin-top: 3px">
                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">مجموع تخفیف</span>
                        </div>

                        <input
                            class="form-control discountAmount text-center"
                            readonly
                            placeholder="مجموع تخفیف"
                            name="productList[${rowCounter}][discount_amount]"
                        >

                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">ریال</span>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top: 3px">
                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">
                                قیمت واحد پس از تخفیف
                            </span>
                        </div>

                        <input
                            class="form-control text-center unitPriceAfterDiscount"
                            readonly
                            placeholder="قیمت واحد پس از تخفیف"
                            name="productList[${rowCounter}][unit_price_after_discount]"
                        >

                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">ریال</span>
                        </div>
                    </div>
                </td>

                <td class="border">
                    <div class="dropup">
                        <span
                            class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                            role="menu"
                        ></span>

                        <div class="dropdown-menu" x-placement="bottom-start">
                            <a
                                class="dropdown-item text-danger removeProductRowButton"
                                style="cursor: pointer"
                            >
                                <i class="bx bx-trash-alt text-danger mr-1"></i>
                                حذف ردیف
                            </a>

                            <a
                                class="dropdown-item text-primary discountButton"
                                data-type="percentage"
                                style="cursor: pointer;"
                            >
                                <i class="bx bxs-discount text-primary mr-1"></i>
                                تخفیف درصدی
                            </a>

                            <a
                                class="dropdown-item text-secondary discountButton"
                                data-type="cash"
                                style="cursor: pointer;"
                            >
                                <i class="bx bx-money text-secondary mr-1"></i>
                                تخفیف ریالی
                            </a>

                            <a
                                class="dropdown-item text-danger removeDiscountButton"
                                style="cursor: pointer;display: none"
                            >
                                <i class="bx bx-x text-danger mr-1"></i>
                                حذف تخفیف
                            </a>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    };

    let mainProductCount = $("#mainProduct tr").length + 1;

    /*
    |--------------------------------------------------------------------------
    | Charges and deductions switch
    |--------------------------------------------------------------------------
    */

    const makeSwitchBox = ({
                               id,
                               netSumMerge = false,
                               coefficient,
                               identifier
                           }) => {
        return `
            <div class="custom-control custom-switch custom-switch-success">
                <input
                    type="checkbox"
                    name="chargesDeductionCheckBox[${identifier}]"
                    value="${identifier}"
                    class="custom-control-input chargesDeductionCheckBox"
                    data-merge="${netSumMerge}"
                    data-coefficient="${coefficient}"
                    data-identifier="${identifier}"
                    checked
                    id="chargesDeduction_${id}"
                >

                <label class="custom-control-label" for="chargesDeduction_${id}">
                    <span class="switch-icon-left">
                        <i class="bx bx-check"></i>
                    </span>

                    <span class="switch-icon-right">
                        <i class="bx bx-x"></i>
                    </span>
                </label>
            </div>
        `;
    };

    /*
    |--------------------------------------------------------------------------
    | Brand change
    |--------------------------------------------------------------------------
    */

    $("#brand_id").change(function () {
        let brandId = $(this).val();

        $("#mainProduct, #mainChargesDeductions").empty();
        $("#mainChargesDeductionsSumTr").empty();

        mainProductCount = 1;

        resetProductsCache();
        sumAllRow();

        $.ajax({
            url: '/ProformaInvoiceSettings/getProformaInvoiceSettings',
            data: {
                brandId
            },
            dataType: 'json',
            success: result => {

                $.each(result.chargesDeduction, function (key, item) {
                    $("#mainChargesDeductions").append(`
                        <tr>
                            <td class="border">${item.title}</td>

                            <td class="border">
                                ${makeSwitchBox({
                        id: item.id,
                        coefficient: item.coefficient,
                        netSumMerge: item.netSumMerge,
                        identifier: item.identifier
                    })}
                            </td>
                        </tr>
                    `);

                    $("#mainChargesDeductionsSumTr").append(`
                        <tr>
                            <td>${item.title}</td>

                            <td class="text-right">
                                <span id="${item.identifier}_tr" dir="rtl">0</span>
                                <span> ریال</span>
                            </td>
                        </tr>
                    `);
                });

                $('#payment_terms').joditEditor({
                    value: result.settings.payment_terms
                });

                $('#bottom_invoice_text').joditEditor({
                    value: result.settings.bottom_invoice_text
                });

                sumAllRow();
            }
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Add product
    |--------------------------------------------------------------------------
    */

    $("#addProductButton").on('click', function () {
        let brand = $("#brand_id").val();

        if (!brand) {
            customAlert('warning', 'برند را انتخاب کنید');
            return;
        }

        let rowCounter = mainProductCount;

        ensureProductsLoaded(result => {
            let $row = $(makeProductRow(rowCounter));

            $("#mainProduct").append($row);

            let $productSelect = $row.find('.product_id');

            $.each(result, function (key, item) {
                $productSelect.append(`
                    <option value="${item.id}">
                        ${item.serialNumber} - ${item.title}
                    </option>
                `);
            });

            $productSelect.select2({
                width: '100%'
            });

            countProductRow();

            mainProductCount++;
        });
    });

    /*
    |--------------------------------------------------------------------------
    | Remove product row
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('click', '.removeProductRowButton', function () {
        let $button = $(this);
        let $row = $button.closest('tr');

        if ($button.data('id') !== undefined) {
            swal.fire({
                icon: 'warning',
                title: '<h5>توجه !</h5>',
                text: 'بعد از حذف امکان بازگشت وجود ندارد',
                confirmButtonText: 'تایید',
                showDenyButton: true,
                denyButtonText: 'انصراف',
                preConfirm: () => {
                    $.ajax({
                        url: '/ProformaInvoice/removeProductRow',
                        type: 'POST',
                        data: {
                            id: $button.data('id')
                        },
                        success: result => {
                            if (result === 'deleteSuccess') {
                                $row.remove();

                                sumAllRow();
                                countProductRow();

                                customAlert('success', 'حذف با موفقیت انجام شد');
                            } else {
                                customAlert('error', 'خطا در حذف');
                            }
                        }
                    });
                }
            });
        } else {
            $row.remove();

            sumAllRow();
            countProductRow();
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Product selection
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('change', '.product_id', function () {
        let $row = $(this).closest('tr');
        let product = getProductById($(this).val());

        if (!product) {
            return;
        }

        fillProductChildren($row, product);

        $row.find('.product_amount')
            .prop('readonly', false)
            .priceInput();

        resetRowDiscount($row);

        updateRowPrice($row, normalizePrice(product.unitPrice));
    });

    /*
    |--------------------------------------------------------------------------
    | Packaging selection
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('change', '.product_child_id', function () {
        let $row = $(this).closest('tr');
        let product = getSelectedProduct($row);

        if (!product) {
            return;
        }

        let selectedPrice = getSelectedPackagingPrice($row, product);

        // unit_id همیشه واحد اصلی محصول است.
        $row.find('.product_unit_id').val(product.unitId || '');

        // با تغییر بسته‌بندی، تخفیف قبلی معتبر نیست.
        resetRowDiscount($row);

        updateRowPrice($row, selectedPrice);
    });

    /*
    |--------------------------------------------------------------------------
    | Amount and price calculation
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('input', '.product_amount, .product_unit_price', function () {

        let $row = $(this).closest('tr');

        let productAmount = normalizePrice(
            $row.find('.product_amount').val()
        );

        let productUnitPrice = normalizePrice(
            $row.find('.product_unit_price').val()
        );

        let discountType = $row.find('.discountType').val();

        let discountAmount = normalizePrice(
            $row.find('.discountUnitAmount').val()
        );

        let discountPerUnit = 0;

        if (discountType === 'percentage') {
            discountPerUnit = productUnitPrice * discountAmount / 100;
        } else if (discountType === 'cash') {
            discountPerUnit = discountAmount;
        }

        let unitPriceAfterDiscount = Math.max(
            0,
            productUnitPrice - discountPerUnit
        );

        let totalDiscount = discountPerUnit * productAmount;

        $row.find('.unitPriceAfterDiscount').val(
            formatPrice(unitPriceAfterDiscount)
        );

        $row.find('.discountAmount').val(
            discountType ? formatPrice(totalDiscount) : ''
        );

        $row.find('.productSumRow').val(
            formatPrice(unitPriceAfterDiscount * productAmount)
        );

        $row.find('.productSumRowWithOutDiscount').val(
            formatPrice(productUnitPrice * productAmount)
        );

        sumAllRow();

    });

    /*
    |--------------------------------------------------------------------------
    | Discount
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('click', '.discountButton', function () {
        let $button = $(this);
        let $row = $button.closest('tr');
        let $dropdownMenu = $button.closest('.dropdown-menu');

        let discountType = $button.data('type');
        let textDiscountType = $button.text().trim();

        let unitPrice = normalizePrice(
            $row.find('.product_unit_price').val()
        );

        let productAmount = normalizePrice(
            $row.find('.product_amount').val()
        );

        if (!unitPrice) {
            swal.fire({
                icon: 'warning',
                title: '<h6>توجه !</h6>',
                text: 'لطفا ابتدا یک محصول و قیمت واحد را وارد کنید',
                confirmButtonText: 'متوجه شدم'
            });

            return;
        }

        swal.fire({
            title: `<h6>${textDiscountType}</h6><hr>`,
            html: `
                <div class="input-group">
                    <input class="form-control" id="discountAmount">

                    <div class="input-group-append">
                        <span class="input-group-text">
                            ${discountType == 'percentage' ? '%' : 'ریال'}
                        </span>
                    </div>
                </div>
            `,
            confirmButtonText: 'ثبت',

            preConfirm: () => {
                let discountAmount = normalizePrice($("#discountAmount").val());

                if (isNaN(discountAmount) || $("#discountAmount").val() === '') {
                    swalValidate('لطفا مقدار تخفیف را وارد کنید');
                    return false;
                }

                if (discountType == 'percentage') {
                    if (discountAmount < 0 || discountAmount > 100) {
                        swalValidate('درصد تخفیف باید بین صفر تا صد باشد');
                        return false;
                    }

                    $row.find('.discountType').val(discountType);

                    $row.find('.discountAmount').val(
                        formatPrice(
                            productAmount * (unitPrice * discountAmount) / 100
                        )
                    );

                    $row.find('.unitPriceAfterDiscount').val(
                        formatPrice(
                            unitPrice - (unitPrice * discountAmount) / 100
                        )
                    );
                }

                if (discountType == 'cash') {
                    if (discountAmount < 0 || discountAmount > unitPrice) {
                        swalValidate('مقدار تخفیف نمی‌تواند از قیمت واحد بیشتر باشد');
                        return false;
                    }

                    $row.find('.discountType').val(discountType);

                    $row.find('.discountAmount').val(
                        formatPrice(productAmount * discountAmount)
                    );

                    $row.find('.unitPriceAfterDiscount').val(
                        formatPrice(unitPrice - discountAmount)
                    );
                }

                $dropdownMenu.find('.discountButton').hide();
                $dropdownMenu.find('.removeDiscountButton').show();

                $row.find('.discountUnitAmount').val(
                    formatPrice(discountAmount)
                );

                let unitPriceAfterDiscount = normalizePrice(
                    $row.find('.unitPriceAfterDiscount').val()
                );

                $row.find('.productSumRow').val(
                    formatPrice(unitPriceAfterDiscount * productAmount)
                );

                sumAllRow();
            }
        });

        if (discountType == 'percentage') {
            $("#discountAmount").priceInput(2);
        }

        if (discountType == 'cash') {
            $("#discountAmount").priceInput();
        }
    });

    /*
    |--------------------------------------------------------------------------
    | Remove discount
    |--------------------------------------------------------------------------
    */

    $("#mainProduct").on('click', '.removeDiscountButton', function () {
        let $button = $(this);
        let $row = $button.closest('tr');

        let productAmount = normalizePrice(
            $row.find('.product_amount').val()
        );

        let unitPrice = normalizePrice(
            $row.find('.product_unit_price').val()
        );

        $row.find('.discountType').val('');
        $row.find('.discountAmount').val('');
        $row.find('.discountUnitAmount').val('');

        $row.find('.unitPriceAfterDiscount').val(
            formatPrice(unitPrice)
        );

        $row.find('.productSumRow').val(
            formatPrice(unitPrice * productAmount)
        );

        sumAllRow();

        $button.closest('.dropdown-menu').find('.discountButton').show();
        $button.closest('.dropdown-menu').find('.removeDiscountButton').hide();
    });

    /*
    |--------------------------------------------------------------------------
    | Marketer
    |--------------------------------------------------------------------------
    */

    $("#marketer_id").on('change', function () {
        let percent = $(this).find(':selected').data('percent');

        $("#marketer_percent").text(percent);
    });

    /*
    |--------------------------------------------------------------------------
    | Initial setup
    |--------------------------------------------------------------------------
    */

    countProductRow();

    if ($("#mainProduct tr").length && $("#brand_id").val()) {
        initializeExistingRows();
    }

    sumAllRow();

});