<?php
namespace app\component;
use app\component\Arr;
use app\component\Request;
use app\component\Images;

class File {
	private static $files = [];
	private static $param = [];

	public static function init() {
		self::$param = json_decode(Request::input('param'), true);
		if($_FILES && count($_FILES) > 0) {
			foreach($_FILES as $f) {
				self::$files[] = $f;
			}
		}
	}

	public static function file($index = 0) {
		return Arr::get(self::$files, $index);
	}

	public static function param($index) {
		return Arr::get(self::$param, $index);
	}

	public static function save($filename, $index = 0, $path = '') {
		$file = Arr::get(self::$files, $index);
		if(!$file) return false;
		$filename = self::replaceExtension($filename);
		Images::init($file['tmp_name']);
		$save = $path . $filename . '.' . Images::extension();
		Images::save($save);
		return [
			'file' => $save,
			'extension' => Images::extension()
		];
	}

	public static function saveAll($filenames, $path = '') {
		$info = [];
		foreach($filenames as $index => $filename) {
			$info[] = self::save($filename, $index, $path);
		}
		return $info;
	}

	public static function toVariable($file, $vars = []) {
		foreach($vars as $k => $v) $$k = $v;
		ob_start();
		include($file);
		$content = ob_get_contents();
		ob_end_clean();
		return $content;
	}

	private static function replaceExtension($filename) {
		$f = explode('.', $filename);
		$len = count($f) - 1;
		if($len <= 0) return $filename;
		$newFile = '';
		for($i = 0; $i < $len; $i++) {
			$newFile .= $f[$i];
		}
		return $newFile;
	}
}
?>