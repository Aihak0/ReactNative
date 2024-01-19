<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $fotoID = $_GET['id'];
    $query = "SELECT komentarfoto.*, user.Username FROM komentarfoto JOIN user ON komentarfoto.UserID = user.UserID WHERE FotoID = '$fotoID'";
    $result = $conn->query($query);
    
    // Konversi hasil query ke format JSON
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode($data);
}
?>