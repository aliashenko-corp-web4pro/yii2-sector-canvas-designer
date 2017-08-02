<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>
<?= $form->field($model, 'numFieldPerRow')->input('number') ?>
<?= Html::button(Yii::t('app', 'Add row'), ['class' => 'js-add-row', 'data-target-field' => '']) ?>

<?php $form::end();
