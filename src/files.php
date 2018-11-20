<?php

	header("Access-Control-Allow-Origin: *");
	
	function scan_dir($dir) {
		$ignored = array('.', '..', '.htaccess');

		$files = array();    
		foreach (scandir($dir) as $file) {
			// File should not be in the ignored array
            if (in_array($file, $ignored)) continue;
            // File should not be the reduced size version... e.g. 123098-150x150.jpg
            // TODO Should have end of string match $, but trying to diagnose what is broken. 
            if (preg_match('/\d{3,4}x\d{3,4}\.jpg$/', $file)){
                continue;
            }
            $files[$file] = filemtime($dir . '/' . $file);
		}

		arsort($files);
		$files = array_keys($files);

		return ($files) ? $files : false;
	}
	
	$day = $_GET['d'] ?? date('d');
	$month = $_GET['m'] ?? date('m');
	$year = $_GET['y'] ?? date('Y');
	$urls = scan_dir('../family/wp-content/uploads/'.$year.'/'.$month.'/');
	foreach ($urls as &$url){
		$url = $year."/".$month."/".$url;
	}
	unset($url);   
	echo json_encode($urls, JSON_UNESCAPED_SLASHES);
?>