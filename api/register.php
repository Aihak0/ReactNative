<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize and get user input from the form
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $password = password_hash($_POST['password'], PASSWORD_DEFAULT); 
    $NamaLengkap = filter_var($_POST['nama_lengkap'], FILTER_SANITIZE_STRING);
    $Alamat = filter_var($_POST['alamat'], FILTER_SANITIZE_STRING);

    // Insert user data into the database
    try {
        $stmt = $conn->prepare("INSERT INTO user (Username, Email, Password, NamaLengkap, Alamat) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", $username, $email, $password, $NamaLengkap, $Alamat);
    
        $stmt->execute();

        // Send a success response to the client
        $response = ['success' => true];
        echo json_encode($response);
    } catch (PDOException $e) {
        // Log the error message
        error_log('Error: ' . $e->getMessage());

        // Send an error response to the client with a more informative message
        header('HTTP/1.1 400 Bad Request');
        echo json_encode(['success' => false, 'error' => 'Failed to register user. Please try again.']);
    }
} else {
    // If the form is not submitted, send a Bad Request response to the client
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'error' => 'Bad Request.']);
    exit();
}
?>
