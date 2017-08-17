<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>

<h2><?= Yii::t('app', 'Drawing panel') ?></h2>
<?= Html::button(Yii::t('app', 'Enter drawing mode'), [
        'class' => 'btn btn-info js-drawing-disabled',
        'data-action' => 'drawing-switch',
]) ?>

<div class="js-canvas-drawing" style="display: none;">

    <div id="drawing-mode-options" style="">
        <?= $form->field($model, 'drawingStyle')->dropDownList($model::getDrawingModeSelector(), [
            'class' => 'js-drawing-mode'
        ]) ?>
        <?= $form->field($model, 'lineWidth')->input('range', [
            'min' => 0,
            'max' => 150,
            'value' => 30,
            'class' => 'js-line-width'
        ]) ?>

        <?= $form->field($model, 'drawingColor')->input('color', [
            'class' => 'js-drawing-color',
        ]) ?>
    </div>
</div>

<?php $form::end();
