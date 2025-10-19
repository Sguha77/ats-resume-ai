<?php
header("Content-type: image/svg+xml");
header("Cache-Control: no-cache, must-revalidate");
header("Pragma: no-cache");

$file = "resumes.txt";
$count = file_exists($file) ? (int)file_get_contents($file) : 0;

function shortNumber($num) {
  $units = ['', 'K', 'M', 'B', 'T'];
  for ($i = 0; $num >= 1000; $i++) $num /= 1000;
  return round($num, 1) . $units[$i];
}

$url = "https://img.shields.io/static/v1?" . http_build_query([
  "label" => "Resumes Analyzed",
  "message" => shortNumber($count),
  "color" => "green",
  "style" => "for-the-badge"
]);

echo file_get_contents($url);
?>
