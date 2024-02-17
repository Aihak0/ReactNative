<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $NamaAlbum = $_POST['NamaAlbum'];
    $Deskripsi = $_POST['Deskripsi'];
    $TanggalDibuat = $_POST['TanggalDibuat'];
    $UserID = $_POST['UserID'];
    date_default_timezone_set('Asia/Jakarta');
    $created_at = date('Y-m-d H:i:s');

        $sql = "INSERT INTO album (NamaAlbum, Deskripsi, TanggalDibuat, UserID, created_at) VALUES ('$NamaAlbum', '$Deskripsi', '$TanggalDibuat', '$UserID', '$created_at')";

        $result = mysqli_query($conn, $sql);

        if ($result) {
            echo json_encode(array('success' => true, 'message' => 'Data inserted successfully.'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error inserting data into the database.'));
        }
}else{
    echo json_encode(array('success' => true, 'message' => 'goblok.'));
}
?>
