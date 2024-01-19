<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Ambil data dari permintaan POST
$data = json_decode(file_get_contents("php://input"));

// Pastikan data yang diperlukan ada
if (!empty($data->userID) && !empty($data->fotoID) && !empty($data->tanggalLike)) {

    // Tentukan apakah akan menambah atau mengurangi berdasarkan method
    $query = ($_SERVER['REQUEST_METHOD'] === 'POST') 
        ? "INSERT INTO likefoto (UserID, FotoID, TanggalLike) VALUES (?, ?, ?)"
        : "DELETE FROM likefoto WHERE UserID = ? AND FotoID = ?";

    // Persiapkan pernyataan SQL
    $stmt = $conn->prepare($query);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $stmt->bind_param("sss", $data->userID, $data->fotoID, $data->tanggalLike);
    } else {
        $stmt->bind_param("ss", $data->userID, $data->fotoID);
    }

    // Eksekusi pernyataan SQL
    if ($stmt->execute()) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            echo json_encode(array("message" => "Liked"));
        } else {
            echo json_encode(array("message" => "Unliked"));
        }
    } else {
        echo json_encode(array("error" => "Terjadi kesalahan saat menyimpan/hapus data."));
    }

    // Tutup pernyataan dan koneksi
    $stmt->close();
    $conn->close();
} else {
    echo json_encode(array("error" => "Data tidak lengkap."));
}
?>
