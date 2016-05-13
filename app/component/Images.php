<?php
namespace app\component;
class Images {
	private static $image = NULL;
	private static $image_type = NULL;

	public static function init($filename) {
		if(!file_exists($filename)) return false;
		$info = getimagesize($filename);
		self::$image_type = $info[2];
		self::$image = NULL;
		if(self::$image_type == IMAGETYPE_JPEG) {
			self::$image = imagecreatefromjpeg($filename);
		}
		if(self::$image_type == IMAGETYPE_GIF) {
			self::$image = imagecreatefromgif($filename);
			imagesavealpha(self::$image, true);
		}
		if(self::$image_type == IMAGETYPE_PNG) {
			self::$image = imagecreatefrompng($filename);
			imagesavealpha(self::$image, true);
		}
	}

	public static function save($filename, $compression = 75, $permission = NULL) {
		if(!self::$image) return false;
		if(self::$image_type == IMAGETYPE_JPEG) {
			self::$image = imagejpeg(self::$image, $filename, $compression);
		}
		if(self::$image_type == IMAGETYPE_GIF) {
			self::$image = imagegif(self::$image, $filename);
		}
		if(self::$image_type == IMAGETYPE_PNG) {
			self::$image = imagepng(self::$image, $filename, 10 - ($compression / 10));
		}
		if($permission != NULL) chmod($filename, $permission);
	}

	public static function output() {
		if(!self::$image) return false;
		if(self::$image_type == IMAGETYPE_JPEG) {
			imagejpeg(self::$image);
		}
		if(self::$image_type == IMAGETYPE_GIF) {
			imagegif(self::$image);
		}
		if(self::$image_type == IMAGETYPE_PNG) {
			imagepng(self::$image);
		}
	}

	public static function resizeH($height) {
		if($height <= 0) return false;
		$ratio = $height / self::getH();
		$width = self::getW() * $ratio;
		self::resize($width, $height);
	}

	public static function resizeW($width) {
		if($width <= 0) return false;
		$ratio = $width / self::getW();
		$height = self::getH() * $ratio;
		self::resize($width, $height);
	}

	public static function scale($scale) {
		$width = self::getW() * $scale / 100;
		$height = self::getH() * $scale / 100;
		self::resize($width, $height);
	}

	public static function resize($width, $height) {
		$new_image = imagecreatetruecolor($width, $height);
		if(self::$image_type == IMAGETYPE_PNG || self::$image_type == IMAGETYPE_GIF) {
			imagealphablending($new_image, false);
	 		imagesavealpha($new_image, true);
			$transparent = imagecolorallocatealpha($new_image, 255, 255, 255, 127);
	 		imagefilledrectangle($new_image, 0, 0, $width, $height, $transparent);
		}
		imagecopyresampled($new_image, self::$image, 0, 0, 0, 0, $width, $height, self::getW(), self::getH());
		self::$image = $new_image;
	}

	public static function extension() {
		if(self::$image_type == IMAGETYPE_JPEG) return 'jpg';
		if(self::$image_type == IMAGETYPE_GIF) return 'gif';
		if(self::$image_type == IMAGETYPE_PNG) return 'png';
		return '';
	}

	public static function getW() {
		return (self::$image) ? imagesx(self::$image) : 0;
	}

	public static function getH() {
		return (self::$image) ? imagesy(self::$image) : 0;
	}
}
?>