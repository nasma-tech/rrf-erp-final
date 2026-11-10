$(function () {
    const makeCompanyForm = () => {
        return `
                 <style>
                    .swal2-html-container{
                        margin: 0 !important;
                    }
                    .swal2-popup{
                        padding: 0 !important;
                    }
                 </style>
                 <form id="companiesForm">
                    <div class="row w-100 text-left">
                            <div class="col-md-4 mt-2">
                                <label>شناسه ملی</label>
                                <input class="form-control numberCheck" id="national_ID" name="national_ID">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>نام شرکت</label>
                                <input class="form-control" id="company_name" name="company_name">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>تاریخ تاسیس</label>
                                <input class="form-control" id="establishment_date" name="establishment_date">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>وضعیت</label>
                                <input class="form-control" id="company_status" name="company_status">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>شماره ثبت</label>
                                <input class="form-control numberCheck" id="registration_number" name="registration_number">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>کداقتصادی</label>
                                <input class="form-control numberCheck" id="economic_code" name="economic_code">
                            </div>
                            <div class="col-md-4 mt-2">
                                <label>کدپستی</label>
                                <input class="form-control numberCheck" id="postal_code" name="postal_code">
                            </div>
                            <div class="col-md-12 mt-2">
                                <label>آدرس</label>
                                <textarea class="form-control" rows="6" id="address" name="address" style="resize: none"></textarea>
                            </div>
                    </div>
                 </form>
            `
    }
    $("#quickAddCustomerCompanyButton").on('click', function () {
        Swal.fire({
            title: `<h5>اطلاعات شرکت</h5>`,
            width: '800px',
            html: makeCompanyForm(),
            confirmButtonText: 'ثبت نهایی',
            preConfirm: () => {
                let form = $("#companiesForm");
                let formData = new FormData(form[0]);
                formData.append('csrfToken', csrfToken())
                $.ajax({
                    url: '/Companies/addCompanies',
                    type: 'POST',
                    data: formData,
                    contentType: false,
                    processData: false,
                    cache: false,
                    dataType: 'json',
                    success: result => {
                        if (result.status) {
                            customAlert('success', result.message)
                            $("#customer_company_id").val(result.id)
                        } else {
                            swalValidate(result.message)
                        }
                    }
                })
                return false;
            }
        })

        $(".numberCheck").numberInput(100, false)
    })

    $("#searchCustomerCompanyButton").on('click', function () {
        swal.fire({
            title: `<h5>جستجوی شرکت</h5>`,
            width: '800px',
            html: makeCompanyForm()
        })
    })
})