<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if(isset($_GET['user_id'])){
    $userID = $_GET['user_id'];
    $query = "SELECT 
    album.*, 
    user.Username,  
    user.FileFoto AS UserFoto,
    (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID LIMIT 1) AS Foto1,
    CASE 
        WHEN (SELECT COUNT(*) FROM foto WHERE AlbumID = album.AlbumID) > 1 THEN
            (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID AND LokasiFileMin != (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID LIMIT 1) ORDER BY FotoID DESC LIMIT 1)
        ELSE
            NULL
    END AS Foto2
    FROM 
        album
    LEFT JOIN 
        user ON album.UserID = user.UserID
    WHERE  album.UserID = '1' 
    ORDER BY 
        album.created_at DESC;";
    $result = $conn->query($query);
    
    // Konversi hasil query ke format JSON
    $data = array();
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode($data);
}
?>