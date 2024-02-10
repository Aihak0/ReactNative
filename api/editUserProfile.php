<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    if($_POST['action'] == 'UpdateFoto'){
        $UserID = $_POST['UserID'];
        $uploadDirectory = '../public/assets/uploaded_profile/'; 
        $targetFile = $uploadDirectory . basename($_FILES['FileFoto']['name']);

        if (move_uploaded_file($_FILES['FileFoto']['tmp_name'], $targetFile)) {
            $sql = "UPDATE user SET 
            FileFoto = '$targetFile'
            WHERE UserID = '$UserID'
            ";
 
            $result = mysqli_query($conn, $sql);

            if ($result) {
                echo json_encode(array('success' => true, 'message' => 'Data Updated successfully.'));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Error Update data.'));
            }
        } else {
            
        echo json_encode(array('success' => false, 'message' => 'Error uploading file.'));
        }
    }else if($_POST['action'] == 'updateDetail'){
        $UserID = $_POST['UserID'];
        $NamaLengkap = $_POST['NamaLengkap'];
        $Username = $_POST['Username'];
        $Email = $_POST['Email'];
        $Alamat = $_POST['Alamat'];
    
            $sql = "UPDATE user SET 
                    NamaLengkap = '$NamaLengkap',
                    Username = '$Username',
                    Email = '$Email',
                    Alamat = '$Alamat'
                    WHERE UserID = '$UserID'
                    ";
            // Execute the SQL query (make sure to sanitize your input and use prepared statements)
            $result = mysqli_query($conn, $sql);
    
            if ($result) {
                echo json_encode(array('success' => true, 'message' => 'Data Updated successfully.'));
            } else {
                echo json_encode(array('success' => false, 'message' => 'Error Update data.'));
            }
    }
    
}
?>
