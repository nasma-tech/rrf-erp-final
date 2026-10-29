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
                            <h4 class="card-title" style="float: right">افزودن {$singleName} جدید</h4>

                        </div>
                    </div>
                </div>
            </div>
            <form id="mainForm" enctype="multipart/form-data" method="post" action="/Products/add">
                <div class="card shadow mt-1">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-3 mt-1">
                                <label for="parent_id">محصول پایه</label>
                                <select class="form-control select2" name="parent_id" id="parent_id">
                                    <option value="" selected>محصول پایه</option>
                                    <option value="2" selected>محصول پایه2</option>
                                    {foreach $parentProducts as $parentProduct}
                                        <option value="{$parentProduct->id}">{$parentProduct->serial_number}
                                            - {$parentProduct->title}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="parent_unit_ratio">نرخ تبدیل</label>
                                <input class="form-control" type="text" name="parent_unit_ratio" id="parent_unit_ratio">
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="title">عنوان</label>
                                <input class="form-control" type="text" name="title" id="title" required>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="serial_number">کد محصول</label>
                                <input class="form-control" type="text" name="serial_number" id="serial_number"
                                       required>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">گروه محصول</label>
                                <select class="form-control select2" name="" id="">
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $productGroups as $productGroup}
                                        <option value="{$productGroup->id}">{$productGroup->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">برند</label>
                                <select class="form-control select2" name="" id="">
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $brands as $brand}
                                        <option value="{$brand->id}">{$brand->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">سطح کیفی</label>
                                <select class="form-control select2" name="" id="">
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $productQualities as $productQualitiy}
                                        <option value="{$productQualitiy->id}">{$productQualitiy->label}</option>
                                    {/foreach}
                                </select>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">واحد</label>
                                <select class="form-control select2" name="" id="">
                                    <option disabled selected>لطفا یک مورد را انتخاب کنید</option>
                                    {foreach $units as $unit}
                                    {/foreach}
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-3 mt-1">
                                <label for="">بهای تمام شده</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="" id="">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">قیمت فروش</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="" id="">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 mt-1">
                                <label for="">قیمت مصرف کننده</label>
                                <div class="input-group">
                                    <input class="form-control" type="text" name="" id="">
                                    <div class="input-group-append">
                                        <span class="input-group-text">ریال</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mt-1">
                                <label for="">توضیحات</label>
                                <textarea class="form-control" name="" id="" rows="8" style="resize: none"></textarea>
                            </div>
                            <div class="col-md-6 mt-1">
                                <label for="">توضیحات تکمیلی</label>
                                <textarea class="form-control" name="" id="" rows="8" style="resize: none"></textarea>
                            </div>
                        </div>
                    </div>
                </div>

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
                                ثبت {$singleName}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
{include 'sections/footer.tpl'}