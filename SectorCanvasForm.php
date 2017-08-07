<?php

namespace andrewljashenko\sectorcanvaseditor;

use yii\base\Model;

/**
 * Class SectorCanvasForm
 * @package andrewljashenko\sectorcanvaseditor
 */
class SectorCanvasForm extends Model
{
    /**
     * @var int
     */
    public $canvasWidth = 500;
    /**
     * @var int
     */
    public $canvasHeight = 500;
    /**
     * @var string
     */
    public $canvasBackgroundColor = '#ffffff';
    /**
     * @var int
     */
    public $numberSeatsFrom = 1;
    /**
     * @var string
     */
    public $seatDefaultColor = '#02c103';
    /**
     * @var int
     */
    public $seatMarginTop = 5;
    /**
     * @var int
     */
    public $seatMarginLeft = 5;
    /**
     * @var int
     */
    public $fontSize = 14;
    /**
     * @var string
     */
    public $fontFamily = 'Helvetica';
    /**
     * @var string
     */
    public $fontColor = '#000';
    /**
     * @var
     */
    public $numSeatsPerRow = 5;

    /**
     * @return array
     */
    public function getSeatColors()
    {
        return ['#02c103', '#fbeb00', '#c98b02', '#c53c00', '#848285'];
    }
}
