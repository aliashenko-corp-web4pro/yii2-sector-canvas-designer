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
            seatColors: ['#02c103', '#fbeb00', '#c98b02', '#c53c00', '#848285'],
            seatWidth: 30,
            seatHeight: 30,
            seatDefaultColor: '#02c103',
            seatMarginTop: 5,
            seatMarginLeft: 5,
            fontSize: 14,
            fontFamily: 'Helvetica',
            fontColor: '#000'
        };

        this.hallSeats = [];
        this.config = Object.assign(this.defaultConfig, config);

        this.initFabric();
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
    };

    /**
     * Add seat to the row using color (hex) and row number
     *
     * @param config
     */
    SectorCanvasEditor.prototype.addSeat = function(config) {
        this.hallSeats[config.row].push(config);
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

    /**
     * Add new row with seats.
     *
     * @param numberOfSeats
     * @param seatColor
     */
    SectorCanvasEditor.prototype.addRow = function(numberOfSeats, seatColor) {
        var length = this.hallSeats.length;
        var seatPositionY = this.hallSeats.length  * (this.config.seatHeight + this.config.seatMarginTop);

        this.hallSeats[this.hallSeats.length] = [];

        for (var i = 0; i < numberOfSeats; i++) {
            var seatPositionX = i * (this.config.seatWidth + this.config.seatMarginLeft);
            this.addSeat({
                x: seatPositionX,
                y: seatPositionY,
                color: typeof seatColor === 'undefined' ? this.config.seatDefaultColor : seatColor,
                row: length,
                col: i,
                index: this.config.numberSeatsFrom++
            });
        }

        this.renderAll();
    };

    SectorCanvasEditor.prototype.clearCanvas = function() {
        this.fabricCanvas.clear();
        this.initFabric();
    };

    /**
     * Render canvas elements.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.renderAll = function() {
        if (this.hallSeats.length) {
            var objects = this.fabricCanvas.getObjects();
            for (var i in objects) {
                this.fabricCanvas.remove(objects[i]);
            }

            for (var x in this.hallSeats) {
                var offsetLeft = this._calcRowCenter(x).left;

                for (var y in this.hallSeats[x]) {
                    if (typeof this.hallSeats[x][y].index !== 'undefined') {
                        var seatConfig = this.hallSeats[x][y];

                        var seat = new fabric.Rect({
                            width: this.config.seatWidth,
                            height: this.config.seatHeight,
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
            left: (this.config.canvasWidth - (this.hallSeats[row].length * (this.config.seatWidth + this.config.seatMarginLeft))) / 2
        };
    };

    window.SectorCanvasEditor = SectorCanvasEditor;
})();
