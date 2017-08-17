(function() {
    'use strict';

    $(function() {
        var seatsNumberAlreadySet = false;

        var $canvasList = $('.js-sector-canvas');
        var sectorCanvasInstances = [];

        fabric.Object.prototype.transparentCorners = false;

        $('.sector-canvas-wrap').closest('form').on('submit', function() {
            var id = $(this).find(' .js-sector-canvas').attr('id');
            var instance = sectorCanvasInstances[id];
            $(this).find('.js-sector-seats-json').val(JSON.stringify(instance.toJSON()));

            console.log(instance.config)

            $('.js-canvas-data', $(this).find('.sector-canvas-wrap')).val(JSON.stringify(instance.config));

            return true;
        });

        $(document).on('change', '.js-color-seat', function() {
            var id = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
            var color = $(this).val();

            if (id) {
                var c = sectorCanvasInstances[id].fabricCanvas;
                if(c.getActiveGroup()){
                    c.getActiveGroup().forEachObject(function(o){
                        var objects = o.getObjects();
                        objects[0].set('fill', color);

                        objects[0].group.my.config.type = sectorCanvasInstances[id].getTypeByColor(color);
                        objects[0].group.my.config.color = color;
                    });
                    // c.discardActiveGroup().renderAll();
                } else {
                    var objects = c.getActiveObject().getObjects();
                    objects[0].set('fill', color);

                    objects[0].group.my.config.type = sectorCanvasInstances[id].getTypeByColor(color);
                    objects[0].group.my.config.color = color;
                }
            }
        });

        $(document).on('change', '.js-seat-type', function() {
            var id = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
            var type = $(this).val();

            if (id) {
                var c = sectorCanvasInstances[id].fabricCanvas;
                if(c.getActiveGroup()){
                    c.getActiveGroup().forEachObject(function(o){
                        var objects = o.getObjects();
                        sectorCanvasInstances[id].changeSeatType(objects[0], type);
                    });
                    // c.discardActiveGroup().renderAll();
                } else {
                    var objects = c.getActiveObject().getObjects();
                    sectorCanvasInstances[id].changeSeatType(objects[0], type);
                }
            }
        });

        if ($canvasList.length) {
            $('.js-delete-objects').click(function() {
                var id = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');

                if (id) {
                    var c = sectorCanvasInstances[id].fabricCanvas;
                    if(c.getActiveGroup()){
                        c.getActiveGroup().forEachObject(function(o){ c.remove(o) });
                        c.discardActiveGroup().renderAll();
                    } else {
                        c.remove(c.getActiveObject());
                    }
                }
            });

            $('.js-line-width').change(function() {
                var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                var instance = sectorCanvasInstances[canvasID];
                var c = instance.fabricCanvas;
                c.freeDrawingBrush.width = parseInt($(this).closest('.sector-canvas-wrap').find('.js-line-width').val(), 10) || 1;
            });

            $canvasList.each(function() {
                var $el = $(this),
                    config = $el.data('config'),
                    canvasID = $el.attr('id'),
                    actionBtn = $('.sector-canvas-wrap [data-action]');

                var val = $(this).closest('.sector-canvas-wrap').find('.js-canvas-data').val();

                var savedConfig = val ? JSON.parse(val) : null;
                config = savedConfig ? savedConfig : config;

                sectorCanvasInstances[canvasID] = new SectorCanvasEditor($el.get(0), config);

                var instance = sectorCanvasInstances[canvasID].fabricCanvas;
                var data = $(this).closest('.sector-canvas-wrap').find('.js-canvas-data').val();

                sectorCanvasInstances[canvasID].renderAll();
                // instance.loadFromJSON(JSON.parse(data), function() {
                //     instance.renderAll();
                // })

                window.sectorCanvasInstances = sectorCanvasInstances;

                if (fabric.PatternBrush) {
                    var vLinePatternBrush = new fabric.PatternBrush(instance);
                    vLinePatternBrush.getPatternSrc = function() {

                        var patternCanvas = fabric.document.createElement('canvas');
                        patternCanvas.width = patternCanvas.height = 10;
                        var ctx = patternCanvas.getContext('2d');

                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(0, 5);
                        ctx.lineTo(10, 5);
                        ctx.closePath();
                        ctx.stroke();

                        return patternCanvas;
                    };

                    var hLinePatternBrush = new fabric.PatternBrush(instance);
                    hLinePatternBrush.getPatternSrc = function() {

                        var patternCanvas = fabric.document.createElement('canvas');
                        patternCanvas.width = patternCanvas.height = 10;
                        var ctx = patternCanvas.getContext('2d');

                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = 5;
                        ctx.beginPath();
                        ctx.moveTo(5, 0);
                        ctx.lineTo(5, 10);
                        ctx.closePath();
                        ctx.stroke();

                        return patternCanvas;
                    };

                    var squarePatternBrush = new fabric.PatternBrush(instance);
                    squarePatternBrush.getPatternSrc = function() {

                        var squareWidth = 10, squareDistance = 2;

                        var patternCanvas = fabric.document.createElement('canvas');
                        patternCanvas.width = patternCanvas.height = squareWidth + squareDistance;
                        var ctx = patternCanvas.getContext('2d');

                        ctx.fillStyle = this.color;
                        ctx.fillRect(0, 0, squareWidth, squareWidth);

                        return patternCanvas;
                    };

                    var diamondPatternBrush = new fabric.PatternBrush(instance);
                    diamondPatternBrush.getPatternSrc = function() {

                        var squareWidth = 10, squareDistance = 5;
                        var patternCanvas = fabric.document.createElement('canvas');
                        var rect = new fabric.Rect({
                            width: squareWidth,
                            height: squareWidth,
                            angle: 45,
                            fill: this.color
                        });

                        var canvasWidth = rect.getBoundingRectWidth();

                        patternCanvas.width = patternCanvas.height = canvasWidth + squareDistance;
                        rect.set({ left: canvasWidth / 2, top: canvasWidth / 2 });

                        var ctx = patternCanvas.getContext('2d');
                        rect.render(ctx);

                        return patternCanvas;
                    };

                    $('.js-drawing-mode').change(function() {
                        var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                        var instance = sectorCanvasInstances[canvasID];
                        var c = instance.fabricCanvas;

                        if (this.value === 'hline') {
                            c.freeDrawingBrush = vLinePatternBrush;
                        }
                        else if (this.value === 'vline') {
                            c.freeDrawingBrush = hLinePatternBrush;
                        }
                        else if (this.value === 'square') {
                            c.freeDrawingBrush = squarePatternBrush;
                        }
                        else if (this.value === 'diamond') {
                            c.freeDrawingBrush = diamondPatternBrush;
                        }
                        else {
                            c.freeDrawingBrush = new fabric[this.value + 'Brush'](c);
                        }

                        var $parent = $(this).closest('div');

                        if (c.freeDrawingBrush) {
                            c.freeDrawingBrush.color = $parent.find('.js-drawing-color').val();
                            c.freeDrawingBrush.width = parseInt($parent.find('.js-line-width').val(), 10) || 1;
                            c.freeDrawingBrush.shadow = new fabric.Shadow({
                                blur: parseInt($parent.find('.js-shadow-width').val(), 10) || 0,
                                offsetX: 0,
                                offsetY: 0,
                                affectStroke: true,
                                color: $parent.find('.js-shadow-color').val()
                            });
                        }
                    });
                }

                sectorCanvasInstances[canvasID].fabricCanvas
                    .on('object:selected', function(e) {
                        $('.js-delete-objects, .js-manage-seats--wrap').show();
                    })
                    .on('group:selected', function(e) {
                        $('.js-delete-objects, .js-manage-seats--wrap').show();
                    })
                    .on('selection:cleared', function(e) {
                        $('.js-delete-objects, .js-manage-seats--wrap').hide();
                    });

                actionBtn.click(function() {
                    var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                    var instance = sectorCanvasInstances[canvasID];
                    var action = $(this).data('action');

                    var $form = $(this).closest('form');

                    switch(action) {
                        case 'add-row':
                            var seatsNum = $form.find('.js-seats-num-per-row').val();
                            var rowsNum = $form.find('.js-row-num').val();
                            var fromNumber = $form.find('.js-start-num').val();
                            var seatType = $form.find('.js-seat-type').val();

                            if (!seatsNumberAlreadySet) {
                                instance.config.numberSeatsFrom = fromNumber;
                                seatsNumberAlreadySet = !seatsNumberAlreadySet;
                            }

                            instance.config.seatType = seatType ? seatType : 0;
                            console.dir(instance.config.seatType)

                            for (var i = 0; i < rowsNum; i++) {
                                instance.addRow(seatsNum);
                            }
                            break;

                        case 'canvas-change':
                            instance.setCanvasWidth($form.find('.js-canvas-width').val());
                            instance.setCanvasHeight($form.find('.js-canvas-height').val());
                            instance.setCanvasBackgroundColor($form.find('.js-canvas-color').val());
                            instance.renderAll();
                            break;

                        case 'clear-canvas':
                            instance.clearCanvas();
                            break;

                        case 'drawing-switch':
                            instance.fabricCanvas.isDrawingMode = !instance.fabricCanvas.isDrawingMode;

                            if (instance.fabricCanvas.isDrawingMode) {
                                $('.js-canvas-drawing').show();
                            }
                            else {
                                $('.js-canvas-drawing').hide();
                            }
                            break;
                    }
                });
            });

            $(document).keyup(function(e){
                if (e.keyCode === 46) {
                    if (sectorCanvasInstances) {
                        for (var i in sectorCanvasInstances) {
                            var instance = sectorCanvasInstances[i].fabricCanvas;
                            var activeObject = instance.getActiveObject();
                            if (activeObject) {
                                instance.remove(activeObject);
                            }
                        }
                    }
                }
            });
        }

        $('.js-drawing-color').change(function() {
            var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
            var instance = sectorCanvasInstances[canvasID];
            var c = instance.fabricCanvas;
            c.freeDrawingBrush.color = $(this).val();
        });
    });
})(jQuery);
