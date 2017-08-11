<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>

<h2><?= Yii::t('app', 'Add seats') ?></h2>
<?= $form->field($model, 'numSeatsPerRow')->input('number', ['min' => 1]) ?>
<?= $form->field($model, 'numberRows')->input('number', ['min' => 1]) ?>
<?= $form->field($model, 'numberSeatsFrom')->input('number', ['min' => 0]) ?>
<?= Html::button(Yii::t('app', 'Add seats'), [
        'data-action' => 'add-row',
        'class' => 'btn btn-success',
]) ?>

<div class="js-manage-seats--wrap" style="display: none;">
    <h2><?= Yii::t('app', 'Manage seats') ?></h2>

    <?= $form->field($model, 'seatColor')->input('color', [
        'list' => 'color-' . $this->context->id,
        'class' => 'js-color-seat',
    ]) ?>

    <datalist id='<?= 'color-' . $this->context->id ?>'>
        <?php foreach (SectorCanvasForm::getSeatColors() as $value): ?>
            <option value=<?= $value ?>>
        <?php endforeach; ?>
    </datalist>

    <?= Html::button(Yii::t('app', 'Remove selected'), [
        'data-action' => 'delete-objects',
        'class' => 'btn btn-danger js-delete-objects',
        'style' => 'display: none;'
    ]) ?>
</div>

<?php $form::end();
