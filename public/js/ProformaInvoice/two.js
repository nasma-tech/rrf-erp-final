$(function () {
    
    const rowProduct = (rowCounter) => {
        return `
            <tr>
                <td class="border">
                    <select class="form-control" id="product_id_${rowCounter}" name="productInfo[${rowCounter}][product_id]"></select>
                </td>
                <td class="border">
                    <input class="form-control" id="product_amount_${rowCounter}" name="productInfo[${rowCounter}][product_amount]">
                </td>
                <td class="border">
                    -
                </td>
                <td class="border">
                    <input class="form-control" id="product_price_${rowCounter}" name="productInfo[${rowCounter}][product_price]">
                </td>
                <td class="border">
                    <input class="form-control" id="" name="">
                </td>
                <td class="border">
                    <div class="dropup">
                        <span class="bx bx-dots-vertical-rounded font-medium-3 dropdown-toggle nav-hide-arrow cursor-pointer" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" role="menu">
                        </span>
                        <div class="dropdown-menu" x-placement="bottom-start" style="position: absolute; transform: translate3d(53px, 20px, 0px); top: 0px; left: 0px; will-change: transform;">
                          <a class="dropdown-item text-primary" href="#">
                            <i class="bx bxs-discount mr-1 text-primary"></i> تخفیف</a>
                          <a class="dropdown-item text-danger" href="#"><i class="bx bx-trash-alt mr-1 text-danger"></i> حذف</a>
                        </div>
                    </div>
                </td>
            </tr> 
        `;
    }

    let rowCounter = (($("#mainBodyProduct tr").length == 0)?1: $("#mainBodyProduct tr").length);
    $("#addProductRowButton").on('click',function () {
        $("#mainBodyProduct").append(rowProduct(rowCounter))

        $(`#test_${rowCounter}`).select2({
            width:'100%'
        })
        rowCounter++;
    })
})