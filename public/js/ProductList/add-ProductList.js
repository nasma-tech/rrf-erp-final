$(function () {
    let groups = [
        {
            id: 0,
            title: "گروه اول"
        },
        {
            id: 2,
            title: "گروه دوم"
        }
    ];
    let grades = [
        {
            id: 0,
            title: "گرید اول"
        },
        {
            id: 2,
            title: "گرید دوم"
        }
    ];
    let brands = [
        {
            id: 0,
            title: "برند اول"
        },
        {
            id: 2,
            title: "برند دوم"
        }
    ];
    let quality = [
        {
            id: 0,
            title: "کیفیت اول"
        },
        {
            id: 2,
            title: "کیفیت دوم"
        }
    ];
    let unit = [
        {
            id: 0,
            title: "واحد اول"
        },
        {
            id: 2,
            title: "واحد دوم"
        }
    ];

    function GetGroups(group_id = null) {
        let html = '<option selected disabled>انتخاب کنید</option>';

        groups.forEach(value => {
            html += `<option value="${value.id}" ${value.id == group_id ? 'selected' : ''}>${value.title}</option>`;
        });

        return html;
    }

    function GetGrades(grades_id = null) {
        let html = '<option selected disabled>انتخاب کنید</option>';

        grades.forEach(value => {
            html += `<option value="${value.id}" ${value.id == grades_id ? 'selected' : ''} >${value.title}</option>`;
        });

        return html;
    }

    function GetBrands(brand_id = null) {
        let html = '<option selected disabled>انتخاب کنید</option>';

        brands.forEach(value => {
            html += `<option value="${value.id}" ${value.id == brand_id ? 'selected' : ''} >${value.title}</option>`;
        });

        return html;
    }

    function GetQuality(quality_id = null) {
        let html = '<option selected disabled>انتخاب کنید</option>';

        quality.forEach(value => {
            html += `<option value="${value.id}" ${value.id == quality_id ? 'selected' : ''} >${value.title}</option>`;
        });

        return html;
    }

    function GetUnits(unit_id = null) {
        let html = '<option selected disabled>انتخاب کنید</option>';

        unit.forEach(value => {
            html += `<option value="${value.id}" ${value.id == unit_id ? 'selected' : ''} >${value.title}</option>`;
        });

        return html;
    }

    const data = {
        id: 'md',
        data: {
            imageURL: '/Storage/DefaultImages/Default.jpg',
            name: 'Devlin Cowins',
            title: 'Managing director',
            metrics: [
                {label: 'Quality of work', value: 90},
                {label: 'Initiative', value: 85},
                {label: 'Cooperative', value: 95}
            ]
        },

    };

    const container = document.getElementById('svg-tree');

    if (!container) return;

    let tree;
    let nodeCounter = 0;

    const metricLabels = [
        'Quality of work',
        'Initiative',
        'Cooperative'
    ];

    function escapeHtml(value = '') {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
    }

    function avatarUrl(name) {
        return 'https://api.dicebear.com/9.x/initials/svg?seed=' +
            encodeURIComponent(name || 'Employee');
    }

    function normalizeNodes(node) {
        node.data = node.data || {};
        node.data.nodeId = node.id;

        if (!Array.isArray(node.data.metrics)) {
            node.data.metrics = metricLabels.map(label => ({
                label,
                value: 0
            }));
        }

        node.children = node.children || [];

        node.children.forEach(normalizeNodes);
    }

    normalizeNodes(data);

    function findNode(node, id) {
        if (String(node.id) === String(id)) return node;

        for (const child of node.children || []) {
            const found = findNode(child, id);

            if (found) return found;
        }

        return null;
    }

    function findParent(node, id) {
        for (const child of node.children || []) {
            if (String(child.id) === String(id)) {
                return node;
            }

            const found = findParent(child, id);

            if (found) return found;
        }

        return null;
    }

    function createEmptyNode() {
        const id = `employee_${Date.now()}_${++nodeCounter}`;

        return {
            id,
            data: {
                nodeId: id,
                imageURL: '',
                name: '',
                title: '',
                isNew: true,
                metrics: metricLabels.map(label => ({
                    label,
                    value: 0
                }))
            },
            children: []
        };
    }

    function refreshTree() {
        tree.render(data);
    }

    function addChild(parentId) {
        const parent = findNode(data, parentId);

        if (!parent) return;

        const child = createEmptyNode();

        parent.children = parent.children || [];
        parent.children.push(child);

        refreshTree();

        // Open the form immediately after adding.
        editNode(child.id);
    }

    function editNode(nodeId) {
        const node = findNode(data, nodeId);

        if (!node) return;

        const info = node.data;

        Swal.fire({
            title: info.isNew ? 'افزودن محصول' : 'ویرایش محصول',

            width: '850px',
            html: `
    <div class="product-form" dir="rtl" style="text-align:right;">

        <!-- Product Image -->
        <div class="text-center mb-4">
            <label class="d-block mb-2 fw-bold">تصویر محصول</label>
        <div id="photos">

            <button
                type="button"
                class="btn p-0 border-0 bg-transparent ProductImage"
                style="cursor:pointer;"
            >
                <img
                    class="productImagePreview"
                    src="${escapeHtml(info.imageURL || '/Storage/DefaultImages/Default.jpg')}"
                    alt="تصویر محصول"
                    style="
                        width:100px;
                        height:100px;
                        object-fit:cover;
                        border-radius:14px;
                        border:2px dashed #cbd5e1;
                        padding:5px;
                    "
                >
            </button>
</div>
            <div class="small text-muted mt-2">
                <button class="btn btn-sm btn-primary" id="appendPhoto">افزودن عکس </button>
            </div>

            <input
                type="file"
                id="productImageInput"
                name="product_image"
                accept="image/*"
                hidden
            >
        </div>

        <div class="row g-3">

            <!-- Product Name -->
            <div class="col-md-6">
                <label class="form-label fw-semibold">
                    عنوان محصول
                    
                </label>

                <input
                    type="text"
                    id="employeeName"
                    name="name"
                    class="form-control"
                    placeholder="عنوان محصول را وارد کنید"
                    value="${escapeHtml(info.name || '')}"
                >
            </div>

            <!-- Serial Number -->
            <div class="col-md-6">
                <label class="form-label fw-semibold">
                    کد محصول
                </label>

                <input
                    type="text"
                    name="serial_number"
                    id="serial_number"
                    class="form-control"
                    placeholder="کد محصول"
                    value="${escapeHtml(info.serial_number || '')}"
                >
            </div>

            <!-- Parent Ratio -->
            <div class="col-md-6 col-lg-3">
                <label class="form-label fw-semibold">
                    نسبت به محصول قبل
                </label>

                <input
                    type="number"
                    name="parent_unit_ratio"
                    id="parent_unit_ratio"
                    class="form-control"
                    min="0"
                    step="any"
                    value="${escapeHtml(info.parent_unit_ratio ?? '')}"
                >
            </div>

            <!-- Cost Price -->
            <div class="col-md-6 col-lg-3">
                <label class="form-label fw-semibold">
                    بهای تمام‌شده
                </label>

                <input
                    type="number"
                    name="cost_price"
                    id="cost_price"
                    class="form-control"
                    min="0"
                    step="any"
                    value="${escapeHtml(info.cost_price ?? '')}"
                >
            </div>

            <!-- Factory Price -->
            <div class="col-md-6 col-lg-3">
                <label class="form-label fw-semibold">
                    قیمت فروش کارخانه
                </label>

                <input
                    type="number"
                    name="sale_price"
                    id="sale_price"
                    class="form-control"
                    min="0"
                    step="any"
                    value="${escapeHtml(info.sale_price ?? '')}"
                >
            </div>

            <!-- Customer Price -->
            <div class="col-md-6 col-lg-3">
                <label class="form-label fw-semibold">
                    قیمت مصرف‌کننده
                </label>

                <input
                    type="number"
                    name="customer_price"
                    id="customer_price"
                    class="form-control"
                    min="0"
                    step="any"
                    value="${escapeHtml(info.customer_price ?? '')}"
                >
            </div>

            <div class="col-12">
                <hr class="my-2">
                <div class="fw-bold text-secondary mb-1">
                    دسته‌بندی و مشخصات محصول
                </div>
            </div>

            <!-- Group -->
            <div class="col-md-6 col-lg-4">
                <label class="form-label fw-semibold">
                    گروه محصول
                </label>

                <select
                    class="form-control select2"
                    name="group_id"
                    id="group_id"
                    style="width:100%;"
                >
                    ${GetGroups(info.group_id)}
                </select>
            </div>

            <!-- Grade -->
            <div class="col-md-6 col-lg-4">
                <label class="form-label fw-semibold">
                    درجه محصول
                </label>

                <select
                    class="form-control select2"
                    name="grades_id"
                    id="grades_id"
                    style="width:100%;"
                >
                    ${GetGrades(info.grades_id)}
                </select>
            </div>

            <!-- Brand -->
            <div class="col-md-6 col-lg-4">
                <label class="form-label fw-semibold">
                    برند محصول
                </label>

                <select
                    class="form-control select2"
                    name="brand_id"
                    id="brand_id"
                    style="width:100%;"
                >
                    ${GetBrands(info.brand_id)}
                </select>
            </div>

            <!-- Quality -->
            <div class="col-md-6">
                <label class="form-label fw-semibold">
                    کیفیت محصول
                </label>

                <select
                    class="form-control select2"
                    name="quality_id"
                    id="quality_id"
                    style="width:100%;"
                >
                    ${GetQuality(info.quality_id)}
                </select>
            </div>

            <!-- Unit -->
            <div class="col-md-6">
                <label class="form-label fw-semibold">
                    واحد محصول
                </label>

                <select
                    class="form-control select2"
                    name="unit_id"
                    id="unit_id"
                    style="width:100%;"
                >
                    ${GetUnits(info.unit_id)}
                </select>
            </div>

        </div>
    </div>
`,
            didOpen: () => {
                $("#appendPhoto").on('click',function () {
                    $("#photos").append(`<button
                        type="button"
                        class="btn p-0 border-0 bg-transparent ProductImage"
                        style="cursor:pointer;"
                    >
                        <img
                            class="productImagePreview"
                            src="${escapeHtml(info.imageURL || '/Storage/DefaultImages/Default.jpg')}"
                            alt="تصویر محصول"
                            style="
                        width:100px;
                        height:100px;
                        object-fit:cover;
                        border-radius:14px;
                        border:2px dashed #cbd5e1;
                        padding:5px;
                    "
                        >
                    </button>`)
                })
                const popup = Swal.getPopup();

                // Initialize Select2 inside SweetAlert
                $(popup).find('.select2').select2({
                    dropdownParent: $(popup),
                    width: '100%',
                    dir: 'rtl'
                });

                // Open image picker
                $(popup).find('#ProductImage').on('click', function () {
                    $(popup).find('#productImageInput').trigger('click');
                });

                // Preview selected image
                $(popup).find('#productImageInput').on('change', function () {
                    const file = this.files?.[0];

                    if (!file) return;

                    if (!file.type.startsWith('image/')) {
                        Swal.showValidationMessage('لطفاً یک فایل تصویری انتخاب کنید');
                        this.value = '';
                        return;
                    }

                    const reader = new FileReader();

                    reader.onload = function (event) {
                        $(popup)
                            .find('#productImagePreview')
                            .attr('src', event.target.result);
                    };

                    reader.readAsDataURL(file);
                });
            },


            showCancelButton: true,
            confirmButtonText: 'ذخیره اطلاعات',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#2563eb',

            preConfirm: () => {
                const name = $('#employeeName').val().trim();
                const title = $('#employeeTitle').val().trim();

                return {
                    //مواردی که پر شد اینجا برمیگرده
                };
            }
        }).then(result => {
            if (!result.isConfirmed) return;

            const {name, title, scores} = result.value;

            node.data = {
                ...node.data,
                nodeId: node.id,
                imageURL: avatarUrl(name),
                name,
                title,
                metrics: metricLabels.map((label, index) => ({
                    label,
                    value: scores[index]
                })),
                isNew: false
            };

            refreshTree();

            Swal.fire({
                icon: 'success',
                title: 'ذخیره شد',
                timer: 1000,
                showConfirmButton: false
            });
        });
    }

    function countDescendants(node) {
        return (node.children || []).reduce(
            (total, child) => total + 1 + countDescendants(child),
            0
        );
    }

    function deleteNode(nodeId) {
        if (String(nodeId) === String(data.id)) {
            Swal.fire({
                icon: 'warning',
                title: 'حذف غیرمجاز',
                text: 'گره اصلی سازمان قابل حذف نیست.'
            });
            return;
        }

        const node = findNode(data, nodeId);
        const parent = findParent(data, nodeId);

        if (!node || !parent) return;

        const descendants = countDescendants(node);

        Swal.fire({
            icon: 'warning',
            title: 'حذف محصول',
            html: `
                <div style="direction:rtl;">
                    آیا از حذف
                    <strong>${escapeHtml(node.data.name || 'محصول جدید')}</strong>
                    مطمئن هستید؟

                    ${
                descendants > 0
                    ? `<p style="color:#dc2626;">
                                تعداد ${descendants} زیرمجموعه نیز حذف خواهد شد.
                               </p>`
                    : ''
            }
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'بله، حذف شود',
            cancelButtonText: 'انصراف',
            confirmButtonColor: '#dc2626'
        }).then(result => {

            if (!result.isConfirmed) return;

            parent.children = parent.children.filter(
                child => String(child.id) !== String(nodeId)
            );

            refreshTree();

            Swal.fire({
                icon: 'success',
                title: 'حذف شد',
                timer: 1000,
                showConfirmButton: false
            });
        });
    }

    const options = {
        contentKey: 'data',
        width: '100%',
        viewPortWidth: 1200,
        viewPortHeight: 700,
        nodeWidth: 200,
        nodeHeight: 220,
        childrenSpacing: 60,
        siblingSpacing: 25,
        direction: 'top',
        edgeStyle: 'curved',
        borderRadius: '12px',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        nodeBGColor: '#ffffff',
        nodeShadow: '0 2px 8px rgba(0,0,0,0.08)',
        nodeShadowHover: '0 4px 16px rgba(0,0,0,0.13)',
        enableToolbar: true,
        enableExpandCollapse: true,

        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',

        nodeTemplate: (content) => {

            const nodeId = escapeHtml(content.nodeId);

            if (content.isNew) {
                return `
                    <div
                        class="employee-card new-employee"
                        data-node-id="${nodeId}"
                        style="
                            height:100%;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            flex-direction:column;
                            cursor:pointer;
                            background:#eff6ff;
                            border-radius:12px;
                            gap:8px;
                        "
                    >
                        <div style="font-size:40px;color:#2563eb;">+</div>

                        <div style="font-size:13px;font-weight:600;color:#2563eb;">
                            محصول جدید
                        </div>

                        <div style="font-size:10px;color:#64748b;">
                            برای ثبت اطلاعات کلیک کنید
                        </div>

                        <button
                            type="button"
                            class="delete-node-btn"
                            style="
                                margin-top:10px;
                                border:0;
                                background:#fee2e2;
                                color:#dc2626;
                                padding:5px 12px;
                                border-radius:6px;
                                cursor:pointer;
                            "
                        >
                            حذف
                        </button>
                    </div>
                `;
            }

            const metricsHtml = (content.metrics || [])
                .map(m => {

                    const value = Math.max(
                        0,
                        Math.min(100, Number(m.value) || 0)
                    );

                    const color =
                        value >= 90 ? '#4caf50' :
                            value >= 80 ? '#8bc34a' :
                                value >= 70 ? '#ffc107' :
                                    '#ff9800';

                    return `
                        <div style="
                            display:flex;
                            align-items:center;
                            gap:6px;
                            margin-bottom:4px;
                        ">
                            <span style="
                                font-size:9px;
                                color:#555;
                                width:84px;
                                flex-shrink:0;
                                white-space:nowrap;
                                overflow:hidden;
                                text-overflow:ellipsis;
                            ">
                                • ${escapeHtml(m.label)}
                            </span>

                            <div style="
                                flex:1;
                                height:5px;
                                background:#e8e8e8;
                                border-radius:3px;
                                overflow:hidden;
                            ">
                                <div style="
                                    width:${value}%;
                                    height:100%;
                                    background:${color};
                                    border-radius:3px;
                                "></div>
                            </div>
                        </div>
                    `;
                }).join('');

            return `
                <div
                    class="employee-card"
                    data-node-id="${nodeId}"
                    style="
                        display:flex;
                        flex-direction:column;
                        align-items:center;
                        height:100%;
                        padding:12px 10px 10px;
                        text-align:center;
                        position:relative;
                        box-sizing:border-box;
                    "
                >

                    <img
                        src="${escapeHtml(content.imageURL || avatarUrl(content.name))}"
                        alt=""
                        style="
                            width:56px;
                            height:56px;
                            border-radius:50%;
                            object-fit:cover;
                            border:3px solid #e8e8e8;
                            margin-bottom:6px;
                        "
                    >

                    <div style="
                        font-weight:700;
                        font-size:12px;
                        line-height:1.3;
                        color:#1a1a2e;
                        margin-bottom:3px;
                    ">
                        ${escapeHtml(content.name)}
                    </div>

                    <div style="
                        font-size:10px;
                        color:#666;
                        margin-bottom:8px;
                    ">
                        ${escapeHtml(content.title)}
                    </div>

                    <div style="width:100%;padding:0 2px;">
                        ${metricsHtml}
                    </div>

                    <div style="
                        position:absolute;
                        bottom:8px;
                        left:8px;
                        right:8px;
                        display:flex;
                        justify-content:center;
                        gap:5px;
                    ">

                        <button
                            type="button"
                            class="add-child-btn"
                            style="
                                border:0;
                                background:#2563eb;
                                color:white;
                                padding:5px 9px;
                                border-radius:5px;
                                cursor:pointer;
                                font-size:11px;
                            "
                        >
                            + Add
                        </button>

                        <button
                            type="button"
                            class="edit-node-btn"
                            style="
                                border:0;
                                background:#e2e8f0;
                                color:#334155;
                                padding:5px 9px;
                                border-radius:5px;
                                cursor:pointer;
                                font-size:11px;
                            "
                        >
                            Edit
                        </button>

                        ${
                String(content.nodeId) !== String(data.id)
                    ? `
                                    <button
                                        type="button"
                                        class="delete-node-btn"
                                        style="
                                            border:0;
                                            background:#fee2e2;
                                            color:#dc2626;
                                            padding:5px 9px;
                                            border-radius:5px;
                                            cursor:pointer;
                                            font-size:11px;
                                        "
                                    >
                                        Delete
                                    </button>
                                `
                    : ''
            }

                    </div>

                </div>
            `;
        }
    };

    tree = new ApexTree(container, options);

    refreshTree();

    // Add child
    $('#svg-tree').on('click', '.add-child-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const nodeId = $(this)
            .closest('[data-node-id]')
            .attr('data-node-id');

        addChild(nodeId);
    });

    // Edit employee
    $('#svg-tree').on('click', '.edit-node-btn, .new-employee', function (e) {
        if ($(e.target).closest('.delete-node-btn').length) return;

        e.preventDefault();
        e.stopPropagation();

        const nodeId = $(this)
            .closest('[data-node-id]')
            .attr('data-node-id');

        editNode(nodeId);
    });

    // Delete employee
    $('#svg-tree').on('click', '.delete-node-btn', function (e) {
        e.preventDefault();
        e.stopPropagation();

        const nodeId = $(this)
            .closest('[data-node-id]')
            .attr('data-node-id');

        deleteNode(nodeId);
    });

});
