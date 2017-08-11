<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>

<?= Html::button(Yii::t('app', 'Clear canvas'), ['data-action' => 'clear-canvas', 'class' => 'btn btn-danger']) ?>

<?= $form->field($model, 'canvasWidth')->input('number', ['class' => 'js-canvas-width']); ?>
<?= $form->field($model, 'canvasHeight')->input('number', ['class' => 'js-canvas-height']); ?>
<?= $form->field($model, 'canvasBackgroundColor')->input('color', ['class' => 'js-canvas-color']); ?>
<?= Html::button(Yii::t('app', 'Change'), ['data-action' => 'canvas-change']); ?>

<?php $form::end();
