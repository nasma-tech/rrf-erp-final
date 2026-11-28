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

    const countProductRow = () => {

        let count = 1;

        $("#mainProduct tr").each(function () {
            $(this).find('td').eq(0).text(count);
            count++;
        });

    };

    const sumAllRow = () => {

        let result = {
            sumRow: 0,
            sumDiscount: 0,
        };

        $("#mainProduct tr").each(function () {

            let sumRow = parseFloat(
                $(this).find('td').eq(5).find('.productSumRow').val().replaceAll(',', '')
            );

            let discountAmount = parseFloat(
                $(this).find('td').eq(5).find('.discountAmount').val().replaceAll(',', '')
            );

            if (!isNaN(sumRow)) {
                result.sumRow += sumRow;
            }

            if (!isNaN(discountAmount)) {
                result.sumDiscount += discountAmount;
            }

        });

        $("#sumAllProductRow").text(result.sumRow.toLocaleString());
        $("#sumAllDiscountRow").text(result.sumDiscount.toLocaleString());

        return result;
    };

    // --------------------------------------------------
    // Products
    // --------------------------------------------------

    let productsById = {};
    let productsLoaded = false;
    let productsLoading = false;
    let productsLoadCallbacks = [];

    const loadProducts = (callback = null) => {

        if (productsLoaded) {
            callback?.(true);
            return;
        }

        if (callback) {
            productsLoadCallbacks.push(callback);
        }

        if (productsLoading) {
            return;
        }

        let brandId = $("#brand_id").val();

        if (!brandId) {

            productsLoadCallbacks.forEach(callback => callback(false));
            productsLoadCallbacks = [];

            return;
        }

        productsLoading = true;

        $("#Products").getOptionsValue({
            urlAddress: "/Products/getProductDataFilterByBrand",
            dataSend: {
                brandId
            },
            callback: result => {

                productsById = {};

                $.each(result, function (key, item) {
                    productsById[item.id] = item;
                });

                productsLoaded = true;
                productsLoading = false;

                productsLoadCallbacks.forEach(callback => callback(true));
                productsLoadCallbacks = [];

            }
        });

    };

    // --------------------------------------------------
    // Packaging
    // --------------------------------------------------

    const fillProductChildren = ($row, product, selectedChildId = null) => {

        let $childSelect = $row.find('.product_child_id');

        $childSelect.empty().append(`
        <option value="">
            واحد اصلی - ${product.unitName || ''}
        </option>
    `);

        $.each(product.children || [], function (key, child) {

            $childSelect.append(`
            <option value="${child.id}"
                    data-price="${child.unitPrice}"
                    data-unit="${child.unitName || ''}">
                ${child.label} - ${child.unitName || ''}
            </option>
        `);

        });

        $childSelect.prop('disabled', false);

        $childSelect.val(selectedChildId ? String(selectedChildId) : '');

    };

    const setSelectedUnit = ($row, unitData, updatePrice = true) => {

        if (!unitData) {
            return;
        }

        // همیشه شناسه واحد اصلی محصول
        $row.find('.product_unit_id').val(unitData.unitId);

        if (updatePrice) {

            let unitPrice = parseFloat(unitData.unitPrice) || 0;

            $row.find('.product_unit_price')
                .attr('readonly', false)
                .val(unitPrice.toLocaleString())
                .priceInput();

            $row.find('.unitPriceAfterDiscount')
                .val(unitPrice.toLocaleString());

            // به‌روزرسانی مجموع با قیمت جدید
            let productAmount = parseFloat(
                $row.find('.product_amount').val().replaceAll(',', '')
            ) || 0;

            $row.find('.productSumRow')
                .val((productAmount * unitPrice).toLocaleString())
                .priceInput();

            sumAllRow();
        }

    };

    const resetRowDiscount = ($row) => {

        $row.find('.discountType').val('');
        $row.find('.discountAmount').val('');
        $row.find('.discountUnitAmount').val('');

        $row.find('.discountButton').show();
        $row.find('.removeDiscountButton').hide();

    };

    const resetRowPrice = ($row) => {

        $row.find('.product_amount').val('').attr('readonly', true);
        $row.find('.product_unit_price').val('').attr('readonly', true);

        $row.find('.product_unit_id').val('');

        $row.find('td').eq(4).find('span').text('-');

        $row.find('.productSumRow').val('0');
        $row.find('.unitPriceAfterDiscount').val('');

        resetRowDiscount($row);

        sumAllRow();
    };

    // --------------------------------------------------
    // Product row
    // --------------------------------------------------

    const makeProductRow = (rowCounter) => {

        return `
            <tr>
                <td class="border"></td>

                <td class="border">
                    <select class="form-control product_id"
                            id="product_id_${rowCounter}"
                            name="productList[${rowCounter}][product_id]">
                    </select>
                    <input type="hidden" class="product_item_id" name="productList[${rowCounter}][productId]" value="">
                </td>

                <td class="border">
                    <select class="form-control product_child_id"
                            name="productList[${rowCounter}][product_child_id]"
                            disabled>
                        <option value="">واحد اصلی</option>
                    </select>

                    <input type="hidden"
                           class="product_unit_id"
                           name="productList[${rowCounter}][unit_id]">
                </td>

                <td class="border">
                    <input class="form-control product_amount"
                           readonly
                           required
                           name="productList[${rowCounter}][product_amount]"/>
                </td>

                <td class="border">
                    <input class="form-control product_unit_price"
                           readonly
                           required
                           name="productList[${rowCounter}][product_unit_price]"/>
                </td>

                <td class="border">
                    <div class="input-group">
                        <input class="form-control text-center productSumRow"
                               value="0"
                               readonly>

                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">ریال</span>
                        </div>
                    </div>

                    <input class="form-control discountType"
                           type="hidden"
                           readonly
                           name="productList[${rowCounter}][discount_type]">

                    <div class="input-group" style="margin-top: 3px">
                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">واحد تخفیف</span>
                        </div>

                        <input class="form-control discountUnitAmount text-center"
                               readonly
                               name="productList[${rowCounter}][discount_unit_amount]">
                    </div>

                    <div class="input-group" style="margin-top: 3px">
                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">مجموع تخفیف</span>
                        </div>

                        <input class="form-control discountAmount text-center"
                               readonly
                               name="productList[${rowCounter}][discount_amount]">

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

                        <input class="form-control text-center unitPriceAfterDiscount"
                               readonly
                               name="productList[${rowCounter}][unit_price_after_discount]">

                        <div class="input-group-append">
                            <span class="input-group-text font-small-2">ریال</span>
                        </div>
                    </div>
                </td>

                <td class="border">
                    <div class="dropup">
                        <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer"
                              data-toggle="dropdown"
                              aria-haspopup="true"
                              aria-expanded="false"
                              role="menu">
                        </span>

                        <div class="dropdown-menu" x-placement="bottom-start">

                            <a class="dropdown-item text-danger removeProductRowButton"
                               style="cursor: pointer">
                                <i class="bx bx-trash-alt text-danger mr-1"></i>
                                حذف ردیف
                            </a>

                            <a class="dropdown-item text-primary discountButton"
                               data-type="percentage"
                               style="cursor: pointer;">
                                <i class="bx bxs-discount text-primary mr-1"></i>
                                تخفیف درصدی
                            </a>

                            <a class="dropdown-item text-secondary discountButton"
                               data-type="cash"
                               style="cursor: pointer;">
                                <i class="bx bx-money text-secondary mr-1"></i>
                                تخفیف ریالی
                            </a>

                            <a class="dropdown-item text-danger removeDiscountButton"
                               style="cursor: pointer;display: none">
                                <i class="bx bx-x text-danger mr-1"></i>
                                حذف تخفیف
                            </a>

                        </div>
                    </div>
                </td>
            </tr>
        `;

    };

    // --------------------------------------------------
    // Add product row
    // --------------------------------------------------

    let mainProductCount = $("#mainProduct tr").length + 1;

    $("#addProductButton").on('click', function () {

        let brand = $("#brand_id").val();

        if (brand) {

            $("#mainProduct").append(makeProductRow(mainProductCount));

            let $row = $("#mainProduct tr").last();

            $row.find('.product_id').select2({
                width: '100%'
            });

            $row.find('.product_child_id').select2({
                width: '100%'
            });

            loadProducts(success => {

                if (!success) {
                    return;
                }

                let $select = $row.find('.product_id');

                $select.empty().append(`
                    <option value="">انتخاب کنید</option>
                `);

                $.each(productsById, function (key, product) {

                    $select.append(`
                        <option value="${product.id}">
                            ${product.serialNumber} - ${product.title}
                        </option>
                    `);

                });

                $select.trigger('change.select2');

            });

            countProductRow();
            mainProductCount++;

        } else {

            customAlert('warning', 'برند را انتخاب کنید');

        }

    });

    // --------------------------------------------------
    // Remove product row
    // --------------------------------------------------

    $("#mainProduct").on('click', '.removeProductRowButton', function () {

        if ($(this).data('id') !== undefined) {

            swal.fire({
                icon: 'warning',
                title: '<h5>توجه !</h5>',
                text: 'بعد از حذف امکان بازگشت وجود ندارد',
                confirmButtonText: 'تایید',
                showDenyButton: true,
                denyButtonText: 'انصراف',

                preConfirm: () => {

                    $.ajax({
                        url: '/PriceSuggestion/removeProductRow',
                        type: 'POST',
                        data: {
                            id: $(this).data('id')
                        },

                        success: result => {

                            if (result === 'deleteSuccess') {

                                $(this).closest('tr').remove();

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

            $(this).closest('tr').remove();

            sumAllRow();
            countProductRow();

        }

    });

    // --------------------------------------------------
    // Change product
    // --------------------------------------------------

    $("#mainProduct").on('change', '.product_id', function () {

        let $row = $(this).closest('tr');

        let productId = $(this).val();
        let product = productsById[productId];

        if (!product) {
            return;
        }

        // فعال کردن مقدار
        $row.find('.product_amount')
            .attr('readonly', false)
            .priceInput();

        // پاک کردن تخفیف قبلی
        resetRowDiscount($row);

        // بارگذاری بسته‌بندی‌ها
        fillProductChildren($row, product);

        // انتخاب واحد اصلی
        $row.find('.product_child_id').val('');

        // تنظیم واحد و قیمت اصلی
        setSelectedUnit($row, {
            unitId: product.unitId,
            unitName: product.unitName,
            unitPrice: product.unitPrice
        });

        // ریست select2 بسته‌بندی
        $row.find('.product_child_id').trigger('change.select2');

    });

    // --------------------------------------------------
    // Change packaging
    // --------------------------------------------------

    $("#mainProduct").on('change', '.product_child_id', function () {

        let $row = $(this).closest('tr');

        let productId = $row.find('.product_id').val();
        let product = productsById[productId];

        if (!product) {
            return;
        }

        let childId = $(this).val();

        // تغییر به واحد اصلی
        if (!childId) {

            resetRowDiscount($row);

            setSelectedUnit($row, {
                unitId: product.unitId,
                unitName: product.unitName,
                unitPrice: product.unitPrice
            });

            return;
        }

        let child = (product.children || []).find(item =>
            String(item.id) === String(childId)
        );

        if (!child) {
            return;
        }

        resetRowDiscount($row);

        setSelectedUnit($row, {
            // شناسه واحد اصلی محصول، نه واحد بسته‌بندی
            unitId: product.unitId,
            unitName: child.unitName,
            unitPrice: child.unitPrice
        });

    });

    // --------------------------------------------------
    // Calculate product row
    // --------------------------------------------------

    $("#mainProduct").on('input', '.product_amount, .product_unit_price', function () {

        let $row = $(this).closest('tr');

        let productAmount = parseFloat(
            $row.find('.product_amount').val().replaceAll(',', '')
        ) || 0;

        let productUnitPrice = parseFloat(
            $row.find('.product_unit_price').val().replaceAll(',', '')
        ) || 0;

        let totalPrice = productAmount * productUnitPrice;

        $row.find('td').eq(5).find('.productSumRow')
            .val(totalPrice.toLocaleString())
            .priceInput();

        sumAllRow();

    });

    // --------------------------------------------------
    // Add discount
    // --------------------------------------------------

    $("#mainProduct").on('click', '.discountButton', function () {

        let $row = $(this).closest('tr');

        let discountType = $(this).data('type');
        let textDiscountType = $(this).text().trim();

        let unitPrice = parseFloat(
            $row.find('td').eq(4).find('input').val().replaceAll(',', '')
        );

        let productAmount = parseFloat(
            $row.find('td').eq(3).find('input').val()
        );

        if (!unitPrice) {

            swal.fire({
                icon: 'warning',
                title: '<h6>توجه !</h6>',
                text: 'لطفا ابتدا یک محصول و قیمت واحد را وارد کنید',
                confirmButtonText: 'متوجه شدم'
            });

        } else {

            swal.fire({
                title: `<h6>${textDiscountType}</h6><hr>`,

                html: `
                    <div class="input-group">
                        <input class="form-control" id="discountAmount">

                        <div class="input-group-append">
                            <span class="input-group-text">
                                ${((discountType == 'percentage') ? '%' : 'ریال')}
                            </span>
                        </div>
                    </div>
                `,

                confirmButtonText: 'ثبت',

                preConfirm: () => {

                    let discountAmount = parseFloat(
                        $("#discountAmount").val().replaceAll(',', '')
                    );

                    if (!isNaN(discountAmount)) {

                        if (discountType == 'percentage') {

                            $("#discountAmount").priceInput(2);

                            $row.find('td').eq(5).find('.discountType').val(discountType);

                            $row.find('td').eq(5).find('.discountAmount')
                                .val((productAmount * (unitPrice * discountAmount) / 100).toLocaleString());

                            $row.find('td').eq(5).find('.unitPriceAfterDiscount')
                                .val((unitPrice - (unitPrice * discountAmount) / 100).toLocaleString());

                        }

                        if (discountType == 'cash') {

                            $("#discountAmount").priceInput();

                            $row.find('td').eq(5).find('.discountType').val(discountType);

                            $row.find('td').eq(5).find('.discountAmount')
                                .val((productAmount * discountAmount).toLocaleString());

                            $row.find('td').eq(5).find('.unitPriceAfterDiscount')
                                .val((unitPrice - discountAmount).toLocaleString());

                        }

                        $(this).closest('.dropdown-menu').find('.discountButton').hide();

                        $(this).closest('.dropdown-menu').find('.removeDiscountButton').show();

                        $row.find('td').eq(5).find('.discountUnitAmount')
                            .val(discountAmount.toLocaleString());

                    } else {

                        swalValidate('لطفا مقدار تخفیف را وارد کنید');

                    }

                    let unitPriceAfterDiscount = parseFloat(
                        $row.find('td').eq(5).find('.unitPriceAfterDiscount').val().replaceAll(',', '')
                    );

                    $row.find('td').eq(5).find('.productSumRow')
                        .val((unitPriceAfterDiscount * productAmount).toLocaleString());

                    sumAllRow();

                }

            });

            if (discountType == 'percentage') {
                $("#discountAmount").priceInput(2);
            }

            if (discountType == 'cash') {
                $("#discountAmount").priceInput();
            }

        }

    });

    // --------------------------------------------------
    // Remove discount
    // --------------------------------------------------

    $("#mainProduct").on('click', '.removeDiscountButton', function () {

        let $row = $(this).closest('tr');

        let productAmount = parseFloat(
            $row.find('td').eq(3).find('input').val()
        );

        let unitPrice = parseFloat(
            $row.find('td').eq(4).find('input').val().replaceAll(',', '')
        );

        $row.find('td').eq(5).find('.discountType').val('');
        $row.find('td').eq(5).find('.discountAmount').val('');
        $row.find('td').eq(5).find('.discountUnitAmount').val('');

        $row.find('td').eq(5).find('.unitPriceAfterDiscount')
            .val(unitPrice.toLocaleString());

        $row.find('td').eq(5).find('.productSumRow')
            .val((unitPrice * productAmount).toLocaleString());

        sumAllRow();

        $(this).closest('.dropdown-menu').find('.discountButton').show();
        $(this).closest('.dropdown-menu').find('.removeDiscountButton').hide();

    });

    // --------------------------------------------------
    // Change brand
    // --------------------------------------------------

    $("#brand_id").change(function () {

        $("#mainProduct").empty();

        mainProductCount = $("#mainProduct tr").length;

        productsById = {};
        productsLoaded = false;
        productsLoading = false;
        productsLoadCallbacks = [];

        sumAllRow();

    });

    // --------------------------------------------------
    // Edit: load existing products and packaging
    // --------------------------------------------------

    loadProducts(success => {

        if (!success) {
            return;
        }

        $("#mainProduct tr").each(function () {

            let $row = $(this);

            let $productSelect = $row.find('.product_id');

            let selectedProductId = $productSelect.val();

            let selectedChildId = $productSelect.data('selected-child');

            // پر کردن محصولات
            $productSelect.empty().append(`
                <option value="">انتخاب کنید</option>
            `);

            $.each(productsById, function (key, product) {

                $productSelect.append(`
                    <option value="${product.id}">
                        ${product.serialNumber} - ${product.title}
                    </option>
                `);

            });

            $productSelect.val(String(selectedProductId));

            let product = productsById[selectedProductId];

            if (!product) {
                return;
            }

            // بازیابی بسته‌بندی قبلی
            fillProductChildren($row, product, selectedChildId);

            // نمایش واحد قبلی بدون تغییر قیمت و تخفیف ذخیره‌شده
            let selectedChild = (product.children || []).find(item =>
                String(item.id) === String(selectedChildId)
            );

            setSelectedUnit($row, {
                unitId: product.unitId,
                unitName: selectedChild ? selectedChild.unitName : product.unitName
            }, false);

            // حفظ مقدار و قیمت موجود در فرم
            $productSelect.select2({
                width: '100%'
            });

            $row.find('.product_child_id').select2({
                width: '100%'
            });

        });

    });

    sumAllRow();

});