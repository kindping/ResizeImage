<?php
namespace app\component;
class Arr {
	public static function set(&$array, $key, $value) {
		if(is_null($key)) return $array = $value;
		$keys = explode('.', $key);
		while(count($keys) > 1) {
			$key = array_shift($keys);
			if(!isset($array[$key]) || !is_array($array[$key])) $array[$key] = [];
			$array = &$array[$key];
		}
		$array[array_shift($keys)] = $value;
	}

	public static function get(&$array, $keys, $def = '') {
		$keys = explode('.', $keys);
		$temp = &$array;
		foreach($keys as $key) {
			if(!isset($temp[$key])) return $def;
			$temp = &$temp[$key];
		}
		return $temp;
	}

	public static function init($key, $data, $deep = false) {
		$newer = [];
		foreach($data as $d) {
			if($deep) {
				if(!isset($newer[$d[$key]])) $newer[$d[$key]] = [];
				$newer[$d[$key]][] = $d;
			} else {
				$newer[$d[$key]] = $d;	
			}			
		}
		return $newer;
	}
}
?>