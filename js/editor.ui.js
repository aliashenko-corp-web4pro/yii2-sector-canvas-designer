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

                if (c.getActiveObject() || c.getActiveGroup()) {
                    if (c.getActiveGroup()){
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
            }
        });

        $(document).on('change', '.js-seat-status', function() {
            var id = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
            var status = $(this).val();

            if (id) {
                var c = sectorCanvasInstances[id].fabricCanvas;

                if (c.getActiveObject() || c.getActiveGroup()) {
                    if (c.getActiveGroup()){
                        c.getActiveGroup().forEachObject(function(o){
                            var objects = o.getObjects();
                            sectorCanvasInstances[id].changeSeatStatus(objects[0], status);
                        });
                        // c.discardActiveGroup().renderAll();
                    } else {
                        var objects = c.getActiveObject().getObjects();
                        sectorCanvasInstances[id].changeSeatStatus(objects[0], status);
                    }
                }
            }
        });

        if ($canvasList.length) {
            $('.js-delete-objects').click(function() {
                var id = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');

                if (id) {
                    var c = sectorCanvasInstances[id].fabricCanvas;
                    if(c.getActiveGroup()){
                        c.getActiveGroup().forEachObject(function(o){
                            if (typeof o.key != 'undefined') {
                                sectorCanvasInstances[id].config.hallSeats.splice(o.key, 1);
                            }
                            c.remove(o)
                        });
                        c.discardActiveGroup().renderAll();
                    } else {
                        if (typeof c.getActiveObject().key != 'undefined') {
                            sectorCanvasInstances[id].config.hallSeats.splice(c.getActiveObject().key, 1);
                        }
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

                config = Object.assign(config, savedConfig);

                sectorCanvasInstances[canvasID] = new SectorCanvasEditor($el.get(0), config);

                var instance = sectorCanvasInstances[canvasID].fabricCanvas;
                var data = $(this).closest('.sector-canvas-wrap').find('.js-canvas-data').val();

                sectorCanvasInstances[canvasID].renderAll();

                instance.on({
                    'object:moving': function(e) {
                        if (typeof e.target.key != 'undefined') {
                            sectorCanvasInstances[canvasID].config.hallSeats[e.target.key].position_left = e.target.left;
                            sectorCanvasInstances[canvasID].config.hallSeats[e.target.key].position_top = e.target.top;
                        }
                    }
                })

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

                    $('.js-fontSize').change(function() {
                        var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                        var instance = sectorCanvasInstances[canvasID];
                        var c = instance.fabricCanvas;

                        if (c.getActiveObject()) {
                            c.getActiveObject().set('fontSize', $(this).val());
                        }
                    });

                    $('.js-fontColor').change(function() {
                        var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                        var instance = sectorCanvasInstances[canvasID];
                        var c = instance.fabricCanvas;

                        if (c.getActiveObject()) {
                            c.getActiveObject().set('fill', $(this).val());
                        }
                    });

                    $('.js-fontType').change(function() {
                        var canvasID = $(this).closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                        var instance = sectorCanvasInstances[canvasID];
                        var c = instance.fabricCanvas;

                        if (c.getActiveObject()) {
                            c.getActiveObject().set('fontFamily', $(this).val());
                        }
                    });

                    $('.js-sector-canvas-file').on('change', function (e) {
                        var $el = $(this);
                        var file = e.target.files[0];
                        var reader = new FileReader();
                        var $el = $(this);
                        reader.onload = function (f) {
                            var data = f.target.result;

                            fabric.Image.fromURL(data, function (img) {
                                var oImg = img.set({left: 0, top: 0}).scale(0.2);

                                var canvasID = $el.closest('.sector-canvas-wrap').find('.js-sector-canvas').attr('id');
                                var instance = sectorCanvasInstances[canvasID];
                                var c = instance.fabricCanvas;
                                c.add(oImg);
                            });
                        };
                        reader.readAsDataURL(file);
                    });

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

                        if (typeof e.target.text != 'undefined') {
                            $('.js-manage-text--wrap').show();
                        } else {
                            $('.js-manage-text--wrap').hide();
                        }
                    })
                    .on('group:selected', function(e) {
                        $('.js-delete-objects, .js-manage-seats--wrap').show();
                    })
                    .on('selection:cleared', function(e) {
                        $('.js-delete-objects, .js-manage-seats--wrap').hide();
                        $('.js-delete-objects, .js-manage-text--wrap').hide();
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
                            var seatStatus = $form.find('.js-seat-status').val();

                            if (!seatsNumberAlreadySet) {
                                instance.config.numberSeatsFrom = fromNumber;
                                seatsNumberAlreadySet = !seatsNumberAlreadySet;
                            }

                            for (var i = 0; i < rowsNum; i++) {
                                instance.addRow(seatsNum, seatStatus, seatType);
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
                            var label = $(this).data('label');
                            var tempLabel = $(this).html();

                            console.log(label, tempLabel)
                            $(this).html(label);
                            $(this).data('label', tempLabel);

                            if (instance.fabricCanvas.isDrawingMode) {
                                $('.js-canvas-drawing').show();
                            }
                            else {
                                $('.js-canvas-drawing').hide();
                            }
                            break;

                        case 'add-text':
                            instance.fabricCanvas.add(new fabric.IText('Tap and Type', {
                                left: 10,
                                top: 10,
                                fontFamily: 'arial black',
                                fill: '#333',
                                fontSize: 14
                            }));
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
                                if (typeof activeObject.key != 'undefined') {
                                    sectorCanvasInstances[i].config.hallSeats.splice(activeObject.key, 1);
                                }
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
