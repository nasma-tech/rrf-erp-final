$(function () {

    $("#parent_id").on('input', function () {
        let $element = $(this)
        let selectedOption = $element.find('option:selected')
        let $parentUnitRatio = $("#parent_unit_ratio")
        let $parentUnitRatioElement = $("#parent_unit_ratio_element")
        let $parentUnitRatioLabel = $("#parent_unit_ratio_label")

        if ($element.val()) {
            $parentUnitRatio.val("")
                .prop('required', true)
            $parentUnitRatioElement.show()
            $parentUnitRatioLabel.html(selectedOption.data('unit-label'))
        } else {
            $parentUnitRatio.val("")
                .prop('required', false)
            $parentUnitRatioElement.hide()
            $parentUnitRatioLabel.html('')
        }
    })
    $("#cost_price").priceInput()
    $("#sale_price").priceInput()
    $("#customer_price").priceInput()
    $('#parent_unit_ratio').numberInputAndDecimal()

    $("#description").joditEditor()
    $("#complete_description").joditEditor()

    //gallery

    const $form = $('#mainForm');
    const $imageInput = $('#imageInput');
    const $gallery = $('#imageGallery');
    const $removeButton = $('#removeCurrentImage');

    if (!$form.length || !$imageInput.length || !$gallery.length || !$removeButton.length) {
        console.error('عناصر گالری پیدا نشدند.');
        return;
    }

    const images = [];

    const splide = new Splide($gallery[0], {
        type: 'slide',
        perPage: 3,
        perMove: 1,
        arrows: true,
        pagination: true,
        drag: true,
        gap: '1rem',
        direction: 'rtl',
        breakpoints: {
            768: {perPage: 2},
            480: {perPage: 1}
        }
    });

    const updateRemoveButton = () => {
        $removeButton.prop('disabled', images.length === 0);
    };

    $('#addImageButton').on('click', function () {
        $imageInput.trigger('click');
    });

    $imageInput.on('change', function () {
        const files = Array.from(this.files);

        $.each(files, function (_, file) {
            if (!file.type.startsWith('image/')) return;

            const url = URL.createObjectURL(file);

            const $slide = $('<li>', {
                class: 'splide__slide'
            });

            const $container = $('<div>', {
                class: 'border rounded p-2'
            });

            const $preview = $('<img>', {
                src: url,
                alt: file.name
            }).css({
                display: 'block',
                width: '100%',
                height: '200px',
                objectFit: 'contain'
            });

            const $name = $('<div>', {
                class: 'text-center mt-2 text-truncate',
                text: file.name
            });

            $container.append($preview, $name);
            $slide.append($container);

            images.push({file, url});
            splide.add($slide[0]);
        });

        $(this).val('');

        updateRemoveButton();

        if (images.length) {
            splide.go(images.length - 1);
        }
    });

    $removeButton.on('click', function () {
        const index = splide.index;

        if (index < 0 || index >= images.length) return;

        const [image] = images.splice(index, 1);

        splide.remove(index);
        URL.revokeObjectURL(image.url);

        updateRemoveButton();

        if (images.length) {
            splide.go(Math.min(index, images.length - 1));
        }
    });

    $form.on('submit', function () {
        const dataTransfer = new DataTransfer();

        $.each(images, function (_, image) {
            dataTransfer.items.add(image.file);
        });

        $imageInput[0].files = dataTransfer.files;
    });

    splide.mount();
    updateRemoveButton();
});

