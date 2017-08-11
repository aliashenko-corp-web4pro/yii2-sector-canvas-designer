<?php

namespace andrewljashenko\sectorcanvaseditor;

use Yii;
use yii\base\Model;

/**
 * Class SectorCanvasForm
 * @package andrewljashenko\sectorcanvaseditor
 */
class SectorCanvasForm extends Model
{
    /**
     * @var string
     */
    public $seatColor = '#02c103';
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
     * @var int
     */
    public $numberRows = 1;
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
     * @var
     */
    public $drawingStyle = 'Pencil';
    /**
     * @var string
     */
    public $lineWidth = 0;
    /**
     * @var string
     */
    public $drawingColor;
    /**
     * @var string
     */
    public $lineColor;

    /**
     * @return array
     */
    public static function getSeatColors()
    {
        return ['#02c103', '#fbeb00', '#c98b02', '#c53c00', '#848285'];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'numberRows' => Yii::t('app', 'Number of Rows'),
            'numberSeatsFrom' => Yii::t('app', 'First number')
        ];
    }

    /**
     * Return list of drawing modes.
     *
     * @return array
     */
    public static function getDrawingModeSelector()
    {
        return [
            'Pencil' => Yii::t('app', 'Pencil'),
            'Circle' => Yii::t('app', 'Circle'),
            'Spray' => Yii::t('app', 'Spray'),
            'Pattern' => Yii::t('app', 'Pattern'),
            'hline' => Yii::t('app', 'hline'),
            'vline' => Yii::t('app', 'vline'),
            'square' => Yii::t('app', 'square'),
            'diamond' => Yii::t('app', 'diamond'),
        ];
    }
}
