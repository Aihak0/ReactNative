<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if(isset($_GET['user_id'])){
    $userID = $_GET['user_id'];
    $query = "SELECT * FROM foto WHERE UserID = '$userID'";
    $result = $conn->query($query);
    
    // Konversi hasil query ke format JSON
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode($data);
}
?>