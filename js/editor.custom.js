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
            seatMarginTop: 30,
            seatMarginLeft: 5,
            fontSize: 14,
            fontFamily: 'Helvetica',
            fontColor: '#000',
            hallSeats: [],
            temp: [],
            objects: [],
        };

        this.config = Object.assign(this.defaultConfig, config);
        this.config.seatMarginTop = 30;
        this.initFabric();
        this.initTemp();
    }

    /**
     * Change seat type.
     *
     * @param object
     * @param seatType
     */
    SectorCanvasEditor.prototype.changeSeatType = function(object, seatType) {
        if (typeof object.group.seatConfig !=' undefined') {
            var type = this.config.seatTypes[seatType];
            object.set('width', parseFloat(type.width));
            object.set('height', parseFloat(type.width));
            object.group.seatConfig.seat_type_id = seatType;
        }
    }

    /**
     * Change seat color.
     *
     * @param object
     * @param seatType
     */
    SectorCanvasEditor.prototype.changeSeatStatus = function(object, seatStatus) {
        if (typeof object.group.seatConfig !=' undefined') {
            var status = this.config.seatStatuses[seatStatus];
            object.set('fill', status.color_back);
            object.group.seatConfig.seat_status_id = seatStatus;
        }
    }

    /**
     * Initialize temp objects.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.initTemp = function () {
        var _this = this;

        console.log(this.config)

        for (var i in this.config.hallSeats) {
            var seatConfig = this.config.hallSeats[i];
            var searched = false;
            var group = this.generateSeat(seatConfig).toJSON();
            group.seatConfig = seatConfig;

            for (var j in this.config.objects) {
                var object = this.config.objects[j];

                if (typeof object.seatConfig == 'undefined') continue;

                if (seatConfig.id == object.seatConfig.id) {
                    this.config.objects[j] = group;
                    searched = true;
                    break;
                }
            }

            if (!searched) {
                this.config.objects.push(group);
            }
        }

        for (var i in this.config.objects) {
            var object = this.config.objects[i];
            var searched = false;

            if (typeof object.seatConfig == 'undefined') continue;

            for (var j in this.config.hallSeats) {
                var seatConfig = this.config.hallSeats[j];

                if (seatConfig.id == this.config.objects[i].seatConfig.id) {
                    searched = true;
                    break;
                }
            }

            if (!searched) {
                this.config.objects.splice(i, 1);
            }
        }

        if (this.config.objects) {
            this.fabricCanvas.loadFromJSON(JSON.stringify(this.config), this.fabricCanvas.renderAll.bind(this.fabricCanvas));
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
        this.renderSeat(config);
    };

    SectorCanvasEditor.prototype.setCanvasWidth = function(width) {
        this.fabricCanvas.setWidth(width);
        this.config.canvasWidth = width;
        this.fabricCanvas.renderAll();
    };

    SectorCanvasEditor.prototype.setCanvasHeight = function(height) {
        this.fabricCanvas.setHeight(height);
        this.config.canvasHeight = height;
        this.fabricCanvas.renderAll();
    };

    SectorCanvasEditor.prototype.setCanvasBackgroundColor = function(color) {
        this.fabricCanvas.setBackgroundColor(color);
        this.config.canvasBackgroundColor = color;
        this.fabricCanvas.renderAll();
    };

    SectorCanvasEditor.prototype.getTypeByColor = function(color) {
        for (var i in this.config.seatStatuses) {
            if (this.config.seatStatuses[i] == color) return i;
        }

        return null;
    }

    SectorCanvasEditor.prototype.getMaxPositionTop = function () {
        var max = 0;
        if (this.config.hallSeats.length) {
            for (var i in this.config.hallSeats) {
                if (typeof this.config.hallSeats[i].position_top != 'undefined') {
                    var positionTop = parseFloat(this.config.hallSeats[i].position_top);
                    max = max < positionTop ? positionTop : max;
                }
            }
        }

        return max;
    }

    SectorCanvasEditor.prototype.getMaxPositionNum = function () {
        var max = 0;
        if (this.config.hallSeats.length) {
            for (var i in this.config.hallSeats) {
                if (typeof this.config.hallSeats[i].position_in_sector != 'undefined') {
                    var positionTop = parseFloat(this.config.hallSeats[i].position_in_sector);
                    max = max < positionTop ? positionTop : max;
                }
            }
        }

        return max;
    }

    /**
     * Add new row with seats.
     *
     * @param numberOfSeats
     * @param seatColor
     */
    SectorCanvasEditor.prototype.addRow = function(numberOfSeats, seatStatus, seatType) {
        var length = this.config.hallSeats.length;
        var seatPositionY = this.getMaxPositionTop() + this.config.seatMarginTop;

        this.config.hallSeats[this.config.hallSeats.length] = [];

        for (var i = 0; i < numberOfSeats; i++) {
            var seatPositionX = i * (parseFloat(this.config.seatTypes[seatType].width) + this.config.seatMarginLeft);
            var posNum = this.getMaxPositionNum();
            this.addSeat({
                position_left: seatPositionX,
                position_top: seatPositionY,
                seat_type_id: seatType,
                seat_status_id: seatStatus,
                position_in_sector: ++posNum,
                key: length + i,
            });
        }
    };

    SectorCanvasEditor.prototype.clearCanvas = function() {
        this.fabricCanvas.clear();
        this.initFabric();
    };

    SectorCanvasEditor.prototype.generateSeat = function(seatConfig) {
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

        group.key = seatConfig.key;
        group.seatConfig = seatConfig;

        return group;
    };

    /**
     *
     * @param seatConfig
     */
    SectorCanvasEditor.prototype.renderSeat = function(seatConfig) {
        if (typeof seatConfig.seat_type_id == 'undefined') return;

        var _this = this;

        var group = this.generateSeat(seatConfig);

        this.fabricCanvas.add(group);

    }

    /**
     * Render canvas elements.
     *
     * @return void
     */
    SectorCanvasEditor.prototype.renderAll = function() {
        if (this.config.hallSeats.length) {
            var objects = this.fabricCanvas.getObjects();

            for (var i in objects) {
                if (typeof objects[i].key != 'undefined') {
                    this.fabricCanvas.remove(objects[i]);
                }
            }

            for (var i in this.config.hallSeats) {
                var seatConfig = this.config.hallSeats[i];
                seatConfig.key = i;

                this.renderSeat(seatConfig);

                this.fabricCanvas.renderAll();
            }
        }
    };

    /**
     * Generatation of submit data.
     * 
     * @returns {*}
     */
    SectorCanvasEditor.prototype.generateSubmitData = function () {
        var objects = this.fabricCanvas.getObjects();
        this.config.objects = [];

        if (objects) {
            for (var i in objects) {
                var jsonObject = objects[i].toJSON();

                if (typeof objects[i].seatConfig != 'undefined') {
                    jsonObject.seatConfig = objects[i].seatConfig;
                    jsonObject.key = objects[i].key;
                }

                this.config.objects.push(jsonObject);
            }
        }

        console.log(this.config.objects)

        return this.config;
    }
    
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

    window.SectorCanvasEditor = SectorCanvasEditor;
})();
