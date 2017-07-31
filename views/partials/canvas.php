<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\bootstrap\ActiveForm;
use andriiliashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = new ActiveForm(); ?>

<?= $form->field($model, 'canvasWidth')->input('number'); ?>
<?= $form->field($model, 'canvasHeight')->input('number'); ?>
<?= $form->field($model, 'canvasBackgroundColor')->input('color');
