<?php
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: *");
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$token = bin2hex(random_bytes(16)); 

$_SESSION['verification_token'] = $token;
$_SESSION['verification_time'] = time();

if(isset($_POST['Email'])){
    $email = filter_var($_POST['Email'], FILTER_SANITIZE_EMAIL);
    $NamaLengkap = filter_var($_POST['NamaLengkap'], FILTER_SANITIZE_STRING);
    
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = 0;               
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
    $mail->Username   = 'soulhunter0616@gmail.com';                     //SMTP username
    $mail->Password   = 'alcpvvzxwgdoptse';                               //SMTP password
    $mail->SMTPSecure =  PHPMailer::ENCRYPTION_STARTTLS;            //Enable implicit TLS encryption
    $mail->Port       = 587;  
    
    $mail->setFrom('soulhunter0616@gmail.com', 'Vima');
    $mail->addAddress($email, $NamaLengkap);
    $mail->isHTML(true);
    $mail->Subject = 'Email Verification';
    $mail->Body    = 'Please click the following link to verify your email: <a href="http://localhost/GALERY-VITE/api/verify.php?email=' . urlencode($email) . '">Verify Email</a>';
    $mail->AltBody = 'Please click the following link to verify your email: http://localhost/GALERY-VITE/api/verify.php?email=' . urlencode($email);
        if(!$mail->send()) {
            echo json_encode(['success' => false, 'error' => 2, 'message' => 'Gagal mengirim vrifikasi email.']);
            exit();
        } else {
            echo json_encode(['success' => true]);
        }

}else{
    echo json_encode(['success' => false, 'error' => 1, 'message' => 'Email tidak terdefiinisi.'.$_POST['Email']]);
}




?>