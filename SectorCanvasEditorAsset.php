<?php

namespace andrewljashenko\sectorcanvaseditor;

use yii\web\AssetBundle;

/**
 * Class SectorCanvasEditorAsset
 * @package andrewljashenko\sectorcanvaseditor
 */
class SectorCanvasEditorAsset extends AssetBundle
{
    /**
     * @var string
     */
    public $sourcePath = '@andrewljashenko/yii2-sector-canvas-designer';

    public $js = [
        '/js/fabric.min.js',
        '/js/editor.custom.js',
    ];
}
