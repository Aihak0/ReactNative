<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $sqlFotoID = "SELECT FotoID FROM foto ORDER BY FotoID DESC LIMIT 1";
    $resultFotoID = $conn->query($sqlFotoID);

    // Mendapatkan FotoID terakhir
    if ($resultFotoID->num_rows > 0) {
        $row = $resultFotoID->fetch_assoc();
        $lastFotoID = $row["FotoID"];
        $FotoID = $lastFotoID + 1;
    } else {
        $FotoID = 1;
    }


    $JudulFoto = $_POST['JudulFoto'];
    $TanggalUnggah = $_POST['TanggalUnggah'];
    $DeskripsiFoto = $_POST['DeskripsiFoto'];
    $AlbumID = $_POST['AlbumID'];
    $UserID = $_POST['UserID'];
    date_default_timezone_set('Asia/Jakarta');
    $created_at = date('Y-m-d H:i:s');

    // File handling
    $uploadDirectory = '../public/assets/uploaded_image/'; // Adjust the destination folder as needed
    $uploadMinDirectory = '../public/assets/uploaded_image_min/';

    $targetFile = $uploadDirectory . basename($_FILES['fileFoto']['name']);

    $extension = pathinfo($_FILES['fileFoto']['name'], PATHINFO_EXTENSION);
    $newFileName = 'image_' . $FotoID . '_' . $UserID . '.' . $extension;
    $newTargetFile = $uploadDirectory . $newFileName;

    if (move_uploaded_file($_FILES['fileFoto']['tmp_name'], $newTargetFile)) {
        list($width, $height) = getimagesize($newTargetFile);

        $desiredQuality = 50; 

        $imageInfo = getimagesize($newTargetFile);
        $mime = $imageInfo['mime'];
    
        // Memuat gambar ke memori berdasarkan jenisnya
        switch ($mime) {
            case 'image/jpeg':
                $image = imagecreatefromjpeg($newTargetFile);
                break;
            case 'image/png':
                $image = imagecreatefrompng($newTargetFile);
                break;
            // Anda dapat menambahkan kasus lain sesuai dengan jenis gambar yang didukung
            default:
                die('Format gambar tidak didukung');
        }

        $fileName = 'resized_image_' . $newFileName;

        $newResizedImage = $uploadMinDirectory . $fileName;

        $resizedImage = imagescale($image, $width / 2, $height / 2);
      
        
        if(imagejpeg($resizedImage, $newResizedImage , $desiredQuality)){
            $sql = "INSERT INTO foto (JudulFoto, TanggalUnggah, DeskripsiFoto, AlbumID, UserID, LokasiFile, LokasiFileMin, width, height, created_at) VALUES ('$JudulFoto', '$TanggalUnggah', '$DeskripsiFoto', '$AlbumID', '$UserID', '$newTargetFile', '$newResizedImage', '$width', '$height', '$created_at')";
            // Execute the SQL query (make sure to sanitize your input and use prepared statements)
            $result = mysqli_query($conn, $sql);
    
            if ($result) {
                echo json_encode(array('success' => true, 'message' => 'Data inserted successfully.'));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Error inserting data into the database.'));
            }
            imagedestroy($image);
            imagedestroy($resizedImage);
        }else{
            echo json_encode(array('success' => false, 'message' => 'Error Resizing.'));
        }


    } else {
        // Failed to move the file
        echo json_encode(array('success' => false, 'message' => 'Error uploading file.'));
    }
}
?>
