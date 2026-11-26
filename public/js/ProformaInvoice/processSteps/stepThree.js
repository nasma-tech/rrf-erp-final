$(function () {

    const warehouseInquiryElement = (data) => {

        let tbody = ``;
        let counter = 0;

        $.each(data.data, function (product_id, value) {

            tbody += `
                <tr>
                    <td class="border">${++counter}</td>

                    <td class="border">
                        ${value.productData.serial_number} - ${value.productData.label}
                    </td>

                    <td class="border">
                        <div class="input-group">
                            <input class="form-control"
                                   type="text"
                                   readonly
                                   value="${value.summary.total_reserved}">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    ${value.productData.measurement_unit.label}
                                </span>
                            </div>
                        </div>
                    </td>

                    <td class="border">
                        <div class="input-group">
                            <input class="form-control"
                                   type="text"
                                   id="warehouseInquiryItem_${product_id}"
                                   readonly
                                   value="${value.summary.total_remaining}">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    ${value.productData.measurement_unit.label}
                                </span>
                            </div>
                        </div>
                    </td>

                    <td class="border">
                        <div class="input-group">
                            <input class="form-control"
                                   type="text"
                                   id="warehouseInquiryRemaining_${product_id}"
                                   readonly
                                   value="${value.summary.total_remaining}">
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    ${value.productData.measurement_unit.label}
                                </span>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        });

        return `
            <div class="divider">
                <div class="divider-text">موجودی انبار</div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-striped text-center">
                    <thead class="thead-dark">
                        <tr>
                            <th class="border">#</th>
                            <th class="border">نام محصول</th>
                            <th class="border">رزرو شده</th>
                            <th class="border">قابل تخصیص</th>
                            <th class="border">مانده</th>
                        </tr>
                    </thead>

                    <tbody>${tbody}</tbody>
                </table>
            </div>
        `;
    };

    $.fn.removeSeparator = function () {
        return Number(String(this.val() || 0).replaceAll(',', '')) || 0;
    };

    const numberFormat = (number) => {
        return Number(number).toLocaleString('en-US');
    };

    $(document).on('input', '.allocationEnteredAmountInput', function () {

        updateAllocation($(this));

    });

    $("#allocationWarehouseId").on('change', async function () {

        let warehouseId = $(this).val();

        if (!warehouseId) {

            $("#allocationInquiryElement").hide().empty();

            $(".allocationEnteredAmountInput")
                .val("")
                .prop('disabled', true);

            return;
        }

        try {

            const result = await $.ajax({
                url: "/ProformaInvoice/inventoryInquiryByInvoiceForm",
                method: "POST",
                dataType: "json",
                data: {
                    csrfToken: csrfToken(),
                    warehouse_id: warehouseId,
                    invoice_id: $("#invoiceId").val()
                }
            });

            if (result) {

                $("#allocationInquiryElement")
                    .show()
                    .html(warehouseInquiryElement(result));

                $(".allocationEnteredAmountInput")
                    .val("");

                $(".allocationSelectInvoiceProduct")
                    .prop({
                        'disabled': false,
                        'checked': false
                    });
                updateAllocation();

            }

        } catch (error) {

            customAlert('error', 'خطا در دریافت موجودی انبار');

        }

    });

    function updateAllocation($changedInput = null) {

        let allocationData = {};
        let hasError = false;
        let alertMessage = null;

        $.each($(".allocationEnteredAmountInput"), function () {

            let $input = $(this);

            let id = $input.data('id');
            let productId = $input.data('product_id');

            let enteredAmount = $input.removeSeparator();

            let maxAmount = Number(
                String($input.data('max') || 0).replaceAll(',', '')
            ) || 0;

            // کنترل سقف تخصیص ردیف فاکتور
            if ($changedInput && $input.is($changedInput) && enteredAmount > maxAmount) {

                enteredAmount = maxAmount;

                $input.val(numberFormat(maxAmount));

                alertMessage = 'مقدار تخصیص از سقف مجاز این محصول بیشتر است';

            }

            if (!allocationData[productId]) {

                allocationData[productId] = {
                    total: 0,
                    inputs: []
                };

            }

            allocationData[productId].total += enteredAmount;

            allocationData[productId].inputs.push({
                id,
                element: $input,
                amount: enteredAmount
            });

        });

        $.each(allocationData, function (productId, value) {

            let availableAmount = $(`#warehouseInquiryItem_${productId}`)
                .removeSeparator();

            let remainingAmount = availableAmount - value.total;

            // جلوگیری از منفی شدن موجودی
            if (remainingAmount < 0 && $changedInput) {

                let changedProductId = $changedInput.data('product_id');

                if (String(changedProductId) === String(productId)) {

                    let currentAmount = $changedInput.removeSeparator();

                    let otherAllocations = value.total - currentAmount;

                    let maxAllowedAmount = Math.max(
                        0,
                        availableAmount - otherAllocations
                    );

                    $changedInput.val(numberFormat(maxAllowedAmount));

                    alertMessage = 'مقدار تخصیص بیشتر از موجودی قابل تخصیص انبار است';

                    return false;

                }

            }

        });

        if (alertMessage) {

            customAlert('warning', alertMessage);

        }

        allocationData = {};

        $.each($(".allocationEnteredAmountInput"), function () {

            let productId = $(this).data('product_id');
            let amount = $(this).removeSeparator();

            if (!allocationData[productId]) {
                allocationData[productId] = 0;
            }

            allocationData[productId] += amount;

        });

        $.each(allocationData, function (productId, totalAmount) {

            let availableAmount = $(`#warehouseInquiryItem_${productId}`)
                .removeSeparator();

            let remainingAmount = availableAmount - totalAmount;

            if (remainingAmount < 0) {
                remainingAmount = 0;
                hasError = true;
            }

            $(`#warehouseInquiryRemaining_${productId}`)
                .val(numberFormat(remainingAmount));

        });

        $.each($(".allocationEnteredAmountInput"), function () {

            let $input = $(this);

            let maxAmount = Number(
                String($input.data('max') || 0).replaceAll(',', '')
            ) || 0;

            let enteredAmount = $input.removeSeparator();

            if (enteredAmount > maxAmount) {
                $input.addClass('is-invalid');
                hasError = true;
            } else {
                $input.removeClass('is-invalid');
            }

        });

        return !hasError;
    }

    $("#submitProductPart").on('click', function (event) {

        let $warehouseId = $("#allocationWarehouseId");

        if (!$warehouseId.val()) {

            event.preventDefault();

            $warehouseId.focus();

            customAlert('warning', 'ابتدا انبار را مشخص کنید');

            return false;
        }

        if (!updateAllocation()) {

            event.preventDefault();

            customAlert(
                'warning',
                'مقدار تخصیص از سقف مجاز یا موجودی انبار بیشتر است'
            );

            return false;
        }


        if ($(".allocationSelectInvoiceProduct:checked").length === 0) {
            customAlert(
                'warning',
                'حداقل یک ردیف برای تخصیص انتخاب کنید'
            );
            return false;
        }

    });

    $(".allocationSelectInvoiceProduct").on('input', function () {
        let id = $(this).data('id')
        if ($(this).prop('checked')) {
            $(`#allocationEnteredAmountInput_${id}`).prop('disabled', false).val('').trigger('input')
        } else {
            $(`#allocationEnteredAmountInput_${id}`).prop('disabled', true).val('').trigger('input')
        }
    })

    $(".deleteAllocationPart").on('click', function () {
        let id = $(this).data('id')

        Swal.fire({
            title: 'حذف پارت',
            icon: "warning",
            text: "از حذف پارت اطمینان دارید؟",
            showDenyButton: true,
            confirmButtonText: 'تایید',
            denyButtonText: 'انصراف',
            preConfirm: () => {
                $.ajax({
                    url: `/ProductPart/removeProductPartForm/${id}`,
                    method: 'POST',
                    data: {
                        csrfToken: csrfToken()
                    },
                    success: result => {
                        handeOfAjaxJsonResponse(result)
                    }
                })
            }
        })
    })
});