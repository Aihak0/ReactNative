<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if(isset($_GET['user_id'])){
    $userID = $_GET['user_id'];
    $query = "SELECT album.*, MIN(foto.LokasiFile) AS LokasiFile FROM album LEFT JOIN foto ON album.AlbumID = foto.AlbumID WHERE album.UserID = '$userID' GROUP BY album.AlbumID;";
    $result = $conn->query($query);
    
    // Konversi hasil query ke format JSON
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode($data);
}
?>