<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<?php $form = ActiveForm::begin(); ?>

<h2><?= Yii::t('app', 'Add seats') ?></h2>
<?= $form->field($model, 'numSeatsPerRow')->input('number', ['min' => 1, 'class' => 'js-seats-num-per-row form-control']) ?>
<?= $form->field($model, 'numberRows')->input('number', ['min' => 1, 'class' => 'js-row-num form-control']) ?>
<?= $form->field($model, 'numberSeatsFrom')->input('number', ['min' => 0, 'class' => 'js-start-num form-control']) ?>

<?= Html::button(Yii::t('app', 'Add seats'), [
        'data-action' => 'add-row',
        'class' => 'btn btn-success',
]) ?>

<div class="js-manage-seats--wrap" style="display: none;">
    <h2><?= Yii::t('app', 'Manage seats') ?></h2>

    <?= $form->field($model, 'seatColor')->input('color', [
        'list' => 'color-' . $this->context->id,
        'class' => 'js-color-seat form-control',
    ]) ?>

    <datalist id='<?= 'color-' . $this->context->id ?>'>
        <?php foreach ($this->context->pluginOptions['seatColors'] as $key => $value): ?>
            <option value=<?= $value ?>>
        <?php endforeach; ?>
    </datalist>

    <?php if (!empty($this->context->pluginOptions['seatTypes'])): ?>
        <?= $form->field($model, 'seatType')->dropDownList(ArrayHelper::getColumn($this->context->pluginOptions['seatTypes'], 'description'), [
            'class' => 'js-seat-type form-control'
        ]); ?>
    <?php endif; ?>

    <?= Html::button(Yii::t('app', 'Remove selected'), [
        'data-action' => 'delete-objects',
        'class' => 'btn btn-danger js-delete-objects',
        'style' => 'display: none;'
    ]) ?>
</div>

<?php $form::end();
