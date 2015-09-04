<?php
	header('Allow: HEAD,GET,PUT,POST,DELETE,OPTIONS');
	header('Access-Control-Allow-Headers: X-Requested-With, X-HTTP-Method-Override, Content-Type, Cache-Control, Accept');
	header('Access-Control-Allow-Origin: *');

	$ch = curl_init();
	$city = (!empty($_REQUEST['q'])) ? urlencode($_REQUEST['q']) : 'Moscow';
	//$url = "http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=%D0%B3%D0%BE%D1%80%D0%BE%D0%B4%20".$city."&start=10&rsz=1&imgsz=medium";
	$url = "http://tehvuz.ru/public/curl.php?q=".$city;
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	$result = curl_exec($ch);  
	curl_close($ch);
	
 	// $arr = json_decode($result);
	// $url = $arr->responseData->results[0]->url;
	// $city = array('url' => $url);
	// echo json_encode($city);
	echo $result;
?>