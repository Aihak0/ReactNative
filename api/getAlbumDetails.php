<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$AlbumID = isset($_GET['id_album']) ? $_GET['id_album'] : null;

if ($AlbumID === null) {
    die('Invalid or missing ID parameter.');
}

$stmt = $conn->query("SELECT album.*, user.Username, user.FileFoto FROM album LEFT JOIN user ON album.UserID = user.UserID WHERE AlbumID  = '$AlbumID'");

$data = array();

while ($row = $stmt->fetch_assoc()) {
    $data[] = $row;
}


echo json_encode($data);

$stmt->close();

?>