{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}

<div class="app-content content">
    <div class="content-wrapper">
        {$flashMessageHelper->formCallBack()}
        <div class="row">
            <div class="col-md-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title" style="float: right">افزودن {$singleName} جدید</h4>
                        {$buttonHelper->refreshAndBackButton()}
                    </div>
                    <hr>
                    <div class="card-content">
                        <div class="card-body">
                            <div id="svg-tree"></div>
                            <div class="col-12 d-flex flex-sm-row flex-column justify-content-end mt-1">
                                <button type="submit"
                                        class="btn btn-sm btn-primary glow">
                                    ثبت {$singleName}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


{include 'sections/footer.tpl'}