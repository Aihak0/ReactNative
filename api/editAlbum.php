<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$AlbumID = $_POST['AlbumID'];
$NamaAlbum = $_POST['NamaAlbum'];
$Deskripsi = $_POST['Deskripsi'];

    $sql = "UPDATE album SET 
            NamaAlbum = '$NamaAlbum',
            Deskripsi = '$Deskripsi'
            WHERE AlbumID = '$AlbumID'
            ";
    $result = mysqli_query($conn, $sql);

    if ($result) {
        echo json_encode(array('success' => true, 'message' => 'Data Updated successfully.'));
    } else {
        echo json_encode(array('success' => false, 'message' => 'Error Update data.'));
    }
?>