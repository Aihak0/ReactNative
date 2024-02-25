<?php
include "koneksi.php";

session_start();

// Check if verification token exists and if it's not expired
if(isset($_GET['token']) && isset($_SESSION['verification_token']) && isset($_SESSION['verification_time'])) {
    $token = $_GET['token'];
    $stored_token = $_SESSION['verification_token'];
    $token_time = $_SESSION['verification_time'];

    if($token === $stored_token && (time() - $token_time) <= 120) {
        if(isset($_GET['email'])) {
            $email = $_GET['email'];
            
            $stmt = $conn->prepare("SELECT * FROM user WHERE Email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
        
            if($result->num_rows == 1) {

                $row = $result->fetch_assoc();
                $userId = $row['UserID']; // Ganti dengan nama kolom yang sesuai di tabel pengguna Anda
                $stmt = $conn->prepare("UPDATE user SET verify = 1 WHERE UserID = ?");
                $stmt->bind_param("i", $userId);
                $stmt->execute();
                
                echo "Email has been verified successfully.";
                unset($_SESSION['verification_token']);
                unset($_SESSION['verification_time']);
            } else {
                echo "Invalid email or email has already been verified.";
            }
        } else {
            // Jika tidak ada parameter email yang diberikan di URL
            echo "Invalid request.";
        }
    } else {
        echo 'sudah melebihi 2 menit';
    }
} else {
    echo 'request tidak ditemukan';
}


?>
