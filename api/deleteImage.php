<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Memeriksa apakah data DELETE telah diterima
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Memeriksa apakah fotoID telah diterima
    if (isset($_GET['id'])) {
        $fotoID = $_GET['id'];

        $result = $conn->query("SELECT * FROM foto WHERE FotoID = '$fotoID'");
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            $lokasiFile = $row['LokasiFile'];
            $lokasiFileMin = $row['LokasiFileMin'];

            // Menghapus berkas fisik dari server
            if (file_exists($lokasiFile) || file_exists($lokasiFileMin)) {

                if (file_exists($lokasiFile) && unlink($lokasiFile)) {
                    $deletedFiles[] = $lokasiFile;
                }
            
                if (file_exists($lokasiFileMin) && unlink($lokasiFileMin)) {
                    $deletedFiles[] = $lokasiFileMin;
                }

                if (count($deletedFiles) > 0) {
                    $deleteQuery = "DELETE FROM foto WHERE FotoID = '$fotoID'";
                    if ($conn->query($deleteQuery) === TRUE) {
                        echo json_encode(['success' => true, 'message' => 'Berhasil menghapus foto']);
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Gagal menghapus data dari database']);
                    }
                } else {
                    echo json_encode(['success' => false, 'message' => "Gagal menghapus kedua berkas."]);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Gagal menghapus berkas fisik']);
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