$(function () {
    const $container = $('#productChildrenContainer');
    const $template = $('#productChildTemplate');
    const $addButton = $('#addProductChildButton');
    const $form = $('#mainForm');

    if (!$container.length || !$template.length || !$addButton.length || !$form.length) {
        return;
    }

    const $parentUnitLabel = $('#measurement_unit_id option:selected');

    const normalizeNumber = (value) => {

        const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
        const arabicDigits = '٠١٢٣٤٥٦٧٨٩';

        value = String(value ?? '');

        value = value.replace(/[۰-۹]/g, digit =>
            persianDigits.indexOf(digit)
        );

        value = value.replace(/[٠-٩]/g, digit =>
            arabicDigits.indexOf(digit)
        );

        value = value
            .replace(/[٬,]/g, '')
            .replace(/٫/g, '.')
            .replace(/\s/g, '')
            .replace(/[^0-9.-]/g, '');

        const number = parseFloat(value);

        return Number.isFinite(number) ? number : 0;
    };

    const formatPrice = (value) => {

        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 2
        }).format(value);
    };

    const getProductPrices = () => {

        return {
            cost_price: normalizeNumber($('#cost_price').val()),
            sale_price: normalizeNumber($('#sale_price').val()),
            customer_price: normalizeNumber($('#customer_price').val())
        };
    };

    const updateChildPrices = ($row) => {

        const ratio = normalizeNumber(
            $row.find('[data-child-field="convert_ratio"]').val()
        );

        const prices = getProductPrices();

        const validRatio = ratio > 0;

        $row.find('.child-cost-price').val(
            validRatio ? formatPrice(prices.cost_price * ratio) : ''
        );

        $row.find('.child-sale-price').val(
            validRatio ? formatPrice(prices.sale_price * ratio) : ''
        );

        $row.find('.child-customer-price').val(
            validRatio ? formatPrice(prices.customer_price * ratio) : ''
        );
    };

    const updateAllChildPrices = () => {

        $container.find('.product-child-item').each(function () {
            updateChildPrices($(this));
        });
    };

    const updateChildNames = () => {

        $container.find('.product-child-item').each(function (index) {

            const $row = $(this);

            $row.find('[data-child-field]').each(function () {

                const $element = $(this);
                const field = $element.data('child-field');

                $element.attr(
                    'name',
                    `product_children[${index}][${field}]`
                );
            });

            $row.find('.product-child-title').text(
                `بسته‌بندی شماره ${index + 1}`
            );
        });
    };

    const updateParentUnitLabels = () => {

        const label = $('#measurement_unit_id option:selected').text();

        $container.find('.parent-unit-label').text(
            label && $('#measurement_unit_id').val()
                ? label
                : 'واحد محصول'
        );
    };

    const addChild = () => {

        const templateContent = $template[0].content.cloneNode(true);

        const $row = $(templateContent).find('.product-child-item');

        const checkboxId = `product_child_saleable_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        $row.find('[data-child-field="saleable"]')
            .attr('id', checkboxId);

        $row.find('.custom-control-label')
            .attr('for', checkboxId);

        $row.find('.parent-unit-label').text(
            $('#measurement_unit_id').val()
                ? $('#measurement_unit_id option:selected').text()
                : 'واحد محصول'
        );

        $container.append($row);

        const $unit = $row.find('[data-child-field="unit_id"]');

        if ($.fn.select2 && !$unit.hasClass('select2-hidden-accessible')) {
            $unit.select2();
        }

        const $ratio = $row.find('.product-child-ratio');
        $ratio.numberInputAndDecimal();
        $row.find('.child-cost-price, .child-sale-price, .child-customer-price').each(function () {
            $(this).numberInputAndDecimal();
        });
        updateChildNames();
        updateChildPrices($row);
    };

    $addButton.on('click', function () {
        addChild();
    });

    $container.on('click', '.remove-product-child', function () {

        const $row = $(this).closest('.product-child-item');

        $row.find('[data-child-field="unit_id"]').each(function () {

            if ($(this).hasClass('select2-hidden-accessible')) {
                $(this).select2('destroy');
            }

        });

        $row.remove();

        updateChildNames();
    });

    $container.on(
        'input change',
        '[data-child-field="convert_ratio"]',
        function () {

            const $input = $(this);

            this.setCustomValidity('');

            updateChildPrices($input.closest('.product-child-item'));
        }
    );

    $('#cost_price, #sale_price, #customer_price').on(
        'input change',
        updateAllChildPrices
    );

    $('#measurement_unit_id').on('change', function () {
        updateParentUnitLabels();
    });

    $form.on('submit', function (event) {

        let isValid = true;

        $container.find('.product-child-item').each(function () {

            const $row = $(this);

            const $label = $row.find('[data-child-field="label"]');
            const $unit = $row.find('[data-child-field="unit_id"]');
            const $ratio = $row.find('[data-child-field="convert_ratio"]');

            const ratio = normalizeNumber($ratio.val());

            $ratio[0].setCustomValidity('');

            if (!$label.val().trim()) {
                isValid = false;
                $label[0].reportValidity();
                return false;
            }

            if (!$unit.val()) {
                isValid = false;
                $unit[0].reportValidity();
                return false;
            }

            if (ratio <= 0) {

                $ratio[0].setCustomValidity(
                    'نرخ تبدیل باید عددی بزرگ‌تر از صفر باشد.'
                );

                isValid = false;
                $ratio[0].reportValidity();

                return false;
            }

        });

        if (!isValid) {
            event.preventDefault();
            return false;
        }

    });

    updateParentUnitLabels();

});