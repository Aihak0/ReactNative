<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Memeriksa apakah fotoID telah diterima
    if (isset($_GET['id'])) {
        $KomentarID = $_GET['id'];
        if(isset($_GET['UserID'])){
            $UserID = $_GET['UserID'];
    
            $result = $conn->query("SELECT * FROM komentarfoto WHERE KomentarID = '$KomentarID'");
            
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();

                if($row['UserID'] === $UserID){
                    $deleteQuery = "DELETE FROM komentarfoto WHERE KomentarID = '$KomentarID'";
                       if ($conn->query($deleteQuery) === TRUE) {
                           echo json_encode(['success' => true, 'message' => 'Berhasil menghapus']);
                       } else {
                           echo json_encode(['success' => false, 'message' => 'Gagal menghapus']);
                       }
                }else{
                    echo json_encode(array('error' => 1, 'message' => "Anda Tidak berhak mengakses ini"));
                }

            } else {
                echo json_encode(['success' => false, 'message' => 'Komentar tidak ditemukan']);
            }
        }else{
            echo json_encode(array('error' => 0, 'message' => "Anda belum login"));
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
