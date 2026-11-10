<div class="card shadow cc-request-info" style="margin-top: 4px;height: 100%">
    <div class="card-content">
        <div class="card-header">
            <div class="divider divider-left">
                <div class="divider-text" style="font-size: 11px">اطلاعات درخواست</div>
            </div>
        </div>
        <div class="card-body">
            <div class="row">
                <div class="col-md-4">
                    <label for="industry_type_id">نوع صنعت</label>
                    <select class="form-control select2" required="required" id="industry_type_id" name="industry_type_id" {($getData)?'disabled':''}>
                        <option selected disabled>یک مورد را انتخاب کنید</option>
                        {foreach $IndustryType as $item}
                            <option value="{$item->id}"{(($getData.industry_type_id|default:'') == $item.id)?'selected':''}>{$item->title}</option>
                        {/foreach}
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="payment_type">نوع پرداخت</label>
                    <select class="form-control select2" required="required" id="payment_type" name="payment_type" {($getData)?'disabled':''}>
                        <option selected disabled>یک مورد را انتخاب کنید</option>
                        <option value="1" {(($getData.payment_type|default:'') == 1)?'selected':''}>نقد</option>
                        <option value="2" {(($getData.payment_type|default:'') == 2)?'selected':''}>اقساط</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label for="purchase_type">نوع خرید</label>
                    <select class="form-control select2" required="required" id="purchase_type" name="purchase_type" {($getData)?'disabled':''}>
                        <option selected disabled>یک مورد را انتخاب کنید</option>
                        <option value="1" {(($getData.purchase_type|default:'') == 1)?'selected':''}>نو</option>
                        <option value="2" {(($getData.purchase_type|default:'') == 2)?'selected':''}>کارکرده</option>
                    </select>
                </div>

                <div class="table-responsive mt-3">
                    <table class="table text-center">
                        <thead class="thead-dark">
                        <tr>
                            <th class="border">گروه</th>
                            <th class="border">برند</th>
                            <th class="border">مدل</th>
                            <th class="border">تیپ</th>
                            <th class="border">تعداد</th>
                            <th class="border">عملیات</th>
                        </tr>
                        </thead>
                        <tbody id="productRequestTableBody">
                        {foreach $getData.projectRequests|default:[] as $item}
                            <tr>
                                <td class="border">{$item.carGroupData.title}</td>
                                <td class="border">{$item.carBrandData.title}</td>
                                <td class="border">{$item.carModelData.title}</td>
                                <td class="border">{$item.carTipData.title}</td>
                                <td class="border">{$item.request_amount}</td>
                                <td class="border">-</td>
                            </tr>
                        {/foreach}
                        </tbody>
                        {if !$getData.project_code|default:''}
                            <tfoot>
                            <tr>
                                <th class="border" colspan="6">
                                    <button class="btn btn-xs btn-success w-100" id="productAppend" type="button">
                                        <i class="bx bx-plus" style="font-size: 14px"></i>
                                    </button>
                                </th>
                            </tr>
                            </tfoot>
                        {/if}
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
