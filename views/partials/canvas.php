<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>

<?= $form->field($model, 'canvasWidth')->input('number'); ?>
<?= $form->field($model, 'canvasHeight')->input('number'); ?>
<?= $form->field($model, 'canvasBackgroundColor')->input('color');

$form::end();
