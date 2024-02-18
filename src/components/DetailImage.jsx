import "./style.css";
import { Link,useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import { RxPaperPlane } from "react-icons/rx";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import Swal from 'sweetalert2';
import moment from 'moment-timezone';


const DetailImage = () => {
    const { id: imageId } = useParams();
    const [isChecked, setIsChecked] = useState(false);
    const { isLoggedIn } = useAuth();
    const userID = sessionStorage.getItem('UserID') || 0;
    const [komentar, setKomentar] = useState([]);
    const navigate = useNavigate();
    const [komentarSend, setKomentarSend] = useState('');
    const [imageHeight, setImageHeight] = useState(0);

    const [user, setUser] = useState({
      UserID:0,
      Username: 'Unnamed',
      FileFoto: null,
      Email: '',
      NamaLengkap: '',
      Alamat: '',
    });

    const [imageData, setImageData] = useState({
      FotoID:'',
      JudulFoto: 'Unnamed',
      DeskripsiFoto: null,
      TanggalUnggah: '0-0-0',
      created_at: '',
      height:0,
      width:0,
      AlbumID: 0,
      UserID: 0,
      JumlahLike: 0,
      Username: 'unknown'
    });
    
    function formatNumber(num) {
      if (num >= 1000 && num < 1000000) {
          return (num / 1000).toFixed(1) + 'k';
      }else  if(num >= 1000000){
        return (num / 1000000).toFixed(1) + 'M';
      }
      return num;
  }
    function formatTime(time){
      moment.tz.setDefault('Asia/Jakarta');

      // Mendapatkan waktu saat ini dalam zona waktu WIB
      const waktuKomentar = time; // Ganti dengan waktu komentar yang diterima dari server atau dari sumber lain
      const waktuSekarang = moment();
      const waktuKomentarFormatted = moment(waktuKomentar);
      const selisih = waktuSekarang.diff(waktuKomentarFormatted, 'seconds');
  
      // Format waktu relatif
      let waktuRelative;
      if (selisih < 60) {
        waktuRelative = "baru saja";
      } else if (selisih < 3600) {
        waktuRelative = Math.floor(selisih / 60) + " menit yang lalu";
      } else if (selisih < 86400) {
        waktuRelative = Math.floor(selisih / 3600) + " jam yang lalu";
      } else if (selisih < 604800) {
        waktuRelative = Math.floor(selisih / 86400) + " hari yang lalu";
      } else if (selisih < 2592000) {
        waktuRelative = Math.floor(selisih / 604800) + " minggu yang lalu";
      } else if (selisih < 31536000) {
        waktuRelative = Math.floor(selisih / 2592000) + " bulan yang lalu";
      } else {
        waktuRelative = Math.floor(selisih / 31536000) + " tahun yang lalu";
      }
  
      // Menyimpan waktu dalam state
      return waktuRelative;
  

    }
  
    
    const fetchImageDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getImageDetails.php?id=${imageId}`);

        if (response.data.error) {
          Swal.fire({
            icon: 'warning',
            title: response.data.error === "1" ? 'Hmm?' : null,
            width: 400,
            text: response.data.message,
            backdrop: `
              rgba(0,0,123,0.4)
              url(${response.data.error === "1" ? "../../public/shocked-surprised.gif" : null})
              top
            `,
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate('/');
            }
          });
          
          
        } else{
          const imageDataFromApi = response.data;
  
          console.log(response.data);
          
          // Pilih data yang sesuai dengan FotoID jika ada, atau gunakan data dengan kunci 0 jika FotoID kosong
          const selectedImageData = imageDataFromApi.FotoID ? imageDataFromApi[imageDataFromApi.FotoID] : imageDataFromApi[0];
    
          // Set state dengan data yang dipilih
          setImageData(prevImageData => ({ ...prevImageData, ...selectedImageData }));
          
        }
        
      } catch (error) {
        console.error('Error fetching image details:', error);
      }
    };
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost/GALERY-VITE/api/getProfileDetail.php?user_id=${userID}`);
        const userDataFromApi = response.data;
        const selectedUserData = userDataFromApi.UserID ? userDataFromApi[userDataFromApi.UserID] : userDataFromApi[0];
  
        setUser(prevUserData => ({ ...prevUserData, ...selectedUserData }));
        
      } catch (error) {
        console.error('Error fetching User:', error);
      }
    };


    
  // Fungsi untuk memeriksa status like sebelumnya dari backend
    const checkPreviousLike = () => {

        // Mengirim permintaan ke backend untuk memeriksa status like sebelumnya
        fetch(`http://localhost/GALERY-VITE/api/checklike.php?userID=${userID}&fotoID=${imageId}`)
        .then(response => response.json())
        .then(data => {
            setIsChecked(data.hasLiked); // Mengatur status checkbox berdasarkan hasil pemeriksaan
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
        });
    };

    
    
    

    const handleLike = () => {
        const fotoID = imageData.FotoID; // Gantilah dengan nilai yang sesuai
        const tanggalLike = new Date().toISOString(); // Mendapatkan tanggal saat ini dalam format ISO
      
        // Menentukan apakah akan menambah atau mengurangi berdasarkan status saat ini
        const method = isChecked ? 'DELETE' : 'POST';
      
        // Mengirim data ke backend untuk disimpan di tabel "likefoto"
        fetch(`http://localhost/GALERY-VITE/api/likefoto.php`, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userID,
            fotoID,
            tanggalLike,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Data berhasil disimpan/hapus:', data);
            setIsChecked(!isChecked); // Mengubah status checkbox
      
            // Periksa pesan respons dari server (pastikan menyesuaikan dengan struktur respons aktual)
            if (data.message === 'Liked') {
              setImageData(prevImageData => ({
                ...prevImageData,
                JumlahLike: Number(prevImageData.JumlahLike) + 1,
              }));
            } else if (data.message === 'Unliked') {
              setImageData(prevImageData => ({
                ...prevImageData,
                JumlahLike: Number(prevImageData.JumlahLike) - 1,
              }));
            }
          })
          .catch(error => {
            console.error('Terjadi kesalahan:', error);
          });
      };

      const handleKirimKomentar = async () => {
        const tanggalKomentar = new Date().toISOString();
        const fotoID = imageData.FotoID;
        console.log("komentarSend:"+ komentarSend);
        console.log("userid:"+ userID);
        console.log("fotoid:"+ fotoID);
        console.log("tanggalKomentar:"+ tanggalKomentar);
        try {
          const response = await fetch('http://localhost/GALERY-VITE/api/komentar.php', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              komentarSend,
              userID,
              fotoID,
              tanggalKomentar,
            }),
          });
          
          if (response.ok) {
            console.log('Komentar berhasil dikirim ke server PHP');
            setKomentarSend('');
            fetchKomentar();
          } else {
            console.error('Gagal mengirim komentar ke server PHP');
          }
        } catch (error) {
          console.error('Terjadi kesalahan:', error.message);
        }
      };

      const fetchKomentar = async () => {
        try {
          const response = await axios.get(`http://localhost/GALERY-VITE/api/getKomentar.php?id=${imageId}`);
          setKomentar(response.data);
        } catch (error) {
          console.error('Error fetching images:', error);
        }
      };

      const handleConfirmDelete = (KomentarID) => {
        Swal.fire({
          title: 'Apakah Anda yakin menghapus?'+ KomentarID,
          text: "Anda tidak akan dapat mengembalikan ini!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Batal'
        }).then(async (result) => {
          if (result.isConfirmed) {
            await handleDeleteKomen(KomentarID);
          }
        });
      };
    
      const handleDeleteKomen = async (KomentarID) => {
        try {
          const response = await axios.post(`http://localhost/GALERY-VITE/api/deleteKomentar.php?id=${KomentarID}&UserID=${userID}`);
          if (response.data.success) {
            Swal.fire({
              icon: 'success',
              title: 'Berhasil',
              text: 'Berhasil Menghapus!',
            }).then((result) => {
              if (result.isConfirmed || result.isDismissed) {
                fetchKomentar();
              }
            });
          } else if (response.data.error){
            Swal.fire({
              icon: 'warning',
              title: response.data.error === "1" ? 'Hmm?' : null,
              width: 400,
              text: response.data.message,
              backdrop: `
                rgba(0,0,123,0.4)
                url(${response.data.error === "1" ? "../../public/shocked-surprised.gif" : null})
                top
              `,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                navigate('/');
              }
            });
          }else{
            console.error('Response:', response.data);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.data.message,
            });
          }
        } catch (error) {
         
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menghapus gambar.',
          });
          console.error('Error inserting data:', error);
        }
      };
    
  
      // Gunakan useEffect untuk memanggil fungsi checkPreviousLike saat komponen dimuat
      useEffect(() => {
        const img = document.getElementById('mainImage');
        if (img) {
          setImageHeight(img.clientHeight);
        }
        fetchUser();
        fetchImageDetails();
          checkPreviousLike();
          fetchKomentar();
      }, []);
      return(
      <div className='row mb-3'  style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center',  padding: '20px' }}>
          <div className='col'>
              <img
                  src={imageData.LokasiFile ? imageData.LokasiFile : '../../assets/select-image.jpeg'}
                  id="preview-image"
                  alt="Preview"
                  className="border border-secondary rounded mainImage"
                  style={{ width: '100%' }}
                  onLoad={(e) => setImageHeight(e.target.clientHeight)} 
              />
          </div>
          <div className='col' style={{  display: "flex",
            flexFlow: "column",height:imageHeight}}>
              <div className="border-bottom px-3 mb-3">
                  <div className="d-flex mb-3">
                      <div className="col">
                          <h4 className="">{imageData.JudulFoto} </h4>
                      </div>
                      <div className="align-items-center">
                          <p className="blockquote-footer m-0">{formatTime(imageData.created_at)}</p>
                      </div>
                  </div>
                  <div className="mb-3">
                    <p>{imageData.DeskripsiFoto}</p>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                      <div className="col">
                          <Link to="#" className="profile link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <img src={imageData.FileFoto ? imageData.FileFoto : "../../public/profile.jpg"} alt="Profile" style={{ marginRight: '5px' }} />
                              <p className="text-dark" style={{ margin: '0', fontSize: '14px', marginLeft: '5px' }}>{imageData.Username}</p>
                          </Link>
                      </div>
                      <div className="text-right">
                          <div className="d-flex align-items-center ">
                              <div className="col">
                                  <span className="badge rounded-pill text-bg-light" style={{ top: "50%", width: "100%", margin: 0, textAlign: "center", fontSize: "18px" }}>❤️{formatNumber(imageData.JumlahLike)}</span>
                              </div>
                              {isLoggedIn && (
                                  <>
                                      <div className="heart-bungkus ms-3">
                                          <div className="heart-container" title="Like">
                                              <input type="checkbox" className="checkbox" id="Give-It-An-Id" checked={isChecked} onChange={handleLike} />
                                              <div className="svg-container">
                                                  <svg viewBox="0 0 24 24" className="svg-outline" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z">
                                                      </path>
                                                  </svg>
                                                  <svg viewBox="0 0 24 24" className="svg-filled" xmlns="http://www.w3.org/2000/svg">
                                                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z">
                                                      </path>
                                                  </svg>
                                                  <svg className="svg-celebrate" width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                                                      <polygon points="10,10 20,20"></polygon>
                                                      <polygon points="10,50 20,50"></polygon>
                                                      <polygon points="20,80 30,70"></polygon>
                                                      <polygon points="90,10 80,20"></polygon>
                                                      <polygon points="90,50 80,50"></polygon>
                                                      <polygon points="80,80 70,70"></polygon>
                                                  </svg>
                                              </div>
                                          </div>
                                      </div>
                                  </>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
              <div style={{flex: "1 1 auto", overflowY: 'auto', minHeight:"150px"}}>
              <h6 className="mx-2">{komentar.length} Komentar</h6>
              {komentar.length === 0 ? (
                <p className="text-center">Belum ada komentar.</p>
              ) : (
                <>
                  {komentar.map((komen) => (
                    <div key={komen.KomentarID} className="border-0 card  p-0" style={{height:"60.19px"}}>
                        <div className="card-body p-2">
                          <div className="d-flex flex-start">
                            <img className="rounded-circle border me-3"
                              src={komen.FileFoto ? komen.FileFoto : "../../public/profile.jpg"} alt="avatar" width="30"
                              height="30" />
                            <div className="w-100">
                              <div className="d-flex justify-content-between align-items-center mb-1">
                                <h6 className="text-danger mb-0">
                                  <a href="#" style={{fontSize:"14px"}}>{komen.Username}</a>
                                  <span className="text-dark ms-2">{komen.IsiKomentar}</span>
                                </h6>
                                <p className="mb-0" style={{fontSize:"12px"}}>{formatTime(komen.created_at)}</p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <p className="small mb-0">
                                  {komen.UserID == userID ? (<a onClick={() => handleConfirmDelete(komen.KomentarID)} className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" style={{fontSize:"12px", cursor:"pointer"}}>Remove</a> ) : null}
                                </p>
                                <div className="d-flex flex-row">
                                  {/* <i className="fas fa-star text-warning me-2"></i>
                                  <i className="far fa-check-circle" style={{color: "#aaa"}}></i> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                  )}
              </div>
              {isLoggedIn && (
                  <div className="row align-items-center py-3 border-top sticky-bottom" style={{ backgroundColor:"white" }}>
                      <div className=" profile" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                          <img className="border" src={user.FileFoto ? user.FileFoto : "../../public/profile.jpg"} alt="Profile" style={{ marginRight: '20px' }} />
                          <input
                            type="text"
                            name="komentar"
                            className="form-control rounded-pill"
                            style={{ marginRight: "20px" }}
                            value={komentarSend}
                            onChange={(e) => setKomentarSend(e.target.value)}
                          />
                          <button
                            style={{ justifyContent:"center", fontSize:"22px", padding:"12px" }}
                            onClick={handleKirimKomentar}
                            className="d-flex rounded-circle btn btn-a-purple border-0"
                            disabled={!komentarSend.trim()} 
                          >
                            <RxPaperPlane />
                          </button>
                      </div>
                  </div>
              )}

                 </div>
      </div>

  
    );
}
export default DetailImage