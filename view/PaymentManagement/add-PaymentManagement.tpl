{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}

<style>
    /* =========================================
       Payment Create Page
    ========================================= */

    .payment-create-page {
        background: #f5f7fb;
        min-height: 100vh;
        padding-bottom: 35px;
    }

    .payment-create-page .content-wrapper {
        padding-top: 22px;
    }

    /* Page Header */

    .payment-page-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        background: linear-gradient(120deg, #172b4d, #263f67);
        padding: 22px 25px;
        border-radius: 13px;
        margin-bottom: 22px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 7px 20px rgba(23, 43, 77, .12);
    }

    .payment-page-header::before {
        content: "";
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 5px;
        background: #e34b55;
    }

    .payment-page-header::after {
        content: "";
        position: absolute;
        left: -35px;
        bottom: -85px;
        width: 190px;
        height: 190px;
        border: 25px solid rgba(255, 255, 255, .035);
        border-radius: 50%;
        pointer-events: none;
    }

    .payment-header-info {
        display: flex;
        align-items: center;
        gap: 15px;
        position: relative;
        z-index: 1;
    }

    .payment-header-icon {
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, .12);
        border: 1px solid rgba(255, 255, 255, .16);
        border-radius: 12px;
    }

    .payment-header-icon i {
        color: #fff;
        font-size: 27px;
    }

    .payment-header-info h4 {
        color: #fff;
        font-size: 17px;
        font-weight: 800;
        margin: 0 0 7px;
    }

    .payment-header-info p {
        color: rgba(255, 255, 255, .65);
        font-size: 12px;
        margin: 0;
    }

    .payment-header-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;
        z-index: 2;
    }

    /* Add Payment Button */

    .payment-add-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 23px;
        padding: 0 17px;
        background: linear-gradient(135deg, #ed5963, #d83c4b);
        color: #fff !important;
        border: 1px solid rgba(255, 255, 255, .15);
        border-radius: 8px;
        font-size: 12px;
        font-weight: 700;
        text-decoration: none !important;
        box-shadow: 0 4px 12px rgba(216, 60, 75, .22);
        transition: all .25s ease;
    }

    .payment-add-btn i {
        font-size: 19px;
    }

    .payment-add-btn:hover {
        background: linear-gradient(135deg, #f16b74, #d52d40);
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(216, 60, 75, .3);
    }

    /* Form Container */

    .payment-form-container {
        background: #fff;
        border: 1px solid #e9edf4;
        border-radius: 12px;
        padding: 0 20px 20px;
        box-shadow: 0 4px 18px rgba(31, 45, 61, .045);
    }

    /* Form Heading */

    .payment-form-heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        padding: 18px 2px;
        margin-bottom: 15px;
        border-bottom: 1px solid #edf0f5;
    }

    .payment-form-heading > div {
        display: flex;
        align-items: center;
        gap: 9px;
        color: #263f67;
        font-size: 14px;
        font-weight: 800;
    }

    .payment-form-heading > div i {
        font-size: 21px;
        color: #e34b55;
    }

    .payment-form-hint {
        color: #929bad;
        font-size: 11px;
    }

    /* Refresh and Back Buttons */

    .payment-header-actions .btn,
    .payment-header-actions a:not(.payment-add-btn) {
        border-radius: 8px;
    }

    /* Responsive */

    @media (max-width: 767px) {
        .payment-page-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 20px;
        }

        .payment-header-actions {
            width: 100%;
            flex-wrap: wrap;
        }

        .payment-header-actions .payment-add-btn {
            flex: 1;
        }

        .payment-form-heading {
            align-items: flex-start;
            flex-direction: column;
        }

        .payment-form-container {
            padding: 0 12px 15px;
        }
    }

    /*test*/


    /* ==========================================
       PAYMENT DYNAMIC CARDS
    ========================================== */

    .payment-create-page .mainPaid {
        margin-top: 12px !important;
        margin-bottom: 10px;
    }

    .payment-create-page .mainPaid > .card {
        border: 1px solid #e8edf4;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(31, 45, 61, .055) !important;
        transition: all .25s ease;
        height: calc(100% - 10px);
    }

    .payment-create-page .mainPaid > .card:hover {
        box-shadow: 0 7px 22px rgba(31, 45, 61, .09) !important;
        border-color: #d5e0ef;
    }

    /* Card Header */

    .payment-create-page .mainPaid .card-header {
        min-height: 54px;
        padding: 13px 16px !important;
        background: linear-gradient(120deg, #172b4d, #29456f);
        border: 0;
        border-right: 4px solid #e34b55;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .payment-create-page .mainPaid .card-header h6 {
        color: #fff;
        font-size: 13px;
        font-weight: 800;
        margin: 0 !important;
        float: none !important;
    }

    .payment-create-page .mainPaid .removeCardButton {
        width: 29px;
        height: 29px;
        min-width: 29px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, .13) !important;
        border: 1px solid rgba(255, 255, 255, .15);
        border-radius: 8px;
        color: #fff;
        cursor: pointer;
        transition: all .2s ease;
    }

    .payment-create-page .mainPaid .removeCardButton i {
        font-size: 18px;
    }

    .payment-create-page .mainPaid .removeCardButton:hover {
        background: #e34b55 !important;
        transform: rotate(90deg);
    }

    /* Card Body */

    .payment-create-page .mainPaid .card-body {
        padding: 20px 18px !important;
        background: #fff;
    }

    /* Labels */

    .payment-create-page .mainPaid label {
        display: block;
        color: #46556d;
        font-size: 11px;
        font-weight: 700;
        margin-bottom: 7px;
    }

    /* Inputs */

    .payment-create-page .mainPaid .form-control {
        min-height: 39px;
        border: 1px solid #e1e7ef;
        border-radius: 7px;
        background-color: #fafbfd;
        color: #34445c;
        font-size: 12px;
        box-shadow: none;
        transition: all .2s ease;
    }

    .payment-create-page .mainPaid .form-control:focus {
        border-color: #6c91c4;
        background-color: #fff;
        box-shadow: 0 0 0 3px rgba(57, 112, 180, .09);
    }

    .payment-create-page .mainPaid textarea.form-control {
        min-height: 95px;
        padding: 10px 12px;
        line-height: 1.8;
    }

    /* Input Groups */

    .payment-create-page .mainPaid .input-group {
        align-items: stretch;
    }

    .payment-create-page .mainPaid .input-group .form-control {
        height: 39px;
    }

    .payment-create-page .mainPaid .input-group-text {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 48px;
        background: #edf3fa;
        border: 1px solid #e1e7ef;
        color: #526985;
        font-size: 11px;
        font-weight: 700;
        border-radius: 0 7px 7px 0;
    }

    /* File Inputs */

    .payment-create-page .mainPaid input[type="file"] {
        padding: 6px 9px;
        font-size: 11px;
        background: #f8fafc;
    }

    .payment-create-page .mainPaid input[type="file"]::file-selector-button {
        border: 0;
        background: #e9f1fc;
        color: #32669e;
        padding: 5px 10px;
        border-radius: 5px;
        margin-left: 8px;
        cursor: pointer;
        font-size: 11px;
    }

    /* Select2 */

    .payment-create-page .mainPaid .select2-container {
        width: 100% !important;
    }

    .payment-create-page .mainPaid .select2-container--default
    .select2-selection--single {
        height: 39px;
        border: 1px solid #e1e7ef;
        border-radius: 7px;
        background: #fafbfd;
    }

    .payment-create-page .mainPaid .select2-container--default
    .select2-selection--single .select2-selection__rendered {
        line-height: 37px;
        color: #34445c;
        font-size: 11px;
    }

    .payment-create-page .mainPaid .select2-container--default
    .select2-selection--single .select2-selection__arrow {
        height: 37px;
    }

    /* Section Divider */

    .payment-create-page .mainPaid .divider {
        margin-top: 25px !important;
        margin-bottom: 15px;
    }

    .payment-create-page .mainPaid .divider-text {
        color: #344d70;
        font-size: 12px !important;
        font-weight: 800;
        background: #fff;
        padding: 0 10px;
    }

    /* Documents Section */

    .payment-create-page .mainPaid #mainDocumentsRow_1,
    .payment-create-page .mainPaid [id^="mainDocumentsRow_"] {
        min-height: 65px;
        max-height: 180px;
        height: auto !important;
        overflow-y: auto;
        overflow-x: hidden;
        background: #f8fafd;
        border: 1px dashed #dce5ef;
        border-radius: 9px;
        padding: 10px 8px;
    }

    .payment-create-page .mainPaid .rowMainDocument {
        margin-top: 5px !important;
        margin-bottom: 5px;
    }

    .payment-create-page .mainPaid .rowMainDocument .input-group {
        background: #fff;
        border-radius: 7px;
    }

    .payment-create-page .mainPaid .removeDocumentRow {
        width: 37px;
        height: 39px;
        background: #fff0f1 !important;
        border: 1px solid #f7d5d8 !important;
        color: #dc4652 !important;
        border-radius: 0 7px 7px 0;
        transition: all .2s ease;
    }

    .payment-create-page .mainPaid .removeDocumentRow:hover {
        background: #dc4652 !important;
        color: #fff !important;
    }

    /* Add Document Button */

    .payment-create-page .mainPaid [id^="addDocumentRow_"] {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        float: left;
        padding: 7px 12px;
        background: #edf5ff !important;
        color: #2864a8 !important;
        border: 1px solid #d9e9fb;
        border-radius: 7px;
        font-size: 11px;
        font-weight: 700;
        cursor: pointer;
        transition: all .2s ease;
    }

    .payment-create-page .mainPaid [id^="addDocumentRow_"]:hover {
        background: #2864a8 !important;
        color: #fff !important;
    }

    /* Submit Button */

    .payment-create-page .mainPaid [id^="submitPaymentButton_"] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 7px;
        min-width: 115px;
        height: 38px;
        padding: 0 17px;
        background: linear-gradient(135deg, #315f9b, #244875);
        border: 0;
        border-radius: 7px;
        color: #fff;
        font-size: 12px;
        font-weight: 700;
        box-shadow: 0 4px 10px rgba(36, 72, 117, .16);
        transition: all .2s ease;
    }

    .payment-create-page .mainPaid [id^="submitPaymentButton_"]:hover {
        background: linear-gradient(135deg, #3d72b3, #2b5789);
        transform: translateY(-2px);
        box-shadow: 0 6px 13px rgba(36, 72, 117, .22);
    }

    /* Submit Divider */

    .payment-create-page .mainPaid .card-body hr {
        border-color: #edf0f5;
        margin: 12px 0;
    }

    /* Responsive */

    @media (max-width: 767px) {
        .payment-create-page .mainPaid {
            width: 100%;
        }

        .payment-create-page .mainPaid .card-body {
            padding: 15px 12px !important;
        }

        .payment-create-page .mainPaid .card-header {
            padding: 12px !important;
        }
    }

</style>
<div class="app-content content payment-create-page">
    <div class="content-wrapper">
        <div class="container">

            {$flashMessageHelper->formCallBack()}

            <div class="payment-page-header">
                <div class="payment-header-info">
                    <div class="payment-header-icon">
                        <i class="bx bx-wallet"></i>
                    </div>

                    <div>
                        <h4>افزودن واریزی جدید</h4>
                        <p>ثبت و مدیریت اطلاعات واریزی مشتریان</p>
                    </div>
                </div>

                <div class="payment-header-actions">
                    <a href="javascript:void(0)"
                       class="payment-add-btn"
                       id="addPaymentRow">
                        <i class="bx bx-plus"></i>
                        <span>افزودن واریزی</span>
                    </a>
                    {$buttonHelper->refreshAndBackButton()}
                </div>
            </div>

            <form action="/PaymentManagement/add"
                  id="mainForm"
                  method="post"
                  enctype="multipart/form-data">

                {$csrf->csrfTokenInput()}

                <div class="payment-form-container">

                    <div class="payment-form-heading">
                        <div>
                            <i class="bx bx-list-plus"></i>
                            <span>اطلاعات واریزی‌ها</span>
                        </div>

                        <span class="payment-form-hint">
                            برای ثبت، اطلاعات هر واریزی را وارد کنید.
                        </span>
                    </div>

                    <div class="row" id="mainRowPayment"></div>

                </div>

            </form>

        </div>
    </div>
</div>


{include 'sections/footer.tpl'}