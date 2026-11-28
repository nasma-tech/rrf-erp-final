$(function () {

    const sumAll = () => {
        let amount = 0;
        $(".paymentAmount").each(function () {
            amount += parseFloat($(this).val().replaceAll(',', ''));
        })
        let paymentAmount = parseFloat($("#paymentAmount").val())
        if (isNaN(amount)) {
            amount = 0;
        }
        let remainingPaymentAmount = paymentAmount - amount;
        if (remainingPaymentAmount < 0) {
            remainingPaymentAmount = 0;
        }
        $("#remainingPaymentAmount").val(remainingPaymentAmount);
        $("#remainingPaymentShow").text(remainingPaymentAmount.toLocaleString());
        return remainingPaymentAmount >= 0;

    }

    const documentInputs = (mainCounter, rowDocumentCounter) => {
        return `
            <div class="col-md-12 rowMainDocument" style="margin-top: 3px">
                <div class="input-group">
                    <input class="form-control" type="file" name="payment_documents[]">
                    <div class="input-group-append">
                        <button class="btn btn-sm btn-danger btn-icon bx bx-x removeDocumentRow" type="button"></button>
                    </div>
                </div>
            </div>
        `
    }

    const inputsMethodPayment = (counter, paymentMethod) => {
        switch (paymentMethod) {
            case 1: {
                return `
                    <div class="col-md-6 mainPaid" id="mainPaid_${counter}" style="margin-top: 3px">
                        <div class="card shadow">
                            <div class="card-header pt-1">
                                <h6 class="float-left" id="mainPaidTitle_${counter}"></h6>
                                <div class="badge badge-danger float-right removeCardButton" style="cursor: pointer;">
                                    <i class="bx bx-x"></i>
                                </div>
                            </div>
                            <div class="card-body">
                                <form id="mainPaidForm_${counter}" method="POST" enctype="multipart/form-data">
                                    <input type="hidden" value="${csrfToken()}" name="csrfToken">
                                    <input type="hidden" readonly="readonly" id="payment_method_id_${counter}" name="payment_method_id">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label>تاریخ چک</label>
                                            <input class="form-control" readonly="readonly" data-jdp id="cheque_deposit_date${counter}" name="cheque_deposit_date">
                                        </div>
                                        <div class="col-md-6">
                                            <label>شماره صیاد چک</label>
                                            <input class="form-control" dir="ltr" id="cheque_number_${counter}" name="cheque_number">
                                        </div>
                                        <div class="col-md-6 mt-2">
                                            <label>مبلغ چک</label>
                                            <div class="input-group">
                                                <input class="form-control" dir="ltr" id="cheque_amount_${counter}" name="cheque_amount">
                                                <div class="input-group-append">
                                                    <span class="input-group-text">ریال</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-md-6 mt-2">
                                            <label>تصویر چک</label>
                                            <input class="form-control" type="file" id="cheque_document_${counter}" name="cheque_document">
                                        </div>
                                        <div class="col-md-12 mt-2">
                                            <label>توضیحات</label>
                                            <textarea class="form-control" id="cheque_description_${counter}" name="cheque_description" rows="6" style="resize: none"></textarea>
                                        </div>
                                        <div class="col-md-12 mt-2">
                                            <hr>
                                        <button class="btn btn-sm btn-primary float-right" id="submitPaymentButton_${counter}" data-counter="${counter}" type="button">ثبت چک</button>
                                        </div>
                                    </div>
                                </form>
                                   
                            </div>
                        </div>
                    </div>
                      `
            }
            default: {
                $.ajax({
                    url: '/BankAccount/getAllBankAccountList',
                    type: 'GET',
                    dataType: 'json',
                    success: result => {
                        if (result.length > 0) {
                            $.each(result, function (key, item) {
                                $("#bank_account_id_" + counter).append(`
                                    <option value="${item.id}">
                                        ${item.bankName} | 
                                        شعبه : ${item.branchName} | 
                                         حساب : ${item.bankAccountNumber}
                                    </option>
                                `)
                            })
                            $("#bank_account_id_" + counter).select2()
                        }
                    }
                })
                return `
                        <div class="col-md-6 mainPaid" id="mainPaid_${counter}" style="margin-top: 3px">
                        <div class="card shadow">
                            <div class="card-header pt-1">
                                <h6 class="float-left" id="mainPaidTitle_${counter}"></h6>
                                <div class="badge badge-danger float-right removeCardButton" style="cursor: pointer;">
                                    <i class="bx bx-x"></i>
                                </div>
                            </div>
                            <div class="card-body">
                                <form id="mainPaidForm_${counter}" method="POST" enctype="multipart/form-data">
                                    <input type="hidden" value="${csrfToken()}" name="csrfToken">
                                    <input type="hidden" readonly="readonly" id="payment_method_id_${counter}" name="payment_method_id">
                                    <div class="row">
                                    <div class="col-md-12">
                                        <label>شماره حساب</label>
                                        <select class="form-control select2" name="bank_account_id" id="bank_account_id_${counter}"></select>
                                    </div>
                                    <div class="col-md-6 mt-2">
                                        <label>شماره پیگیری</label>
                                        <input class="form-control" dir="ltr" id="reference_no_${counter}" name="reference_no">
                                    </div>
                                    <div class="col-md-6 mt-2">
                                        <label>تاریخ واریز</label>
                                        <input class="form-control" readonly="readonly" data-jdp id="date_deposit_${counter}" name="date_deposit">
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <label>مبلغ</label>
                                        <div class="input-group">
                                            <input class="form-control" dir="ltr" id="amount_paid_${counter}" name="amount_paid">
                                            <div class="input-group-append">
                                                <span class="input-group-text">ریال</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <label>توضیحات</label>
                                        <textarea class="form-control" rows="6" style="resize: none" id="payment_description_${counter}"
                                                  name="payment_description"></textarea>
                                    </div>
                                    <div class="col-md-12">
                                        <div class="divider divider-left mt-5">
                                            <div class="divider-text" style="font-size: 12px">مستندات واریز</div>
                                        </div>
                                        <div class="badge badge-success float-left" id="addDocumentRow_${counter}" data-counter="${counter}" style="cursor: pointer">افزودن مستندات</div>
                                    </div>
                                    <div class="col-md-12 mt-2">
                                        <div class="row" id="mainDocumentsRow_${counter}" style="height: 200px;overflow-y: auto"></div>
                                    </div>
                                    <div class="col-md-12 mt-3">
                                    <hr>
                                        <button class="btn btn-sm btn-primary float-right" id="submitPaymentButton_${counter}" data-counter="${counter}" type="button">ثبت واریزی</button>
                                    </div>
                                </div>
                                </form>
                            </div>
                        </div>
                    </div>
                `
            }
        }
    }

    const allocationForm = (data) => {
        return `
            <form id="allocationPaymentForm">
                <input value="${csrfToken()}" readonly="readonly" type="hidden" name="csrfToken">
                <input value="${data.paymentId}" readonly="readonly" type="hidden" id="paymentId" name="paymentId">
                <input value="${data.amount}" readonly="readonly" type="hidden" id="paymentAmount" name="paymentAmount">
                <input value="0" readonly="readonly" type="hidden" id="remainingPaymentAmount">
                <div class="card w-100 border">
                <div class="card-header border-bottom">
                    <h6 class="card-title">کل واریزی : <span id="remainingPaymentAmountShow">${parseFloat(data.amount).toLocaleString()}</span></h6>
                    <h6 class="card-title">مانده واریزی : <span id="remainingPaymentShow">${parseFloat(data.amount).toLocaleString()}</span></h6>
                </div>
                <div class="card-content" style="height: 400px;overflow-y: auto">
                    <div class="card-body">
                        <div class="row w-100">
                            <div class="col-md-12">
                                <div class="table-responsive mt-3">
                                    <table class="table table-striped table-hover">
                                        <thead class="thead-dark">
                                            <tr>
                                                <th class="border" width="50">#</th>
                                                <th class="border" width="200">پیشفاکتور</th>
                                                <th class="border" width="200">نوع واریزی</th>
                                                <th class="border" width="200">مقدار تخصیص واریزی</th>
                                                <th class="border" width="100">حذف</th>
                                            </tr>
                                        </thead>
                                        <tbody id="allocationTableBody"></tbody>
                                        <tfoot class="thead-dark">
                                            <tr>
                                                <th class="border" colspan="2">مجموع</th>
                                                <th class="border" id="sumTableFooter" colspan="2">0</th>
                                                <th class="border">ریال</th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card-footer d-flex justify-content-end border-top">
                    <button class="btn btn-sm btn-primary" type="button" id="addedAllocationToListButton">افزودن به لیست تخصیص</button>
                </div>
            </div>
            </form>
        `
    }


    const countTr = () => {
        let countRow = 1;
        $("#allocationTableBody tr").each(function () {
            $(this).find('td').eq(0).text(countRow)
            countRow++;
        })
    }

    const allocationTrBodyForm = (counter) => {
        $.ajax({
            url: '/ProformaInvoice/getInvoiceList',
            dataType: 'json',
            success: result => {
                $(`#invoice_id_${counter}`).append(`<option selected disabled>انتخاب کنید</option>`)
                $.each(result.data, function (key, item) {
                    $(`#invoice_id_${counter}`).append(`<option value="${item.id}">${item.invoiceNumber}</option>`).select2({
                        width: '100%'
                    })
                })
            }
        })
        $.ajax({
            url: '/PaymentManagement/getPaymentType',
            dataType: 'json',
            success: result => {
                $.each(result.data, function (key, item) {
                    $(`#payment_allocation_type_id_${counter}`).append(`<option value="${item.id}">${item.title}</option>`).select2({
                        width: '100%'
                    })
                })
            }
        })
        return `
            <tr>
                <td class="border"></td>
                <td class="border">
                    <select class="form-control invoiceSelectId" id="invoice_id_${counter}" name="allocation[${counter}][invoiceId]"></select>
                </td>
                <td class="border">
                    <select class="form-control" id="payment_allocation_type_id_${counter}" name="allocation[${counter}][allocationType]"></select>
                </td>
                <td class="border">
                    <div class="input-group">
                        <input class="form-control paymentAmount" id="payment_amount_${counter}" name="allocation[${counter}][paymentAmount]">
                        <div class="input-group-append">
                            <span class="input-group-text">ریال</span>
                        </div>
                    </div>
                </td>
                <td class="border">
                    <button class="btn btn-sm btn-light-danger btn-icon w-100 removeAllocationRowButton" type="button">
                        <i class="bx bx-trash"></i>
                    </button>
                </td>
            </tr>
        `
    }
    const checkRowPayment = () => {
        let formOk = true;
        $("#allocationTableBody tr").each(function () {
            let $row = $(this).find('td');
            let invoiceSelect = $row.eq(1).find('select').val();
            let paymentAllocationType = $row.eq(2).find('select').val();
            let paymentAmount = $row.eq(3).find('input').val();
            if (!invoiceSelect || !paymentAllocationType || !paymentAmount) {
                formOk = false;
            }
        })
        return formOk;
    }

    let counterCard = $(".mainPaid").length;
    $("#addPaymentRow").on('click', function () {
        const buttonsList = () => {
            $.ajax({
                url: '/PaymentMethod/getPaymentMethod',
                type: 'GET',
                dataType: 'json',
                success: result => {
                    if (result.length > 0) {
                        $("#mainButtons").html(`
                            <input type="hidden" readonly="readonly" id="payment_method_id">
                            <input type="hidden" readonly="readonly" id="payment_method_name">
                        `)
                        $.each(result, function (key, item) {
                            $("#mainButtons").append(`
                                <div class="col-md-6">
                                    <button class="btn btn-sm btn-secondary w-100 selectButton" id="selectButton_${item.id}" style="margin-top: 3px" data-select="${item.id}">${item.title}</button>
                                </div>                            
                            `)
                        })
                    }
                }
            }).done(function () {
                $(".selectButton").on('click', function () {
                    let buttonId = $(this).data('select')
                    $('.selectButton').each(function () {
                        $(this).removeClass('btn-success btn-secondary').addClass('btn-secondary')
                    })
                    $(this).removeClass('btn-secondary').addClass('btn-success')
                    $("#payment_method_id_" + counterCard).val(buttonId)
                    $("#payment_method_id").val(buttonId)
                    $("#payment_method_name").val($(this).text())
                })
            })
            return `
                <div class="row" id="mainButtons"></div>
            `
        }
        Swal.fire({
            title: '<h5>نحوه پرداخت</h5><hr>',
            html: buttonsList(),
            width: '40rem',
            confirmButtonText: 'تایید',
            showDenyButton: true,
            denyButtonText: 'انصراف',
            allowOutsideClick: () => {
                if (!$("#payment_method_id").val()) {
                    swalValidate('لطفا یک مورد را انتخاب کنید')
                    return false;
                }
            },
            allowEscapeKey: () => {
                if (!$("#payment_method_id").val()) {
                    swalValidate('لطفا یک مورد را انتخاب کنید')
                    return false;
                }
            },
            preConfirm: () => {
                if (!$("#payment_method_id").val()) {
                    swalValidate('لطفا یک مورد را انتخاب کنید')
                    return false;
                } else {
                    $("#mainRowPayment").append(inputsMethodPayment(counterCard, parseInt($("#payment_method_id").val())))
                    $(`#mainPaidTitle_${counterCard}`).text($("#payment_method_name").val())
                    $(`#date_deposit${counterCard}`).datePicker()
                    $(`#cheque_deposit_date${counterCard}`).datePicker()
                    $(`#amount_paid_${counterCard}`).priceInput()
                    $(`#addDocumentRow_${counterCard}`).on('click', function () {
                        let thisCounter = $(this).data('counter');
                        $(`#mainDocumentsRow_${thisCounter}`).append(documentInputs())
                        $(".removeDocumentRow").off('click').on('click', function () {
                            let removeDocumentRow = $(this)
                            removeDocumentRow.closest('.rowMainDocument').hide('slow')
                            setTimeout(function () {
                                removeDocumentRow.closest('.rowMainDocument').remove()
                            }, 1000)
                        })
                    })
                    $(`#payment_method_id_${counterCard}`).val($("#payment_method_id").val())
                    $(`#submitPaymentButton_${counterCard}`).on('click', function () {
                        let thisFormCounter = $(this).data('counter');
                        let form = $("#mainPaidForm_" + thisFormCounter);
                        let formData = new FormData(form[0])
                        $.ajax({
                            url: '/PaymentManagement/add',
                            type: 'POST',
                            data: formData,
                            processData: false,
                            contentType: false,
                            cache: false,
                            dataType: 'json',
                            success: result => {
                                if (result.success) {
                                    customAlert('success', result.message)
                                    $(`#mainPaid_${thisFormCounter}`).hide('slow');
                                    setTimeout(function () {
                                        $(`#mainPaid_${thisFormCounter}`).remove()
                                    }, 1000)

                                    swal.fire({
                                        title: '<h6>تخصیص به پیشفاکتور</h6>',
                                        html: allocationForm(result.data),
                                        width: '70%',
                                        confirmButtonText: 'تایید',
                                        showDenyButton: true,
                                        denyButtonText: 'انصراف',
                                        didOpen: () => {
                                            let count = 1;
                                            $("#addedAllocationToListButton").on('click', function () {
                                                if (!sumAll()) {
                                                    swalValidate('مقدار مانده ندارید !')
                                                }
                                                if (checkRowPayment()) {
                                                    $("#allocationTableBody").append(allocationTrBodyForm(count))
                                                    $('#allocationTableBody > tr:last').find('select').first().focus();
                                                    $(".paymentAmount").priceInput()
                                                    swalClearValidate()
                                                    countTr()
                                                    count++;
                                                } else {
                                                    swalValidate('موارد را کامل پر کنید')
                                                }
                                            })

                                            $("#allocationTableBody").on('click', '.removeAllocationRowButton', function () {
                                                $(this).closest('tr').remove()
                                                sumAll()
                                                countTr()
                                            })
                                            $("#allocationTableBody").on('input', '.paymentAmount', function () {
                                                if (!sumAll()) {
                                                    swalValidate('مانده کمتر از مقدار ورودی است')
                                                    swalConfirmButton({enableOrDisable: true})
                                                    return false;
                                                } else {
                                                    swalConfirmButton({enableOrDisable: false})
                                                    swalClearValidate()
                                                }
                                            })
                                        },
                                        allowOutsideClick: false,
                                        allowEscapeKey: false,
                                        preConfirm: () => {
                                            if (checkRowPayment()) {
                                                let form = $("#allocationPaymentForm");
                                                let formData = new FormData(form[0])
                                                $.ajax({
                                                    url: '/PaymentAllocation/allocationPaymentInPaymentManagement',
                                                    type: 'POST',
                                                    data: formData,
                                                    processData: false,
                                                    contentType: false,
                                                    cache: false,
                                                    dataType: 'json',
                                                    success: result => {
                                                        if (result.success) {
                                                            customAlert('success', result.message)
                                                        } else {
                                                            swalValidate(result.message)
                                                        }
                                                        return false;
                                                    }
                                                })
                                            } else {
                                                swalValidate('موارد را کامل پر کنید')
                                                return false;
                                            }
                                        }
                                    })
                                } else {
                                    customAlert('error', result.message)
                                }
                            }
                        })
                    })
                    $(`#cheque_number_${counterCard}`).numberInput(16)
                    $(`#cheque_amount_${counterCard}`).priceInput()
                    counterCard++
                }
            }
        }).then(function () {
            $(".removeCardButton").off('click').on('click', function () {
                let removeButton = $(this)
                swal.fire({
                    icon: 'question',
                    title: '<h6>از حدف رکورد اطمینان دارید؟</h6>',
                    text: 'بعد از حدف امکان بازگشت وجود ندارد',
                    confirmButtonText: 'انصراف',
                    showDenyButton: true,
                    denyButtonText: 'حذف',
                    preDeny: () => {
                        removeButton.closest('.mainPaid').hide('slow')
                        setTimeout(function () {
                            removeButton.closest('.mainPaid').remove()
                        }, 1000)
                    }
                })
            })
        })
    })


})