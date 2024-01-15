<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $JudulFoto = $_POST['JudulFoto'];
    $TanggalUnggah = $_POST['TanggalUnggah'];
    $AlbumID = $_POST['AlbumID'];
    $UserID = $_POST['UserID'];

    // File handling
    $uploadDirectory = '../public/assets/uploaded_image/'; // Adjust the destination folder as needed
    $targetFile = $uploadDirectory . basename($_FILES['fileFoto']['name']);

    if (move_uploaded_file($_FILES['fileFoto']['tmp_name'], $targetFile)) {
        // File moved successfully, now you can insert data into the database
        // You can use $targetFile to store the file path in the database if needed

        // Insert data into the database
        $sql = "INSERT INTO foto (JudulFoto, TanggalUnggah, AlbumID, UserID, LokasiFile) VALUES ('$JudulFoto', '$TanggalUnggah', '$AlbumID', '$UserID', '$targetFile')";
        // Execute the SQL query (make sure to sanitize your input and use prepared statements)
        $result = mysqli_query($conn, $sql);

        if ($result) {
            echo json_encode(array('success' => true, 'message' => 'Data inserted successfully.'));
        } else {
            echo json_encode(array('success' => false, 'message' => 'Error inserting data into the database.'));
        }
    } else {
        // Failed to move the file
        echo json_encode(array('success' => false, 'message' => 'Error uploading file.'));
    }
}
?>
