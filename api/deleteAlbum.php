<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Memeriksa apakah data DELETE telah diterima
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Memeriksa apakah fotoID telah diterima
    if (isset($_GET['id'])) {
        $AlbumID = $_GET['id'];

        $result = $conn->query("SELECT * FROM album WHERE AlbumID = '$AlbumID'");
        
        if ($result->num_rows > 0) {
          
            $deleteQuery = "DELETE FROM album WHERE AlbumID = '$AlbumID'";
            if ($conn->query($deleteQuery) === TRUE) {
                echo json_encode(['success' => true, 'message' => 'Berhasil menghapus Album']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Gagal menghapus Album']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'FotoID tidak ditemukan']);
        }
    } else {
        echo json_encode(array('success' => false, 'message' => "Data fotoID tidak valid"));
        
    }
} else {
    echo json_encode(array('success' => false, 'message' => "Metode request tidak valid"));
}

// Menutup koneksi
$conn->close();
?>
