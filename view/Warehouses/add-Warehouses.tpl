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
                            <ul class="nav nav-tabs nav-justified" id="myTab2" role="tablist">
                                <li class="nav-item">
                                    <a class="nav-link active" id="definision-tab-justified" data-toggle="tab"
                                       href="#definision-just" role="tab" aria-controls="definision-just"
                                       aria-selected="true">
                                        اطلاعات انبار
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="physicalAddress-tab-justified" data-toggle="tab"
                                       href="#physicalAddress-just" role="tab" aria-controls="physicalAddress-just"
                                       aria-selected="true">
                                        آدرس انبار
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="profile-tab-justified" data-toggle="tab"
                                       href="#ownership-just" role="tab" aria-controls="profile-just"
                                       aria-selected="true">
                                        مالکیت انبار
                                    </a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link" id="team-tab-justified" data-toggle="tab" href="#team-just"
                                       role="tab" aria-controls="team-just" aria-selected="false">
                                        تیم انبار
                                    </a>
                                </li>
                            </ul>
                            <!-- Tab panes -->
                            <div class="tab-content pt-1">
                                <div class="tab-pane active" id="definision-just" role="tabpanel"
                                     aria-labelledby="definision-tab-justified">
                                    <div class="col-md-12 row">
                                        <div class="col-md-3">
                                            <label for="wareHouseName">عنوان انبار</label>
                                            <input class="form-control" type="text" name="wareHouseName" required>
                                        </div>
                                        <div class="col-md-3">
                                            <label for="warehouseBrand">برند</label>
                                            <select name="warehouseBrand" required class="form-control select2">
                                                <option disabled selected>یکی از موارد را انتخاب کنید</option>
                                                {foreach $brands As $data}
                                                    <option value="{$data['id']}">{$data['label']}</option>
                                                {/foreach}
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label for="warehouseBrand">نوع انبار</label>
                                            <select name="warehouseBrand" required class="form-control select2">
                                                <option disabled selected>یکی از موارد را انتخاب کنید</option>
                                                {foreach $brands As $data}
                                                    <option value="{$data['id']}">{$data['label']}</option>
                                                {/foreach}
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label for="warehouseBrand">کاربرد انبار</label>
                                            <select name="warehouseBrand" required class="form-control select2">
                                                <option disabled selected>یکی از موارد را انتخاب کنید</option>
                                                {foreach $brands As $data}
                                                    <option value="{$data['id']}">{$data['label']}</option>
                                                {/foreach}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane" id="physicalAddress-just" role="tabpanel"
                                     aria-labelledby="physicalAddress-tab-justified">
                                    <div class="col-md-12 row">
                                        <div class="col-md-3">
                                            <label for="country_id">کشور</label>
                                            <select class="form-control select2" name="country_id" id="country_id">
                                                <option disabled selected>یکی از موارد زیر را انتخاب کنید</option>
                                                {foreach $countries as $data}
                                                    <option value="{$data['id']}">{$data['persian_title']}</option>
                                                {/foreach}
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <label for="state_id">استان</label>
                                            <select name="state_id" id="state_id" class="form-control select2" disabled></select>
                                        </div>
                                        <div class="col-md-3">
                                            <label for="city_id">شهر</label>
                                            <select name="city_id" id="city_id" class="form-control select2" disabled></select>
                                        </div>
                                    </div>
                                        <div class="col-md-12 mt-2">
                                            <label for="wareHouceFullAdress">آدرس </label>
                                            <textarea class="form-control" style="resize: none" id="wareHouceFullAdress" name="wareHouceFullAdress"></textarea>
                                        </div>
                                </div>
                                <div class="tab-pane" id="ownership-just" role="tabpanel"
                                     aria-labelledby="ownership-tab-justified">
                                    <p>
                                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان
                                        گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و
                                        برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای
                                    </p>
                                </div>
                                <div class="tab-pane" id="team-just" role="tabpanel"
                                     aria-labelledby="team-tab-justified">
                                    <p>
                                        لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان
                                        گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و
                                        برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


{include 'sections/footer.tpl'}