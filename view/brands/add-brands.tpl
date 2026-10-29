{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}
<div class="app-content content">
    <div class="content-wrapper">
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow">
                    <div class="card-header">
                        <h4 class="card-title" style="float: right">افزودن {$singleName} جدید</h4>
                        {$buttonHelper->refreshAndBackBtn()}
                    </div>
                </div>
            </div>
        </div>
        <div class="card mt-1 shadow">
            <div class="card-content">
                <div class="card-body">
                    <form id="mainForm" enctype="multipart/form-data">
                        {$csrf->csrfTokenInput()}
                        <div class="row">
                            <div class="col-md-12">
                                <div class="col-md-4">
                                    <label for="">عنوان</label>
                                    <input type="text" name="label" class="form-control">
                                </div>

                                <div class="col-md-4 mt-1">
                                    <label for="">لوگو</label>
                                    <input type="file" name="label" class="form-control">
                                </div>
                            </div>
                        </div>
                        <div class="col-12 d-flex flex-sm-row flex-column justify-content-end mt-1">
                            <button type="submit"
                                    class="btn btn-sm btn-primary glow">
                                ثبت {$singleName}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
{include 'sections/footer.tpl'}