<?php 
include "koneksi.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

$FotoID = isset($_GET['id']) ? $_GET['id'] : null;

if ($FotoID === null) {
    die('Invalid or missing ID parameter.');
}

$stmt = $conn->query("SELECT foto.*, user.Username FROM foto LEFT JOIN user ON foto.UserID = user.UserID WHERE FotoID  = '$FotoID'");

$queryLike = $conn->query("SELECT COUNT(*) as JumlahLike FROM likefoto WHERE FotoID = '$FotoID'");


// Inisialisasi array $data
$data = array();

while ($row = $stmt->fetch_assoc()) {
    $data[0] = $row;
}

// Pemrosesan hasil query like
if ($queryLike) {
    // Ambil hasil penghitungan jumlah like
    $rowLike = $queryLike->fetch_assoc();
    
    // Hitung jumlah like dan tambahkan ke dalam array $data
    $JumlahLike = isset($rowLike['JumlahLike']) ? $rowLike['JumlahLike'] : 0;
    $data[0]['JumlahLike'] = $JumlahLike;

} else {
    // Handle kesalahan jika query like gagal
    echo "Error: " . $conn->error;
}

echo json_encode($data);

$stmt->close();

?>