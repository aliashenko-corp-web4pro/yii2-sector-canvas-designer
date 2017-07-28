<?php

namespace andriiliashenko\sectorcanvaseditor;

use yii\widgets\InputWidget;

/**
 * Class SectorCanvasEditor
 * @package andrewljashenko\sectorcanvaseditor
 */
class SectorCanvasEditor extends InputWidget
{
    /**
     * @inheritdoc
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @inheritdoc
     */
    public function run()
    {
        return $this->renderContent();
    }

    /**
     * Render editors content.
     *
     * @return string.
     */
    protected function renderContent()
    {

    }
}
