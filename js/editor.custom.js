(function() {
    'use strict';

    /**
     *
     * Constructor for SectorCanvasEditor class.
     *
     * @param canvasElement
     * @param config
     * @constructor
     */
    function SectorCanvasEditor(canvasElement, config) {
        this.canvas = canvasElement;

        config = typeof config === 'object' ? config : {};

        this.defaultConfig = {
            canvasWidth: 500,
            canvasHeight: 500,
            canvasBackgroundColor: '#fff',
            numberSeatsFrom: 1,
            seatColors: {'available': '#02c103', 'busy': '#c53c00', 'booked': '#fbeb00', 'reserved': '#1b1da3', 'special': '#8b00ff'},
            seatTypes: [
                {
                    description: 'big 30x30',
                    width: 30,
                    height: 30,
                }
            ],
            seatType: 0,
            seatDefaultColor: '#02c103',
            seatMarginTop: 5,
            seatMarginLeft: 5,
            fontSize: 14,
            fontFamily: 'Helvetica',
            fontColor: '#000',
            hallSeats: [],
        };
        
        this.config = Object.assign(this.defaultConfig, config);

        this.initFabric();
    }

    /**
     * Change seat type.
     *
     * @param object
     * @param seatType
     */
    SectorCanvasEditor.prototype.changeSeatType = function(object, seatType) {
        var type = this.config.seatTypes[seatType];
        object.set('width', parseFloat(type.width));
        object.set('height', parseFloat(type.width));
        object.group.my.config.seatType = seatType;
        object.group.my.config.description = this.config.seatTypes[seatType].description;
    }

    /**
     * Init fabric js.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.initFabric = function() {
        this.fabricCanvas = new fabric.Canvas(this.canvas, {
            width: this.config.canvasWidth,
            height: this.config.canvasHeight,
            backgroundColor: this.config.canvasBackgroundColor
        });

        console.log('init fabric')
    };

    /**
     * Add seat to the row using color (hex) and row number
     *
     * @param config
     */
    SectorCanvasEditor.prototype.addSeat = function(config) {
        this.config.hallSeats[config.row].push(config);
    };

    SectorCanvasEditor.prototype.setCanvasWidth = function(width) {
        this.fabricCanvas.setWidth(width);
        this.config.canvasWidth = width;
        this.renderAll();
    };

    SectorCanvasEditor.prototype.setCanvasHeight = function(height) {
        this.fabricCanvas.setHeight(height);
        this.config.canvasHeight = height;
        this.renderAll();
    };

    SectorCanvasEditor.prototype.setCanvasBackgroundColor = function(color) {
        this.fabricCanvas.setBackgroundColor(color);
        this.config.canvasBackgroundColor = color;
        this.renderAll();
    };

    SectorCanvasEditor.prototype.getTypeByColor = function(color) {
        for (var i in this.config.seatColors) {
            if (this.config.seatColors[i] == color) return i;
        }

        return null;
    }

    /**
     * Add new row with seats.
     *
     * @param numberOfSeats
     * @param seatColor
     */
    SectorCanvasEditor.prototype.addRow = function(numberOfSeats, seatColorType) {
        var length = this.config.hallSeats.length;
        var seatPositionY = this.config.hallSeats.length  * (parseFloat(this.config.seatTypes[this.config.seatType].height) + this.config.seatMarginTop);

        this.config.hallSeats[this.config.hallSeats.length] = [];

        for (var i = 0; i < numberOfSeats; i++) {
            var seatPositionX = i * (parseFloat(this.config.seatTypes[this.config.seatType].width) + this.config.seatMarginLeft);
            this.addSeat({
                x: seatPositionX,
                y: seatPositionY,
                color: typeof seatColor === 'undefined' ? this.config.seatColors.available : this.config.seatColors[seatColorType],
                type: typeof seatColorType == 'undefined' ? 'available' : seatColorType,
                row: length,
                col: i,
                index: this.config.numberSeatsFrom++,
                seatType: this.config.seatType,
                description: this.config.seatTypes[this.config.seatType].description
            });
        }

        console.log('add row')

        this.renderAll();
    };

    SectorCanvasEditor.prototype.clearCanvas = function() {
        this.fabricCanvas.clear();
        this.initFabric();

        console.log('clear canvas')
    };

    /**
     * Render canvas elements.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.renderAll = function() {
        if (this.config.hallSeats.length) {
            var objects = this.fabricCanvas.getObjects();

            for (var i in objects) {
                this.fabricCanvas.remove(objects[i]);
            }

            // console.log('render')
            //
            // this.initFabric();

            for (var x in this.config.hallSeats) {
                var offsetLeft = this._calcRowCenter(x).left;

                for (var y in this.config.hallSeats[x]) {
                    if (typeof this.config.hallSeats[x][y].index !== 'undefined') {
                        var seatConfig = this.config.hallSeats[x][y];

                        var seat = new fabric.Rect({
                            width: parseFloat(this.config.seatTypes[seatConfig.seatType].width),
                            height: parseFloat(this.config.seatTypes[seatConfig.seatType].height),
                            fill: seatConfig.color,
                            originX: 'center',
                            originY: 'center'
                        });

                        var t1 = new fabric.Text(String(seatConfig.index), {
                            fill: this.config.fontColor,
                            fontFamily: this.config.fontFamily,
                            textAlign: 'center',
                            fontSize: this.config.fontSize,
                            originX: 'center',
                            originY: 'center'
                        });

                        var group = new fabric.Group([seat, t1], {
                            left: seatConfig.x + offsetLeft,
                            top: seatConfig.y
                        });

                        group.my = {};

                        group.my.x = x;
                        group.my.y = y;
                        group.my.type = 'seat';
                        group.my.seatType = seatConfig.seatType;
                        group.my.left = seatConfig.x + offsetLeft,
                        group.my.top = seatConfig.y
                        group.my.config = seatConfig;
                        group.my.config.description = seatConfig.description;

                        this.fabricCanvas.add(group);
                    }
                }
            }
        }
    };

    /**
     *
     * @param row
     * @returns {{left: number, top: *}}
     * @private
     */
    SectorCanvasEditor.prototype._calcRowCenter = function(row) {
        return {
            left: (this.config.canvasWidth - (this.config.hallSeats[row].length * (parseFloat(this.config.seatTypes[this.config.seatType].width) + this.config.seatMarginLeft))) / 2
        };
    };

    SectorCanvasEditor.prototype.toJSON = function(row) {
        var objects = this.fabricCanvas.getObjects();
        var data = [];

        if (objects.length) {
            for (var i in objects) {
                var o = objects[i];

                if (typeof o.my != 'undefined') {
                    data.push(o.my);
                }
            }
        }

        return data;
    }

    window.SectorCanvasEditor = SectorCanvasEditor;
})();
