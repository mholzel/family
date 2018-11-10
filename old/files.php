<?php
	$day = NULL;
	$month = NULL;
	$year = NULL;
	if ($_GET) {
		$day = $_GET['d'];
		$month = $_GET['m'];
		$year = $_GET['y'];
	} 
	if (!isset($day))
		$day = date('d');
	if (!isset($month))
		$month = date('m');
	if (!isset($year))
		$year = date('Y');
	$urls = scandir('../family/wp-content/uploads/'.$year.'/'.$month.'/');
	foreach ($urls as &$url){
		$url = $year."/".$month."/".$url;
	}
	unset($url);   
	echo json_encode($urls, JSON_UNESCAPED_SLASHES);
?>