$(function () {

    const $tableBody = $("#productRequestTableBody");

    let productCounter = 0;

    const productsById = {};

    let productsLoaded = false;
    let productsLoading = false;

    let productsLoadCallbacks = [];

    // محاسبه index بعدی برای جلوگیری از تکرار name
    $tableBody.find('input, select').each(function () {
        const name = $(this).attr('name') || '';
        const match = name.match(/projectRequest\[(\d+)]/);

        if (match) {
            productCounter = Math.max(
                productCounter,
                Number(match[1]) + 1
            );
        }
    });

    const escapeHtml = (value) => {
        return $('<div>').text(value ?? '').html();
    };

    const formatNumber = (value) => {
        return Number(value || 0).toLocaleString('fa-IR');
    };

    const initializeSelect2 = ($element) => {

        if (!$element.hasClass('select2-hidden-accessible')) {
            $element.select2({
                width: '100%'
            });
        }
    };

    // --------------------------------------------------
    // Product availability
    // --------------------------------------------------

    const showProductAvailability = (result) => {

        const requested = result.requested;
        const selected = result.selected_inventory;
        const availability = result.availability;

        let html = `
            <div class="text-right">

                <div class="mb-3 p-3 rounded bg-light">
                    <div class="text-muted small mb-1">
                        درخواست مشتری
                    </div>

                    <div class="font-weight-bold">
                        ${formatNumber(requested.amount)}
                        ${escapeHtml(requested.label)}
                    </div>
                </div>

                <div class="mb-3">
                    <div class="font-weight-bold mb-2">
                        موجودی واحد انتخاب‌شده
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>موجودی:</span>

                        <strong>
                            ${formatNumber(selected.available)}
                            ${escapeHtml(requested.label)}
                        </strong>
                    </div>

                    <div class="d-flex justify-content-between">
                        <span>وضعیت:</span>

                        <strong class="${selected.sufficient ? 'text-success' : 'text-danger'}">
                            ${selected.sufficient
            ? 'موجودی کافی است'
            : 'موجودی کافی نیست'}
                        </strong>
                    </div>
                </div>
        `;

        if (availability.checked_by === 'all_units') {

            html += `
                <hr>

                <div class="mb-3">
                    <div class="font-weight-bold mb-2">
                        بررسی کل موجودی محصول
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>موجودی کل:</span>

                        <strong>
                            ${formatNumber(availability.available_base_amount)}
                            ${escapeHtml(result.product.base_unit)}
                        </strong>
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>مقدار موردنیاز:</span>

                        <strong>
                            ${formatNumber(availability.requested_base_amount)}
                            ${escapeHtml(result.product.base_unit)}
                        </strong>
                    </div>
            `;

            if (result.other_packaging_inventory?.length) {

                html += `
                    <div class="mt-3">
                        <div class="font-weight-bold mb-2">
                            موجودی سایر بسته‌بندی‌ها
                        </div>

                        <div class="border rounded p-2">
                `;

                result.other_packaging_inventory.forEach(item => {

                    html += `
                        <div class="d-flex justify-content-between py-1">
                            <span>${escapeHtml(item.label)}</span>

                            <strong>
                                ${formatNumber(item.available)}
                            </strong>
                        </div>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;
            }

            html += `</div>`;
        }

        html += `</div>`;

        const statusConfig = {
            available: {
                title: 'موجودی کافی است',
                icon: 'success',
            },

            alternative_available: {
                title: 'با احتساب سایر بسته‌بندی‌ها، موجودی کافی است',
                icon: 'success',
            },

            unavailable: {
                title: 'موجودی محصول برای تأمین درخواست کافی نیست',
                icon: 'error',
            },
        };

        const config = statusConfig[availability.status];

        if (!config) {
            Swal.fire({
                icon: 'error',
                title: 'خطا',
                text: 'پاسخ استعلام معتبر نیست.',
            });

            return;
        }

        Swal.fire({
            title: config.title,
            icon: config.icon,
            html,
            confirmButtonText: 'متوجه شدم',
            customClass: {
                popup: 'text-right',
            },
            width: 520,
        });
    };

    const checkProductAvailability = (data) => {
        $.ajax({
            url: '/WarehouseInventory/checkProductAvailabilityForm',
            type: 'POST',
            dataType: 'json',
            data,

            success: function (response) {
                showProductAvailability(response);
            },

            error: function (xhr) {

                const message = xhr.responseJSON?.message
                    || 'خطا در دریافت اطلاعات استعلام موجودی';

                Swal.fire({
                    icon: 'error',
                    title: 'خطا در استعلام',
                    text: message,
                    confirmButtonText: 'متوجه شدم',
                });
            }
        });
    };

    // --------------------------------------------------
    // Load products
    // --------------------------------------------------

    const loadProducts = (callback = null) => {

        // نکته مهم: callback باید در این حالت هم true بگیرد.
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

        productsLoading = true;

        $.ajax({
            url: '/Products/getProductData',
            type: 'GET',
            dataType: 'json',

            success: function (result) {

                if (!Array.isArray(result)) {
                    return;
                }

                $.each(result, function (_, item) {
                    productsById[item.id] = item;
                });

                productsLoaded = true;
            },

            error: function () {

                Swal.fire({
                    icon: 'error',
                    title: 'خطا',
                    text: 'دریافت اطلاعات محصولات با مشکل مواجه شد.',
                });
            },

            complete: function () {

                productsLoading = false;

                const callbacks = [...productsLoadCallbacks];

                productsLoadCallbacks = [];

                callbacks.forEach(callback => {
                    callback(productsLoaded);
                });
            }
        });
    };

    // --------------------------------------------------
    // Product options
    // --------------------------------------------------

    const populateProductOptions = (
        $select,
        selectedProductId = null
    ) => {

        $select.empty().append(`
            <option value="" disabled>
                یک مورد را انتخاب کنید
            </option>
        `);

        $.each(productsById, function (_, product) {

            $select.append(`
                <option value="${product.id}">
                    ${escapeHtml(product.title)}
                </option>
            `);
        });

        $select.val(
            selectedProductId ? String(selectedProductId) : ''
        );

        $select.trigger('change.select2');
    };

    // --------------------------------------------------
    // Product children
    // --------------------------------------------------

    const populateProductChildren = (
        $row,
        productId,
        selectedChildId = null
    ) => {

        const $childSelect = $row.find('.product-child-select');

        const product = productsById[productId];

        $childSelect.empty();

        if (!product) {

            $childSelect
                .append(`
                    <option value="">
                        ابتدا محصول را انتخاب کنید
                    </option>
                `)
                .prop('disabled', true)
                .trigger('change.select2');

            return;
        }

        // واحد اصلی محصول
        $childSelect.append(`
            <option value="0">
                ${escapeHtml(product.unit_title || 'واحد اصلی')}
            </option>
        `);

        // بسته‌بندی‌های محصول
        $.each(product.children || [], function (_, child) {

            $childSelect.append(`
                <option value="${child.id}">
                    ${escapeHtml(child.label)}
                </option>
            `);
        });

        $childSelect
            .prop('disabled', false)
            .val(
                selectedChildId
                    ? String(selectedChildId)
                    : '0'
            )
            .trigger('change.select2');
    };

    // --------------------------------------------------
    // Create row
    // --------------------------------------------------

    const makeProductRow = (counter) => {

        return `
            <tr>

                <td class="border">
                    <select
                        class="form-control projectOptionsSelect product-select"
                        name="projectRequest[${counter}][product_id]"
                    >
                        <option value="" selected disabled>
                            یک مورد را انتخاب کنید
                        </option>
                    </select>
                </td>

                <td class="border">
                    <select
                        class="form-control product-child-select"
                        name="projectRequest[${counter}][product_child_id]"
                        disabled
                    >
                        <option value="">
                            ابتدا محصول را انتخاب کنید
                        </option>
                    </select>
                </td>

                <td class="border" width="150">
                    <input
                        class="form-control requestAmount"
                        dir="ltr"
                        type="text"
                        name="projectRequest[${counter}][request_amount]"
                        disabled
                    >
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

                        <div class="dropdown-menu">

                            <a
                                href="javascript:void(0)"
                                class="dropdown-item text-danger removeRequestRow"
                            >
                                <i class="bx bx-trash text-danger mr-1"></i>
                                حذف
                            </a>

                            <a
                                href="javascript:void(0)"
                                class="dropdown-item text-primary inquiryRequestRow"
                            >
                                <i class="bx bx-search text-primary mr-1"></i>
                                استعلام
                            </a>

                        </div>
                    </div>
                </td>

            </tr>
        `;
    };

    // --------------------------------------------------
    // Append row
    // --------------------------------------------------

    $("#productAppend").on('click', function (e) {

        e.preventDefault();

        const $button = $(this);

        if ($button.data('loading')) {
            return;
        }

        $button.data('loading', true);

        loadProducts(function (success) {

            $button.data('loading', false);

            if (!success) {
                return;
            }

            const $row = $(makeProductRow(productCounter));

            $tableBody.append($row);

            const $productSelect = $row.find('.product-select');

            const $childSelect = $row.find('.product-child-select');

            populateProductOptions($productSelect);

            initializeSelect2($productSelect);

            initializeSelect2($childSelect);

            $row.find('.requestAmount').numberInput();

            productCounter++;
        });
    });

    // --------------------------------------------------
    // Product change
    // --------------------------------------------------

    $tableBody.on('change', '.product-select', function () {

        const $row = $(this).closest('tr');

        const productId = $(this).val();

        const $amount = $row.find('.requestAmount');

        $amount
            .val('')
            .prop('disabled', !productId);

        populateProductChildren($row, productId);
    });

    // --------------------------------------------------
    // Remove row
    // --------------------------------------------------

    $tableBody.on('click', '.removeRequestRow', function (e) {

        e.preventDefault();

        $(this).closest('tr').remove();
    });

    // --------------------------------------------------
    // Inquiry
    // --------------------------------------------------

    $tableBody.on('click', '.inquiryRequestRow', function (e) {

        e.preventDefault();

        const $row = $(this).closest('tr');

        const productId = $row.find('.product-select').val();

        const productChildId = $row.find('.product-child-select').val();

        const requestAmount = $row.find('.requestAmount').val();

        if (
            !productId ||
            !productChildId ||
            !requestAmount ||
            !requestAmount.trim()
        ) {
            Swal.fire({
                icon: 'warning',
                title: 'اطلاعات ناقص',
                text: 'ابتدا محصول، بسته‌بندی و مقدار درخواست را مشخص کنید.',
            });

            return;
        }

        checkProductAvailability({
            csrfToken: csrfToken(),
            product_id: productId,

            product_child_id: productChildId === '0'
                ? null
                : productChildId,

            request_amount: requestAmount,
        });
    });

    // --------------------------------------------------
    // Initialize existing rows
    // --------------------------------------------------

    loadProducts(function (success) {

        if (!success) {
            return;
        }

        $tableBody.find('tr').each(function () {

            const $row = $(this);

            const $productSelect = $row.find('.product-select');

            const $childSelect = $row.find('.product-child-select');

            const productId = $productSelect.attr('data-product-id');

            const selectedChildId =
                $productSelect.attr('data-selected-child');

            populateProductOptions(
                $productSelect,
                productId
            );

            initializeSelect2($productSelect);

            initializeSelect2($childSelect);

            populateProductChildren(
                $row,
                productId,
                selectedChildId
            );

            $row.find('.requestAmount')
                .prop('disabled', !productId)
                .numberInput();
        });
    });

});