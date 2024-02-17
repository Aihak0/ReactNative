<?php 
include "koneksi.php";

// Set header untuk mengizinkan akses dari berbagai sumber
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: *");

// Ambil data dari query string
$FotoID = isset($_GET['id']) ? $_GET['id'] : null;
$UserID = isset($_GET['UserID']) ? $_GET['UserID'] : null;
$action = isset($_GET['action']) ? $_GET['action'] : null;

if ($FotoID === null) {
    echo json_encode(['error' => true, 'message' => "Invalid or missing ID parameter."]);
    exit();
}

if($action === 'getDetailEditFoto'){
    if ($UserID === null) {
        echo json_encode(['error' => true, 'message' => "Anda Belum Login."]);
        exit();
    }
    
    // Lakukan query untuk mendapatkan detail foto berdasarkan FotoID
    $stmt = $conn->prepare("SELECT foto.*, user.Username FROM foto LEFT JOIN user ON foto.UserID = user.UserID WHERE FotoID = ?");
    $stmt->bind_param("i", $FotoID);
    $stmt->execute();
    $result = $stmt->get_result();
    
    // Inisialisasi array data
    $data = array();
    
    // Periksa apakah foto ditemukan
    if ($result->num_rows > 0) {
        // Jika ditemukan, ambil data foto
        $row = $result->fetch_assoc();
    
        // Periksa apakah UserID yang diberikan sama dengan UserID yang memiliki foto
        if ($row['UserID'] == $UserID) {
            // Lakukan query untuk menghitung jumlah like pada foto yang dimaksud
            $queryLike = $conn->query("SELECT COUNT(*) as JumlahLike FROM likefoto WHERE FotoID = '$FotoID'");
    
            // Inisialisasi array data
            $data = array();
    
            // Tambahkan data foto ke dalam array
            $data[] = $row;
    
            // Pemrosesan hasil query like
            if ($queryLike) {
                // Ambil hasil penghitungan jumlah like
                $rowLike = $queryLike->fetch_assoc();
                
                // Hitung jumlah like dan tambahkan ke dalam array data
                $JumlahLike = isset($rowLike['JumlahLike']) ? $rowLike['JumlahLike'] : 0;
                $data[0]['JumlahLike'] = $JumlahLike;
    
            } else {
                // Handle kesalahan jika query like gagal
                echo json_encode(['error' => true, 'message' => "Error: " . $conn->error]);
                exit();
            }
    
            // Keluarkan data dalam format JSON
            echo json_encode($data);
        } else {
            // Jika UserID tidak sesuai dengan pemilik foto, keluarkan pesan kesalahan
            echo json_encode(['error' => '2', 'message' => "Anda Tidak Berhak Mengakses ini."]);
        }
    } else {
        // Jika foto tidak ditemukan, keluarkan pesan kesalahan
        echo json_encode(['error' => '1', 'message' => "Gambar Tidak Ditemukan."]);
    }
    $stmt->close();
}else{
    $stmt = $conn->query("SELECT foto.*, user.Username, user.FileFoto FROM foto LEFT JOIN user ON foto.UserID = user.UserID WHERE FotoID  = '$FotoID'");
    
    if ($stmt->num_rows > 0) {
        $queryLike = $conn->query("SELECT COUNT(*) as JumlahLike FROM likefoto WHERE FotoID = '$FotoID'");
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
        
        
    }else{
        // Jika foto tidak ditemukan, keluarkan pesan kesalahan
        echo json_encode(['error' => '1', 'message' => "Gambar Tidak Ditemukan."]);
    }
    $stmt->close();
    
}


$conn->close();
?>
