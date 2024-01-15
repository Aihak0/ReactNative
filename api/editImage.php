<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Memeriksa apakah data POST telah diterima
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mendapatkan data yang dikirimkan melalui metode POST
    $fotoID = $_POST['FotoID'];
    $judulFoto = $_POST['JudulFoto'];
    $tanggalUnggah = $_POST['TanggalUnggah'];
    $albumID = $_POST['AlbumID'];
    $userID = $_POST['UserID'];

    // Menyiapkan dan mengeksekusi query SQL untuk mengupdate data
    $sql = "UPDATE foto SET JudulFoto='$judulFoto', TanggalUnggah='$tanggalUnggah', AlbumID=$albumID, UserID=$userID WHERE FotoID=$fotoID";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(array('success' => true, 'message' => 'Berhasil.'));
    } else {
        echo json_encode(array('success' => false, "Error: " . $sql . "<br>" . $conn->error));
    }
} else {
    echo json_encode(array('success' => false, 'message' => "Metode request tidak valid"));
}

// Menutup koneksi
$conn->close();
?>
