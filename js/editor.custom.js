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
        this.fabricCanvas = new fabric.Canvas(this.canvas);

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
            seatMarginLeft: 5
        };

        this.hallSeats = [];

        this.config = Object.assign(this.defaultConfig, config);
    }

    /**
     * Add seat to the row using color (hex) and row number
     *
     * @param config
     */
    SectorCanvasEditor.prototype.addSeat = function(config) {
        this.hallSeats[config.row][config.col] = config;
    };

    /**
     * Add new row with seats.
     *
     * @param numberOfSeats
     * @param seatColor
     */
    SectorCanvasEditor.prototype.addRow = function(numberOfSeats, seatColor) {
        var seatPositionY = this.hallSeats.length  * (this.seatHeight + this.seatMarginTop);
        this.hallSeats[this.hallSeats.length] = [];
        var seats = [];

        for (var i = 0; i < numberOfSeats; i++) {
            var seatPositionX = i * (this.seatWidth + this.seatMarginLeft);
            this.addSeat({
                x: seatPositionX,
                y: seatPositionY,
                color: typeof seatColor === 'undefined' ? this.config.seatDefaultColor : seatColor,
                row: this.hallSeats.length,
                col: i
            });
        }
    };

    /**
     * Render canvas elements.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.renderAll = function() {
        if (this.hallSeats.length) {
            this.fabricCanvas.clear();

            for (var x in this.hallSeats) {
                var offsetLeft = this._calcRowCenter(x);

                for (var y in this.hallSeats[x]) {
                    if (typeof this.hallSeats[x][y] !== 'undefined') {
                        var seatConfig = this.hallSeats[x][y];

                        var seat = new fabric.Rect({
                            width: this.config.seatWidth,
                            height: this.config.seatHeight,
                            left: seatConfig.seatPositionX,
                            top: seatConfig.seatPositionY,
                            fill: seatConfig.color
                        });
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
            left: (this.canvasWidth - (this.hallSeats[row].length * (this.seatWidth + this.seatMarginLeft))) / 2
        };
    };

    window.SectorCanvasEditor = SectorCanvasEditor;
})();
