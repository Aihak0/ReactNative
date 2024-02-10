<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$UserID = isset($_GET['user_id']) ? $_GET['user_id'] : null;

if ($UserID === null) {
    die('Invalid or missing ID parameter.');
}

$stmt = $conn->query("SELECT * FROM user WHERE UserID  = '$UserID'");


$data = array();

while ($row = $stmt->fetch_assoc()) {
    $data[0] = $row;
}


echo json_encode($data);

$stmt->close();

?>