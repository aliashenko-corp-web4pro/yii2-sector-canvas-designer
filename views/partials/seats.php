<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>
<?= $form->field($model, 'numSeatsPerRow')->input('number') ?>
<?= Html::button(Yii::t('app', 'Add row'), ['data-action' => 'add-row']) ?>

<?php $form::end();
