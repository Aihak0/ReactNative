<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$userID = $_GET['userID'];
$fotoID = $_GET['fotoID'];

$stmt = $conn->prepare("SELECT COUNT(*) as count FROM likefoto WHERE userID = ? AND fotoID = ?");
$stmt->bind_param("ss", $userID, $fotoID);

// Eksekusi pernyataan SQL
$stmt->execute();
$result = $stmt->get_result();
$row = $result->fetch_assoc();

// Kirim hasil ke frontend
echo json_encode(array("hasLiked" => $row['count'] > 0));

// Tutup pernyataan dan koneksi
$stmt->close();
$conn->close();
?>