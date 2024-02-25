<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); 
    $confirmPassword = $_POST['confirmPassword']; 
    $NamaLengkap = filter_var($_POST['nama_lengkap'], FILTER_SANITIZE_STRING);
    $Alamat = filter_var($_POST['alamat'], FILTER_SANITIZE_STRING);

    // Check if username already exists
    $stmt = $conn->prepare("SELECT * FROM user WHERE Username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 3 , 'message' => 'Username sudah ada.']);
        exit();
    }

    // Check if email already exists
    $stmt = $conn->prepare("SELECT * FROM user WHERE Email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 4 , 'message' => 'Email sudah ada/digunakan.']);
        exit();
    }

    // Check if passwords match
    if (!password_verify($confirmPassword, $password)) {
        echo json_encode(['success' => false, 'error' => 5 , 'message' => 'Passwords tidak sama.']);
        exit();
    }

    try {
            // Send a success response to the client
            $stmt = $conn->prepare("INSERT INTO user (Username, Email, Password, NamaLengkap, Alamat) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $username, $email, $password, $NamaLengkap, $Alamat);
        
            if($stmt->execute()){
                $response = ['success' => true];
                echo json_encode($response);
            }
        
    } catch (PDOException $e) {
        // Log the error message
        error_log('Error: ' . $e->getMessage());

        echo json_encode(['success' => false, 'error' => 2, 'message' => 'Failed to register user. Please try again.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 1, 'message' => 'Bad Request.']);
    exit();
}
?>
