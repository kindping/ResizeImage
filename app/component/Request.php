<?php
/** 
 * update 2015-11-05
 * 	add file method support $_FILES
 * 	Request::file('myfile');
 */
namespace app\component;
use app\component\Arr;
class Request {

	private static function getInput() {
		return (self::method() == 'POST') ? $_POST : $_GET;
	}

	public static function method() {
		return strtoupper($_SERVER['REQUEST_METHOD']);
	}

	public static function input($key, $def = '') {
        $input = self::getInput();
		return Arr::get($input, $key, $def);
	}

	public static function file($key, $def = '') {
		return Arr::get($_FILES, $key, $def);
	}

	public static function all() {
		return self::getInput();
	}

	public static function has($keys) {
        $input = self::getInput();
		$result = Arr::get($input, $keys, false);
		return $result;
	}
	
	public static function url() {
		$s = $_SERVER;
		$url = $s['HTTP_HOST'] . $s['SCRIPT_NAME'];
		if($s['QUERY_STRING'] != '') {
			$url .= '?' . $s['QUERY_STRING'];
		}
		return $url;
	}

	public static function remoteIP() {
		return $_SERVER['REMOTE_ADDR'];
	}

	public static function serverIP() {
		return $_SERVER['SERVER_ADDR'];
	}
}
?>
