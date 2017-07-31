(function() {
    'use strict';

    $(function() {
        var $canvasList = $('.js-sector-canvas');
        var sectorCanvasInstances = [];

        if ($canvasList.length) {
            $canvasList.each(function() {
                var $el = $(this),
                    config = $el.data('config'),
                    canvasID = $el.attr('id');

                sectorCanvasInstances[canvasID] = new SectorCanvasEditor($el.get(0), config ? JSON.parse(config) : {});
            });
        }
    });
})(jQuery);
