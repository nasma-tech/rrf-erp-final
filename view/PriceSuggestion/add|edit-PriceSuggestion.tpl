{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}

<div class="app-content content">
    <div class="content-wrapper">
        {$flashMessageHelper->formCallBack()}
        <div class="row">
            <div class="col-md-12">
                <div class="card shadow">
                    <div class="card-header">
                        <h4 class="card-title" style="float: right">{$singleName} | مشتری :
                            <code>{$contactProjectData.contactData.first_name} {$contactProjectData.contactData.last_name}</code>
                        </h4>
                        {$buttonHelper->refreshAndBackButton()}
                    </div>
                </div>
            </div>
        </div>
        <form action="/ProductGrad/add" method="post" enctype="multipart/form-data">
            {$csrf->csrfTokenInput()}
            <div class="row">
                <div class="col-md-8">
                    <div class="card shadow" style="margin-top: 3px">
                        <div class="card-content">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="divider divider-left">
                                            <div class="divider-text font-small-2">اطلاعات اولیه</div>
                                        </div>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">تیم فروش</label>
                                        <select class="form-control select2" id="" name=""></select>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">تاریخ صدور</label>
                                        <input class="form-control text-center" id="" name="" readonly="readonly"
                                               value="{jdate("Y/m/d")}">
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">روز اعتبار</label>
                                        <select class="form-control select2" id="" name="">
                                            {for $day=1 to 30}
                                                <option value="{$day}">{$day}</option>
                                            {/for}
                                        </select>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">کشور</label>
                                        <select class="form-control select2" id="" name=""></select>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">استان</label>
                                        <select class="form-control select2" id="" name=""></select>
                                    </div>
                                    <div class="col-md-4 mt-2">
                                        <label for="">شهر</label>
                                        <select class="form-control select2" id="" name=""></select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow" style="margin-top: 3px">
                        <div class="card-content">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="divider divider-left">
                                            <div class="divider-text font-small-2">اطلاعات درخواست</div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <table class="table table-striped table-hover">
                                            <thead class="thead-dark">
                                            <tr>
                                                <th class="border">محصول</th>
                                                <th class="border">مقدار</th>
                                                <th class="border">واحد</th>
                                                <th class="border">قیمت واحد</th>
                                                <th class="border"></th>
                                            </tr>
                                            </thead>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 pl-md-0">
                    <div class="card shadow" style="margin-top: 3px">
                        <div class="card-content">
                            <div class="card-body">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-12">
                    <div class="card shadow" style="margin-top: 3px">
                        <div class="card-content">
                            <div class="card-body d-flex flex-sm-row flex-column justify-content-end">
                                <button type="submit" class="btn btn-sm btn-primary glow">صدور {$singleName}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>

    </div>
</div>


{include 'sections/footer.tpl'}