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
    public $sourcePath = '@vendor/andrewljashenko/yii2-sector-canvas-designer';

    /**
     * @var array
     */
    public $js = [
        'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js',
        'js/fabric.min.js',
        'js/editor.custom.js',
        'js/editor.ui.js',
    ];

    /**
     * @var array
     */
    public $depends = [
        'yii\jui\JuiAsset',
        'yii\bootstrap\BootstrapAsset',
    ];
}
