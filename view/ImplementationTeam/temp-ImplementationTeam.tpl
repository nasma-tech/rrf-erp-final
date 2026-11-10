{include 'sections/header.tpl'}
{include 'sections/top-bar.tpl'}
{include 'sections/side-menu.tpl'}

<style>
    :modal {
        padding: 2rem;
        border-radius: 0.25rem;
        border-width: 0;
        box-shadow: 0 0 #0000,
        0 0 #0000,
        0 1px 3px 0 rgb(0 0 0 / 0.1);
    }

    #hidden {
        font: 500 0px Inter;
        opacity: 0;
    }

    .sample-layout {
        display: flex;
        gap: 1em;
        align-items: flex-start;
    }

    #myDiagramDiv {
        flex: 1;
        min-width: 0;
        height: 625px;
        border: solid 1px black;
    }

    .sample-controls {
        flex: none;
        width: 280px;
    }

    #inspectorContainer {
        margin-top: 2em;
    }

    /* On narrow screens, stack the controls below the diagram */
    @media (max-width: 1024px) {
        .sample-layout {
            flex-direction: column;
            align-items: stretch;
        }

        #myDiagramDiv {
            flex: none;
            width: 100%;
        }

        .sample-controls {
            width: 100%;
        }

        #inspectorContainer {
            margin-top: 1em;
        }
    }
</style>

<div class="app-content content">
    <div class="content-wrapper">
        {$helper->formCallBack()}
        <div class="row">
            <div class="col-md-10" dir="ltr">
                <div id="myDiagramDiv"></div>
            </div>
            <div class="col-2">
                <div class="sample-layout">
                    <div class="sample-controls">
                        <div style="display: inline;">
                            <div style="margin-block: .5em;">
                                <button id="zoomToFit">Zoom to Fit</button>
                                <button id="centerRoot">Center on root</button>
                            </div>
                        </div>
                        <div id="inspectorContainer">
                            Edit details:<br>
                            <div id="myInspector" style="margin-block: .5em"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <div style="margin-block: .5em;">
                        <button id="SaveButton" onclick="save()">Save</button>
                        <button onclick="load()">Load</button>
                        Diagram Model saved in JSON format:
                    </div>
                    <textarea id="mySavedModel" style="width: 100%; height: 270px">{$data}</textarea>
                </div>
                <dialog>
                    <div style="display: flex; flex-direction: column">
                        <p></p>
                        <p>Click anywhere to close</p>
                    </div>
                </dialog>
            </div>
        </div>
    </div>
</div>

<script src="/public/vendors/js/charts/goinit.js"></script>


{include 'sections/footer.tpl'}