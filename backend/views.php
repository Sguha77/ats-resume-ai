<?php
header("Content-type: image/svg+xml");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

$file = "views.txt";
$count = file_exists($file) ? (int)file_get_contents($file) + 1 : 1;
file_put_contents($file, $count);

function shortNumber($num) {
  $units = ['', 'K', 'M', 'B', 'T'];
  for ($i = 0; $num >= 1000; $i++) $num /= 1000;
  return round($num, 1) . $units[$i];
}

$url = "https://img.shields.io/static/v1?" . http_build_query([
  "label" => "Visitors",
  "message" => shortNumber($count),
  "color" => "blueviolet",
  "style" => "for-the-badge"
]);

echo file_get_contents($url);
?>
