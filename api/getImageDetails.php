<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$FotoID = isset($_GET['id']) ? $_GET['id'] : null;

if ($FotoID === null) {
    // Handle the case where 'id' is not provided
    die('Invalid or missing ID parameter.');
}

$stmt = $conn->prepare("SELECT * FROM foto WHERE FotoID = ?");
$stmt->bind_param("s", $FotoID);
$stmt->execute();
$result = $stmt->get_result();

$data = array();
while ($row = $result->fetch_assoc()) {
    $data[] = $row;
}

echo json_encode($data);

$stmt->close();

?>