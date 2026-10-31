{include "sections/header.tpl"}
{include "sections/top-bar.tpl"}
{include "sections/side-menu.tpl"}
<div class="app-content content brand-edit-page">
    <div class="content-wrapper">
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header d-flex align-items-center justify-content-between">
                        <h4 class="card-title mb-0">
                            ویرایش {$singleName}
                        </h4>
                        <div>
                            {$buttonHelper->refreshAndBackBtn()}
                        </div>
                    </div>
                    <div class="card-content">
                        <div class="card-body">
                            <ul class="nav nav-tabs brand-edit-page-tabs" id="brandEditPageTabs" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="brand-edit-page-info-tab" data-toggle="tab"
                                       href="#brand-edit-page-info"
                                       role="tab" aria-controls="brand-edit-page-info" aria-selected="true">
                                        <i class="bx bx-purchase-tag"></i>
                                        اطلاعات برند
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="brand-edit-page-price-tab" data-toggle="tab"
                                       href="#brand-edit-page-price"
                                       role="tab" aria-controls="brand-edit-page-price" aria-selected="false">
                                        <i class="bx bx-trending-up"></i>
                                        درصد افزایش قیمت محصولات
                                    </a>
                                </li>
                            </ul>
                            <form id="mainForm" enctype="multipart/form-data">
                                {$csrf->csrfTokenInput()}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{include "sections/footer.tpl"}
