<?php

/**
 * @var SectorCanvasForm $model
 */

use andriiliashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<div class="row">
    <div class="col-md-12">
        <ul class="nav nav-tabs">
            <?php foreach ($this->context->getTabbedIdentifier() as $id => $label): ?>
                <li><a href="#<?= $id; ?>"><?= $label; ?></a></li>
            <?php endforeach; ?>
        </ul>

        <div class="tab-content">
            <?php foreach ($this->context->getTabbedIdentifier() as $view => $label): ?>
                <?= $this->render('partials/' . $view, ['model' => $model]); ?>
            <?php endforeach; ?>
        </div>
    </div>
</div>
