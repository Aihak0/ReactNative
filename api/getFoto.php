<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if($_SERVER['REQUEST_METHOD'] === 'GET'){
    //All
    $queryAll = "SELECT foto.*, user.Username, user.FileFoto, COALESCE(like_counts.JumlahLike, 0) AS JumlahLike, COALESCE(komentar_counts.JumlahKomentar, 0) AS JumlahKomentar
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
    ) komentar_counts ON foto.FotoID = komentar_counts.FotoID ";
    $resultAll = $conn->query($queryAll);

    $data['all'] = array(); // Initialize as an empty array
    while ($row = $resultAll->fetch_assoc()) {
        $data['all'][] = $row; // Store each row in an array under 'all' key
    }

    //Most Like
    $queryFav = "SELECT foto.*, user.Username,  user.FileFoto, COALESCE(like_counts.JumlahLike, 0) AS JumlahLike, COALESCE(komentar_counts.JumlahKomentar, 0) AS JumlahKomentar
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
        ) komentar_counts ON foto.FotoID = komentar_counts.FotoID
        ORDER BY JumlahLike DESC LIMIT 20;
    ";

    $resultFav = $conn->query($queryFav);
        
    $data['fav'] = array(); // Initialize as an empty array
    while ($row = $resultFav->fetch_assoc()) {
        $data['fav'][] = $row; // Store each row in an array under 'fav' key
    }
    //Album
    $queryAlbum = "SELECT 
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
                WHERE 
                    (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID LIMIT 1) IS NOT NULL OR 
                    (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID AND LokasiFileMin != (SELECT LokasiFileMin FROM foto WHERE AlbumID = album.AlbumID LIMIT 1) ORDER BY FotoID DESC LIMIT 1) IS NOT NULL
                ORDER BY 
                    album.TanggalDibuat DESC;
            

    ";

    $resultAlbum = $conn->query($queryAlbum);
        
    $data['album'] = array(); // Initialize as an empty array
    while ($row = $resultAlbum->fetch_assoc()) {
        $data['album'][] = $row; // Store each row in an array under 'fav' key
    }

    echo json_encode($data);
}
?>
