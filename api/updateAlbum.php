<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Memeriksa apakah data DELETE telah diterima
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

        $fotoID = $_POST['FotoID'];
        $albumID = $_POST['AlbumID'];

        $result = $conn->query("UPDATE foto SET AlbumID = '$albumID' WHERE FotoID = '$fotoID'");
        
        if ($result) {

            echo json_encode(['success' => true, 'message' => 'Berhasil Tambah Album']);

        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal']);
        }
} else {
    echo json_encode(array('success' => false, 'message' => "Metode request tidak valid"));
}

// Menutup koneksi
$conn->close();
?>
