<?php
include('../../vendor/autoload.php');
use app\component\Request;
use app\component\File;
use app\component\Arr;
use app\component\Images;

switch(Request::input('_method')) {
	case 'Resize' :
		File::init();
		$file = File::file(0);
		$width = File::param('width');
		Images::init($file['tmp_name']);
		Images::resizeW($width);
		$newFile = md5($file['tmp_name'] . $width . time()) . '.' . Images::extension();
		Images::save(RESIZE_TEMP_IMAGE_PATH . $newFile);
		echo json_encode(RESIZE_TEMP_IMAGE_DIR . $newFile);
	break;
	default :
		return false;
}
?>