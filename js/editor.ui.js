(function() {
    'use strict';

    $(function() {
        var $canvasList = $('.js-sector-canvas');
        var sectorCanvasInstances = [];

        if ($canvasList.length) {
            $canvasList.each(function() {
                var $el = $(this),
                    config = $el.data('config'),
                    canvasID = $el.attr('id'),
                    actionBtn = $('.sector-canvas-wrap [data-action]');

                sectorCanvasInstances[canvasID] = new SectorCanvasEditor($el.get(0), config ? JSON.parse(config) : {});

                actionBtn.click(function() {
                    var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                    var instance = sectorCanvasInstances[canvasID];
                    var action = $(this).data('action');

                    var $form = $(this).closest('form');

                    switch(action) {
                        case 'add-row':
                            var seatsNum = $form.find('#sectorcanvasform-numseatsperrow').val();
                            instance.addRow(seatsNum);
                            break;

                        case 'canvas-change':
                            instance.setCanvasWidth($form.find('.js-canvas-width').val());
                            instance.setCanvasHeight($form.find('.js-canvas-height').val());
                            instance.setCanvasBackgroundColor($form.find('.js-canvas-color').val());
                            instance.renderAll();
                            break;
                    }
                });
            });
        }
    });
})(jQuery);
