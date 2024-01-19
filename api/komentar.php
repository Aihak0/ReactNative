<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Menerima data dari frontend
$data = json_decode(file_get_contents('php://input'), true);
$komentar = $data['komentarSend'];
$userID = $data['userID'];
$fotoID = $data['fotoID'];
$tanggalKomentar = $data['tanggalKomentar'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

// Menyimpan komentar ke database
$sql = "INSERT INTO komentarfoto (IsiKomentar, FotoID, UserID, TanggalKomentar) VALUES ('$komentar', '$fotoID', '$userID', '$tanggalKomentar')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["message" => "Komentar berhasil disimpan ke database"]);
} else {
    echo json_encode(["message" => "Gagal menyimpan komentar ke database", "error" => $conn->error]);
}


}
$conn->close();
?>
