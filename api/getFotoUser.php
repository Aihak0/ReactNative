<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if(isset($_GET['user_id'])){
    $userID = $_GET['user_id'];
    $query = "SELECT foto.*, user.Username, user.FileFoto, COALESCE(like_counts.JumlahLike, 0) AS JumlahLike, COALESCE(komentar_counts.JumlahKomentar, 0) AS JumlahKomentar
    FROM foto
    LEFT JOIN user ON foto.UserID = user.UserID
    LEFT JOIN (
      SELECT FotoID, COUNT(LikeID) AS JumlahLike
      FROM likefoto
      GROUP BY FotoID
    ) like_counts ON foto.FotoID = like_counts.FotoID
    LEFT JOIN (
      SELECT FotoID, COUNT(KomentarID) AS JumlahKomentar
      FROM komentarfoto
      GROUP BY FotoID
    ) komentar_counts ON foto.FotoID = komentar_counts.FotoID WHERE foto.UserID = '$userID'";
    $result = $conn->query($query);
    
    // Konversi hasil query ke format JSON
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode($data);
}
?>