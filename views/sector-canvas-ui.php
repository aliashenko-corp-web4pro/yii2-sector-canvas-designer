<?php

/**
 * @var SectorCanvasForm $model
 */

use andrewljashenko\sectorcanvaseditor\SectorCanvasForm; ?>

<div class="row">
    <div class="col-md-12">
        <ul class="nav nav-tabs">
            <?php foreach ($this->context->getTabbedIdentifier() as $id => $label): ?>
                <li><a href="#<?= $id . $this->context->id; ?>" data-toggle="tab"><?= $label; ?></a></li>
            <?php endforeach; ?>
        </ul>

        <div class="tab-content">
            <?php foreach ($this->context->getTabbedIdentifier() as $view => $label): ?>
                <div id="<?= $view . $this->context->id; ?>" class="tab-pane fade">
                    <?= $this->render('partials/' . $view, ['model' => $model]); ?>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</div>
