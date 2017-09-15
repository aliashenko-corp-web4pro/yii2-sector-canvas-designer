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
        'data-label' => Yii::t('app', 'Exit drawing mode')
]) ?>

<?= Html::button(Yii::t('app', 'Add text'), [
    'class' => 'btn btn-info js-add-text',
    'data-action' => 'add-text',
]) ?>

<?= $form->field($model, 'file')->fileInput([
    'class' => 'form-control js-sector-canvas-file',
    'accept' => 'image/*'
]) ?>

<div class="js-manage-text--wrap" style="display: none">
    <?= $form->field($model, 'fontSize')->input('number', ['min' => 0, 'class' => 'form-control js-fontSize']) ?>
    <?= $form->field($model, 'fontColor')->input('color', ['class' => 'form-control js-fontColor']) ?>
    <?= $form->field($model, 'fontType')->dropDownList($model->getFonts(), ['class' => 'form-control js-fontType']) ?>
</div>

<div class="js-manage-bg--wrap" style="display: none;">
    <div style="margin-top:10px;">
        <button id="send-backwards" class="btn btn-object-action" type="button" data-action="send-backwards">
            <?= Yii::t('app', 'Send backwards') ?>
        </button>

        <button id="send-to-back" class="btn btn-object-action" data-action="send-back" type="button">
            <?= Yii::t('app', 'Send to back') ?>
        </button>
    </div>

    <div style="margin-top:4px;">
        <button id="bring-forward" class="btn btn-object-action" type="button" data-action="bring-forwards">
            <?= Yii::t('app', 'Bring forwards') ?>
        </button>
        <button id="bring-to-front" class="btn btn-object-action" type="button" data-action="bring-front">
            <?= Yii::t('app', 'Bring to front') ?>
        </button>
    </div>
</div>

<div class="js-canvas-drawing" style="display: none;">

    <div id="drawing-mode-options">
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
