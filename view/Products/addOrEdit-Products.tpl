{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}
<div class="app-content content">
    <div class="content-wrapper">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="card shadow">
                        <div class="card-header">
                            <h4 class="card-title" style="float: right">
                                {if $getData}
                                    ویرایش {$singleName}
                                {else}
                                    افزودن {$singleName} جدید
                                {/if}
                            </h4>
                            {$buttonHelper->refreshAndBackBtn()}
                        </div>
                    </div>
                </div>
            </div>
            <form id="mainForm"
                  enctype="multipart/form-data"
                  method="post"
                  action="{if $getData}/Products/edit/{$getData->id}{else}/Products/add{/if}">
                {$csrf->csrfTokenInput()}
                <div class="card shadow mt-1">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3 mt-1">
                                <label for="parent_id">محصول پایه</label>
                                <select class="form-control select2" name="parent_id" id="parent_id">
                                    <option value="" selected>محصول پایه
                                    </option>
                                    {foreach $parentProducts as $parentProduct}
                                        <option value="{$parentProduct->id}"
                                                {(($getData.parent_id|default:null == $parentProduct->id) ? 'selected' : '')}
                                                data-unit-label="{$parentProduct->measurementUnit->label}">{$parentProduct->serial_number}
                                            - {$parentProduct->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1" id="parent_unit_ratio_element"
                                    {(((!$getData.parent_id|default:null) ? 'style="display: none"' : ''))}>
                                <label for="parent_unit_ratio">نرخ تبدیل</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="parent_unit_ratio"
                                            {((($getData.parent_id|default:null) ? 'required' : ''))}
                                           id="parent_unit_ratio" value="{(($getData.parent_unit_ratio|default:''))}">
                                    <div class="input-group-append">
                                        <span class="input-group-text"
                                              id="parent_unit_ratio_label">{($getData.parent.measurementUnit.label|default:'-')}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="label">عنوان</label>
                                <input class="form-control" type="text" name="label"
                                       id="label" value="{($getData.label|default:'')}" required>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="serial_number">کد محصول</label>
                                <input class="form-control" type="text" name="serial_number" id="serial_number"
                                       value="{($getData.serial_number|default:'')}"
                                       required>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="group_id">گروه محصول</label>
                                <select class="form-control select2" name="group_id" id="group_id" REQUIRED>
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $productGroups as $productGroup}
                                        <option value="{$productGroup->id}" {(($getData.group_id|default:'' == $productGroup->id) ? 'selected' : '')}>{$productGroup->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="brand_id">برند</label>
                                <select class="form-control select2" name="brand_id" id="brand_id" required>
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $brands as $brand}
                                        <option value="{$brand->id}" {(($getData.brand_id|default:'' == $brand->id) ? 'selected' : '')}>{$brand->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="quality_level_id">سطح کیفی</label>
                                <select class="form-control select2" name="quality_level_id" id="quality_level_id"
                                        required>
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $productQualities as $productQualitiy}
                                        <option value="{$productQualitiy->id}" {(($getData.quality_level_id|default:'' == $productQualitiy->id) ? 'selected' : '')}>{$productQualitiy->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="grade_id">گرید</label>
                                <select class="form-control select2" name="grade_id" id="grade_id" required>
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $productGrades as $productGrade}
                                        <option value="{$productGrade->id}" {(($getData.grade_id|default:'' == $productGrade->id) ? 'selected' : '')}>{$productGrade->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="measurement_unit_id">واحد</label>
                                <select class="form-control select2" name="measurement_unit_id"
                                        id="measurement_unit_id" required>
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $measurement_unit as $unit}
                                        <option value="{$unit->id}" {(($getData.measurement_unit_id|default:'' == $unit->id) ? 'selected' : '')}>{$unit->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 mt-1">
                                <label for="cost_price">بهای تمام شده</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="cost_price" id="cost_price"
                                           value="{((isset($getData.cost_price)) ? number_format($getData.cost_price) : '')}"
                                           required>
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="sale_price">قیمت فروش</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="sale_price" id="sale_price"
                                           value="{((isset($getData.sale_price)) ? number_format($getData.sale_price) : '')}"
                                           required>
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="customer_price">قیمت مصرف کننده</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="customer_price"
                                           value="{((isset($getData.customer_price)) ? number_format($getData.customer_priceault) : '')}"
                                           id="customer_price"
                                           required>
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mt-1">
                                <label for="description">توضیحات</label>
                                <textarea class="form-control" name="description" id="description" rows="8"
                                          style="resize: none">{$getData.description|default:''}</textarea>
                            </div>
                            <div class="col-md-6 mt-1">
                                <label for="complete_description">توضیحات تکمیلی</label>
                                <textarea class="form-control" name="complete_description" id="complete_description"
                                          rows="8"
                                          style="resize: none">{$getData.complete_description|default:''}</textarea>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card shadow mt-1">
                    <div class="card-header">
                        <h4 class="card-title">بسته‌بندی‌های محصول</h4>
                    </div>

                    <div class="card-body">
                        <div class="alert alert-info">
                            <i class="bx bx-info-circle"></i>
                            قیمت بسته‌بندی‌ها بر اساس نرخ تبدیل و قیمت‌های محصول اصلی محاسبه می‌شوند.
                        </div>

                        <div id="productChildrenContainer">
                            {if $getData}
                                {foreach $getData->productChildren as $child}
                                    <div class="product-child-item border rounded p-2 mb-2">

                                        <input type="hidden"
                                               data-child-field="id"
                                               value="{$child->id}">

                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <strong class="product-child-title">بسته‌بندی</strong>

                                            <button type="button" class="btn btn-sm btn-danger remove-product-child">
                                                حذف بسته‌بندی <i class="bx bx-trash"></i>
                                            </button>
                                        </div>

                                        <div class="row">
                                            <div class="col-md-3 mt-1">
                                                <label>عنوان بسته‌بندی</label>
                                                <input type="text"
                                                       class="form-control"
                                                       data-child-field="label"
                                                       value="{$child->label}"
                                                       required>
                                            </div>

                                            <div class="col-md-3 mt-1">
                                                <label>واحد بسته‌بندی</label>
                                                <select class="form-control select2"
                                                        data-child-field="unit_id"
                                                        required>
                                                    <option value="">انتخاب واحد</option>

                                                    {foreach $measurement_unit as $unit}
                                                        <option value="{$unit->id}"
                                                                {if $child->unit_id == $unit->id}selected{/if}>
                                                            {$unit->label}
                                                        </option>
                                                    {/foreach}
                                                </select>
                                            </div>

                                            <div class="col-md-3 mt-1">
                                                <label>نرخ تبدیل</label>
                                                <div class="input-group">
                                                    <input type="text"
                                                           class="form-control product-child-ratio"
                                                           data-child-field="convert_ratio"
                                                           value="{$child->convert_ratio}"
                                                           required>

                                                    <div class="input-group-append">
                            <span class="input-group-text parent-unit-label">
                                {$getData->measurementUnit->label}
                            </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-3 mt-1 d-flex align-items-end">
                                                <div class="custom-control custom-checkbox mb-2">
                                                    <input type="checkbox"
                                                           class="custom-control-input"
                                                           data-child-field="saleable"
                                                           {if $child->saleable}checked{/if}>

                                                    <label class="custom-control-label">
                                                        قابل فروش
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row mt-2">
                                            <div class="col-md-4 mt-1">
                                                <label>بهای تمام‌شده</label>
                                                <div class="input-group">
                                                    <input type="text"
                                                           class="form-control child-cost-price"
                                                           data-child-field="cost_price"
                                                           value="{$child->cost_price}">
                                                    <div class="input-group-append">
                                                        <span class="input-group-text">ریال</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-4 mt-1">
                                                <label>قیمت فروش</label>
                                                <div class="input-group">
                                                    <input type="text"
                                                           class="form-control child-sale-price"
                                                           data-child-field="sale_price"
                                                           value="{$child->sale_price}">
                                                    <div class="input-group-append">
                                                        <span class="input-group-text">ریال</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="col-md-4 mt-1">
                                                <label>قیمت مصرف‌کننده</label>
                                                <div class="input-group">
                                                    <input type="text"
                                                           class="form-control child-customer-price"
                                                           data-child-field="customer_price"
                                                           value="{$child->customer_price}">
                                                    <div class="input-group-append">
                                                        <span class="input-group-text">ریال</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                {/foreach}
                            {/if}
                        </div>

                        <div class="d-flex justify-content-end mt-2">
                            <button type="button" id="addProductChildButton"
                                    class="btn btn-sm btn-secondary">
                                افزودن بسته‌بندی
                                <i class="bx bx-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <template id="productChildTemplate">
                    <div class="product-child-item border rounded p-2 mb-2">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="product-child-title">بسته‌بندی جدید</strong>

                            <button type="button"
                                    class="btn btn-sm btn-danger remove-product-child">
                                حذف بسته‌بندی
                                <i class="bx bx-trash"></i>
                            </button>
                        </div>

                        <div class="row">
                            <div class="col-md-3 mt-1">
                                <label>عنوان بسته ‌بندی</label>
                                <input type="text"
                                       class="form-control"
                                       data-child-field="label"
                                       required>
                            </div>

                            <div class="col-md-3 mt-1">
                                <label>واحد بسته‌بندی</label>
                                <select class="form-control select2"
                                        data-child-field="unit_id"
                                        required>
                                    <option selected disabled>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $measurement_unit as $unit}
                                        <option value="{$unit->id}">{$unit->label}</option>
                                    {/foreach}
                                </select>
                            </div>

                            <div class="col-md-3 mt-1">
                                <label>نرخ تبدیل</label>
                                <div class="input-group">
                                    <input type="text"
                                           class="form-control product-child-ratio"
                                           data-child-field="convert_ratio"
                                           required>
                                    <div class="input-group-append">
                                        <span class="input-group-text parent-unit-label">واحد محصول</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-3 mt-1 d-flex align-items-end">
                                <div class="custom-control checkbox checkbox-primary mb-2">
                                    <input type="checkbox"
                                           class="custom-control-input"
                                           data-child-field="saleable"
                                           checked>

                                    <label class="custom-control-label">
                                        قابل فروش
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="row mt-2">
                            <div class="col-md-4 mt-1">
                                <label>بهای تمام‌شده</label>
                                <div class="input-group">
                                    <input type="text"
                                           class="form-control child-cost-price"
                                           data-child-field="cost_price">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 mt-1">
                                <label>قیمت فروش</label>
                                <div class="input-group">
                                    <input type="text"
                                           class="form-control child-sale-price"
                                           data-child-field="sale_price">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-4 mt-1">
                                <label>قیمت مصرف‌کننده</label>
                                <div class="input-group">
                                    <input type="text"
                                           class="form-control child-customer-price"
                                           data-child-field="customer_price">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>

                <div class="card mt-1">
                    <div class="card-body">
                        <label class="form-label">گالری تصاویر محصول</label>

                        <input
                                type="file"
                                hidden="hidden"
                                id="imageInput"
                                name="images[]"
                                class="form-control mb-3"
                                accept="image/*"
                                multiple
                        >

                        <section id="imageGallery" class="splide">
                            <div class="splide__track">
                                <ul class="splide__list"></ul>
                            </div>
                        </section>

                        <div class="d-flex justify-content-end align-items-center gap-2 mt-2">
                            <button type="button" id="addImageButton" class="btn btn-sm btn-secondary">افزودن عکس <i
                                        class="bx bx-plus"></i></button>
                            <button type="button" id="removeCurrentImage" class="btn btn-danger btn-sm mx-1">
                                حذف عکس انتخاب‌شده
                            </button>

                            <button type="submit" class="btn btn-primary btn-sm">
                                {if $getData}
                                    ویرایش {$singleName}
                                {else}
                                    ثبت {$singleName}
                                {/if}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
{include 'sections/footer.tpl'}