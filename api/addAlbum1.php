<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $NamaAlbum = $_POST['NamaAlbum'];
    $Deskripsi = $_POST['Deskripsi'];
    $TanggalDibuat = $_POST['TanggalDibuat'];
    $UserID = $_POST['UserID'];

        $sql = "INSERT INTO album (NamaAlbum, Deskripsi, TanggalDibuat, UserID) VALUES ('$NamaAlbum', '$Deskripsi', '$TanggalDibuat', '$UserID')";

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
