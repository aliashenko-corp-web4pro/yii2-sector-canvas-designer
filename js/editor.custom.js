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
            seatStatuses: {},
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
        if (typeof object.group.key !=' undefined') {
            var type = this.config.seatTypes[seatType];
            object.set('width', parseFloat(type.width));
            object.set('height', parseFloat(type.width));
            this.config.hallSeats[object.group.key].seat_type_id = seatType;
        }
    }

    /**
     * Change seat color.
     *
     * @param object
     * @param seatType
     */
    SectorCanvasEditor.prototype.changeSeatStatus = function(object, seatStatus) {
        if (typeof object.group.key !=' undefined') {
            var status = this.config.seatStatuses[seatStatus];
            object.set('fill', status.color_back);
            this.config.hallSeats[object.group.key].seat_status_id = seatStatus;
        }
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
        this.config.hallSeats.push(config);
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
        for (var i in this.config.seatStatuses) {
            if (this.config.seatStatuses[i] == color) return i;
        }

        return null;
    }

    /**
     * Add new row with seats.
     *
     * @param numberOfSeats
     * @param seatColor
     */
    SectorCanvasEditor.prototype.addRow = function(numberOfSeats, seatStatus, seatType) {
        var length = this.config.hallSeats.length;
        var seatPositionY = this.config.hallSeats.length  * (parseFloat(this.config.seatTypes[seatType].height) + this.config.seatMarginTop);

        this.config.hallSeats[this.config.hallSeats.length] = [];

        for (var i = 0; i < numberOfSeats; i++) {
            var seatPositionX = i * (parseFloat(this.config.seatTypes[seatType].width) + this.config.seatMarginLeft);
            this.addSeat({
                position_left: seatPositionX,
                position_top: seatPositionY,
                seat_type_id: seatType,
                seat_status_id: seatStatus,
                position_in_sector: this.config.numberSeatsFrom++
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
        if (this.config.hallSeats.length) {
            var objects = this.fabricCanvas.getObjects();

            for (var i in objects) {
                this.fabricCanvas.remove(objects[i]);
            }

            for (var i in this.config.hallSeats) {
                var seatConfig = this.config.hallSeats[i];

                if (typeof seatConfig.seat_type_id == 'undefined') continue;

                var seat = new fabric.Rect({
                    width: parseFloat(this.config.seatTypes[seatConfig.seat_type_id].width),
                    height: parseFloat(this.config.seatTypes[seatConfig.seat_type_id].height),
                    fill: this.config.seatStatuses[seatConfig.seat_status_id].color_back,
                    originX: 'center',
                    originY: 'center'
                });

                var t1 = new fabric.Text(String(seatConfig.position_in_sector), {
                    fill: this.config.fontColor,
                    fontFamily: this.config.fontFamily,
                    textAlign: 'center',
                    fontSize: this.config.fontSize,
                    originX: 'center',
                    originY: 'center'
                });

                var group = new fabric.Group([seat, t1], {
                    left: parseFloat(seatConfig.position_left),
                    top: parseFloat(seatConfig.position_top)
                });

                group.key = i;

                this.fabricCanvas.add(group);
                this.fabricCanvas.renderAll();
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
