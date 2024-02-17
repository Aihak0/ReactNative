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
        date_default_timezone_set('Asia/Jakarta');
        // Mengambil waktu sekarang dalam zona waktu WIB
        $created_at = date('Y-m-d H:i:s');

        // Menyimpan komentar ke database
        $sql = "INSERT INTO komentarfoto (IsiKomentar, FotoID, UserID, TanggalKomentar, created_at) VALUES ('$komentar', '$fotoID', '$userID', '$tanggalKomentar', '$created_at')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Komentar berhasil disimpan ke database"]);
        } else {
            echo json_encode(["message" => "Gagal menyimpan komentar ke database", "error" => $conn->error]);
        }


    }
$conn->close();
?>
