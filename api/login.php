<?php
session_start();
include "koneksi.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // For handling preflight requests
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = filter_var($_POST['username'], FILTER_SANITIZE_STRING);
    $password = $_POST['password']; // Note: Password should not be sanitized, as it may contain special characters

    try {
        $stmt = $conn->prepare("SELECT * FROM user WHERE Username = ?");
        $stmt->bind_param("s", $username);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if ($user && password_verify($password, $user['Password'])) {
                // Successful login
                $_SESSION['UserID'] = $user['UserID'];
                $_SESSION['Username'] = $user['Username'];
                $response = ['success' => true, 'message' => 'Login successful!', 'id' => $user['UserID']];
                echo json_encode($response);
            } else {
                // Invalid credentials
                $response = ['success' => false, 'error' => 'Invalid username or password'];
                echo json_encode($response);
            }
        } else {
            // User not found
            $response = ['success' => false, 'error' => 'User not found'];
            echo json_encode($response);
        }

        $stmt->close();
    } catch (Exception $e) {
        // Log the error message
        error_log('Error: ' . $e->getMessage());

        // Send an error response to the client with a more informative message
        header('HTTP/1.1 500 Internal Server Error');
        echo json_encode(['success' => false, 'error' => 'Failed to process login. Please try again.']);
    }
} else {
    // If the request method is not POST, send a Bad Request response to the client
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['success' => false, 'error' => 'Bad Request.']);
    exit();
}
?>
