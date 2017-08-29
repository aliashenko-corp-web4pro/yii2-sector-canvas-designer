<?php

/**
 * @var SectorCanvasForm $model
 */

use yii\web\View;
use yii\web\JsExpression;
use kartik\select2\Select2;
use yii\helpers\ArrayHelper;
use yii\helpers\Html;
use yii\bootstrap\ActiveForm;
use andrewljashenko\sectorcanvaseditor\SectorCanvasForm;

$formatJs = <<< 'JS'
var formatRepo = function (repo) {
    if (repo.loading) {
        return repo.text;
    }
    
    return '<div class="scd-flex">' +
     '<div class="scd-colorbox" style="background:' + $(repo.element).data('color') + '"></div>' + repo.text
     '</div>';
};
JS;

if ($this->context->pluginOptions['seatStatuses']) {
    foreach ($this->context->pluginOptions['seatStatuses'] as $status) {
        $optionAttributes[$status['id']] = ['data-color' => $status['color_back']];
    }
}

// Register the formatting script
$this->registerJs($formatJs, View::POS_HEAD); ?>

<style>
    .scd-flex {
        display: flex;
        align-items: center;
    }

    .scd-colorbox {
        margin-right: 5px;
        content: '';
        display: inline-block;
        width:20px;
        height:20px;
    }
</style>

<?php $form = ActiveForm::begin(); ?>

<h2><?= Yii::t('app', 'Add seats') ?></h2>
<?= $form->field($model, 'numSeatsPerRow')->input('number', ['min' => 1, 'class' => 'js-seats-num-per-row form-control']) ?>
<?= $form->field($model, 'numberRows')->input('number', ['min' => 1, 'class' => 'js-row-num form-control']) ?>
<?= $form->field($model, 'numberSeatsFrom')->input('number', ['min' => 0, 'class' => 'js-start-num form-control']) ?>

<?php if ($this->context->pluginOptions['seatStatuses']): ?>
    <?= $form->field($model, 'seatStatus')->widget(Select2::className(), [
        'data' => ArrayHelper::map($this->context->pluginOptions['seatStatuses'], 'id', 'status'),
        'pluginOptions' => [
            'allowClear' => true,
            'escapeMarkup' => new JsExpression('function (markup) { return markup; }'),
            'templateResult' => new JsExpression('formatRepo'),
            'templateSelection' => new JsExpression('formatRepo'),
        ],
        'options' => [
            'class' => 'js-seat-status',
            'options' => $optionAttributes
        ]
    ]) ?>
<?php endif; ?>

    <datalist id='<?= 'color-' . $this->context->id ?>'>
        <?php foreach ($this->context->pluginOptions['seatStatuses'] as $key => $value): ?>
            <option value=<?= $value['color_back'] ?>></option>
            <?php endforeach; ?>
    </datalist>

<?php if (!empty($this->context->pluginOptions['seatTypes'])): ?>
    <?= $form->field($model, 'seatType')->dropDownList(ArrayHelper::map($this->context->pluginOptions['seatTypes'], 'id', 'description'), [
        'class' => 'js-seat-type form-control'
    ]); ?>
<?php endif; ?>

<div class="form-group">
    <?= Html::button(Yii::t('app', 'Add seats'), [
            'data-action' => 'add-row',
            'class' => 'btn btn-success',
    ]) ?>

    <div class="js-manage-seats--wrap" style="display: none;">
        <?= Html::button(Yii::t('app', 'Remove selected'), [
            'data-action' => 'delete-objects',
            'class' => 'btn btn-danger js-delete-objects',
            'style' => 'display: none;'
        ]) ?>
    </div>
</div>

<?php $form::end();
