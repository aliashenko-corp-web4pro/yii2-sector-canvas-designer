<?php

namespace andrewljashenko\sectorcanvaseditor;

use Yii;
use yii\helpers\Html;
use yii\helpers\Json;
use yii\widgets\InputWidget;

/**
 * Class SectorCanvasEditor
 * @package andrewljashenko\sectorcanvaseditor
 */
class SectorCanvasEditor extends InputWidget
{
    public $template = '<div class="row sector-canvas-wrap">
                            <div class="col-md-7">{canvas}</div>
                            <div class="col-md-5">{ui}</div>
                        </div>';

    /**
     * Available options:
     *
     * canvasWidth: 500,
     * canvasHeight: 500,
     * canvasBackgroundColor: '#fff',
     * numberSeatsFrom: 1,
     * seatColors: ['#02c103', '#fbeb00', '#c98b02', '#c53c00', '#848285'],
     * seatWidth: 30,
     * seatHeight: 30,
     * seatDefaultColor: '#02c103',
     * seatMarginTop: 5,
     * seatMarginLeft: 5,
     * fontSize: 14,
     * fontFamily: 'Helvetica',
     * fontColor: '#000'
     *
     * @var array
     */
    public $pluginOptions;

    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        SectorCanvasEditorAsset::register(Yii::$app->view);
        return $this->renderContent();
    }

    /**
     * Return tabs content.
     *
     * @return array
     */
    public function getTabbedIdentifier()
    {
        return [
            'canvas' => Yii::t('app', 'Canvas Settings'),
            'seats' => Yii::t('app', 'Manage seats'),
            'draw' => Yii::t('app', 'Drawing'),
        ];
    }

    /**
     * Return canvas markup.
     *
     * @return string
     */
    protected function getCanvas()
    {
        return Html::tag('canvas', null, [
            'id' => 'sector-canvas-' . $this->id,
            'class' => ['js-sector-canvas'],
            'data-config' => Json::encode($this->pluginOptions),
        ]);
    }

    /**
     * Return UI for manage canvas.
     *
     * @return string
     */
    protected function getUI()
    {
        return $this->render('sector-canvas-ui', ['model' => new SectorCanvasForm()]);
    }

    /**
     * Render editors content.
     *
     * @return string
     */
    protected function renderContent()
    {
        return str_replace(['{canvas}', '{ui}'], [$this->getCanvas(), $this->getUI()], $this->template);
    }
}
