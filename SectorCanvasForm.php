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
     * @var string
     */
    public $seatType;
    /**
     * @var
     */
    public $seatStatus;
    /**
     * @var string
     */
    public $vocabulary = 'app';
    /**
     * @var string
     */
    public $fontType = 'arial';
    /**
     * @var string
     */
    public $file;

    /**
     * @return array
     */
    public static function getSeatColors()
    {
        return ['#02c103', '#fbeb00', '#c98b02', '#c53c00', '#848285'];
    }

    /**
     * @return array
     */
    public function getSeatTypes()
    {
        return [
            [
                'description' => Yii::t('app', 'big 30x30'),
                'width' => 30,
                'height' => 30,
            ]
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'numberRows' => Yii::t('app', 'Number of Rows'),
            'numberSeatsFrom' => Yii::t('app', 'First number'),
            'seatColor' => Yii::t('app', 'Seat status'),
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

    /**
     * Return list of fonts.
     *
     * @return array
     */
    public function getFonts()
    {
        return [
            "arial" => Yii::t( $this->vocabulary, "Arial"),
            "helvetica" => Yii::t( $this->vocabulary, "Helvetica"),
            "myriad pro" => Yii::t( $this->vocabulary, "Myriad Pro"),
            "delicious" => Yii::t( $this->vocabulary, "Delicious"),
            "verdana" => Yii::t( $this->vocabulary, "Verdana"),
            "georgia" => Yii::t( $this->vocabulary, "Georgia"),
            "courier" => Yii::t( $this->vocabulary, "Courier"),
            "comic sans ms" => Yii::t( $this->vocabulary, "Comic Sans MS"),
            "impact" => Yii::t( $this->vocabulary, "Impact"),
            "monaco" => Yii::t( $this->vocabulary, "Monaco"),
            "optima" => Yii::t( $this->vocabulary, "Optima"),
            "hoefler text" => Yii::t( $this->vocabulary, "Hoefler Text"),
            "plaster" => Yii::t( $this->vocabulary, "Plaster"),
            "engagement" => Yii::t( $this->vocabulary, "Engagement"),
        ];
    }
}
