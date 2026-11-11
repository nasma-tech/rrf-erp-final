
$(function () {

    const data = {
        id: 'root',
        data: {
            name: 'Company',
            title: 'Root',
            subtitle: 'Organization',
        },
        children: [],
        hasChildren: true,
    };

    let tree;
    let graph;

    // Fake backend
    function fakeFetch(id) {
        return [
            {
                id: `${id}-1`,
                data: {
                    name: 'New Department',
                    title: 'Department',
                    subtitle: 'Organization',
                },
                children: [],
                hasChildren: false,
            },
            {
                id: `${id}-2`,
                data: {
                    name: 'New Team',
                    title: 'Team',
                    subtitle: 'Organization',
                },
                children: [],
                hasChildren: false,
            },
        ];
    }

    function render(mode = 'single') {

        $('#svg-tree').empty();

        tree = new ApexTree(
            document.getElementById('svg-tree'),
            {
                contentKey: 'data',

                width: '100%',
                viewPortWidth: 1000,
                viewPortHeight: 600,

                nodeWidth: 260,
                nodeHeight: 78,

                childrenSpacing: 70,
                siblingSpacing: 40,

                direction: 'top',
                edgeStyle: 'curved',

                enableToolbar: true,
                enableSearch: true,
                enableBreadcrumb: true,
                enableSelection: mode,

                loadChildren: ({ id, name }) => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(fakeFetch(id));
                        }, 500);
                    });
                },
            }
        );

        graph = tree.render(data);

        graph.onSelectionChange((ids) => {
            $('#selection-readout').text(
                ids.length
                    ? `Selected: ${ids.join(', ')}`
                    : 'Selected: (none)'
            );
        });
    }

    // Selection mode
    $('input[name="mode"]').on('change', function () {
        render(this.value);
    });

    // Append new node
    $('#append').on('click', function () {
        const newNode = {
            id: `node-${Date.now()}`,
            data: {
                name: 'New Node',
                title: 'Department',
                subtitle: 'Organization',
            },
            children: [],
            hasChildren: false,
        };

        data.children.push(newNode);

        render($('input[name="mode"]:checked').val());
    });

    // Clear selection
    $('#clear').on('click', function () {
        graph.clearSelection();
    });

    render();

});
