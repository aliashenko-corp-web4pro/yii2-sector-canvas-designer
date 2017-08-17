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
    public $template = '<div class="row sector-canvas-wrap">{field}
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
        if (empty($this->pluginOptions['seatColors'])) {
            $this->pluginOptions['seatColors'] = SectorCanvasForm::getSeatColors();
        }

        if (empty($this->pluginOptions['seatTypes'])) {
            $this->pluginOptions['seatTypes'] = SectorCanvasForm::getSeatTypes();
        }
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
        return str_replace(['{field}', '{canvas}', '{ui}'], [$this->getInput('hiddenInput'), $this->getCanvas(), $this->getUI()], $this->template);
    }

    /**
     * Generates an input.
     *
     * @param string $type the input type
     * @param boolean $list whether the input is of dropdown list type
     *
     * @return string the rendered input markup
     */
    protected function getInput($type, $list = false)
    {
        $this->options['class'] = 'js-canvas-data';

        if ($this->hasModel()) {
            $input = 'active' . ucfirst($type);
            return $list ?
                Html::$input($this->model, $this->attribute, $this->data, $this->options) :
                Html::$input($this->model, $this->attribute, $this->options);
        }
        $input = $type;
        $checked = false;
        if ($type == 'radio' || $type == 'checkbox') {
            $this->options['value'] = $this->value;
            $checked = ArrayHelper::remove($this->options, 'checked', '');
            if (empty($checked) && !empty($this->value)) {
                $checked = ($this->value == 0) ? false : true;
            } elseif (empty($checked)) {
                $checked = false;
            }
        }
        return $list ?
            Html::$input($this->name, $this->value, $this->data, $this->options) :
            (($type == 'checkbox' || $type == 'radio') ?
                Html::$input($this->name, $checked, $this->options) :
                Html::$input($this->name, $this->value, $this->options));
    }
}
