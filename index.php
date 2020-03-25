<?php
/*
 * myQR API version 1.0
 * 2018-11-06
 */
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, token, UUID, x-xsrf-token");
$gStart = microtime(true);
$method = strtolower($_SERVER["REQUEST_METHOD"]);
if($method=="options") {
  exit;
}
error_reporting(E_ALL);

require './config.inc.php';			// this is only file you need to edit
require '../vendor/autoload.php';   

date_default_timezone_set($rgConfig["timeZone"]);

require $rgConfig['coreDir'].'app-core.php';
exit;

// -------------- Below is dry run before setup
// $app = new \Slim\Slim();
// $app->get('/hello/:name', function ($name) {
//   global $rgConfig;
//     echo "Hello, " . $name;
//     var_dump($rgConfig);
// });
// $app->run();
// exit;
// End of file

