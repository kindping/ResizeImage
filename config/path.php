<?php
/** REAL PATH */
define('DS', DIRECTORY_SEPARATOR);
define('SUB_DIR', 'API/');
define('WWW_BASE', dirname(dirname(__FILE__)) . DS);
define('VIEW_PATH', WWW_BASE . 'view' . DS);
define('CONTROLLER', WWW_BASE . 'app' . DS . 'controller' . DS);
if(php_sapi_name() == 'cli') {
	define('URL_BASE', WWW_BASE);
} else {
	define('URL_BASE', (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https://' : 'http://' ) . $_SERVER['SERVER_NAME'] . '/' . SUB_DIR);
}
/** REAL PATH */

/** TEMP */
define('RESIZE_TEMP_IMAGE_DIR', '_tmp' . DS);
define('RESIZE_TEMP_IMAGE_PATH', WWW_BASE . RESIZE_TEMP_IMAGE_DIR);
/** TEMP */

?>