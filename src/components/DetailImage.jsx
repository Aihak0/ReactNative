import "./style.css";
import { Link,useParams} from 'react-router-dom';
import axios from 'axios';
import { RxPaperPlane } from "react-icons/rx";
import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';


const DetailImage = () => {
    const { id: imageId } = useParams();
    const [isChecked, setIsChecked] = useState(false);
    const { isLoggedIn } = useAuth();
    const userID = sessionStorage.getItem('UserID') || 0;
    const [komentar, setKomentar] = useState([]);
    const [komentarSend, setKomentarSend] = useState('');
    


    const [imageData, setImageData] = useState({
      FotoID:'',
      JudulFoto: 'Unnamed',
      TanggalUnggah: '0-0-0',
      AlbumID: 0,
      UserID: 0,
      JumlahLike: 0,
      Username: 'unknown'
    });
    
    
    useEffect(() => {
      const fetchImageDetails = async () => {
        try {
          const response = await axios.get(`http://localhost/GALERY-VITE/api/getImageDetails.php?id=${imageId}`);
          const imageDataFromApi = response.data;

          console.log(response.data);
          
          // Pilih data yang sesuai dengan FotoID jika ada, atau gunakan data dengan kunci 0 jika FotoID kosong
          const selectedImageData = imageDataFromApi.FotoID ? imageDataFromApi[imageDataFromApi.FotoID] : imageDataFromApi[0];
    
          // Set state dengan data yang dipilih
          setImageData(prevImageData => ({ ...prevImageData, ...selectedImageData }));
          
        } catch (error) {
          console.error('Error fetching image details:', error);
        }
      };
      console.log(imageData);
      fetchImageDetails();
    }, [imageId]);

    
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

    // Gunakan useEffect untuk memanggil fungsi checkPreviousLike saat komponen dimuat
    useEffect(() => {
        checkPreviousLike();
        fetchKomentar();
    }, []);




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
  
    return(
        <div className='row-a'>
            <div className='col-a-sm'>
                <img
                src={imageData.LokasiFile ? imageData.LokasiFile : '../../assets/select-image.jpeg'}
                id="preview-image"
                alt="Preview"
                style={{ width: '100%', border: '3px solid #adadad', borderRadius: '10px'}}
                />
            </div>
            <div className='col-a'>
                <div className="border-a-bottom">
                    <div className="row-a">
                        <div className="col-a">
                            <h2 className="judul-a-gambar">{imageData.JudulFoto}</h2>
                        </div>
                        <div className="col-a-sm-2 text-a-right">
                            <p>{imageData.TanggalUnggah}</p>
                        </div>
                    </div>
                    <div className="row-a" style={{ display: 'flex', justifyContent:"space-between",marginBottom:"20px"}}>
                        <div className="col-a-sm-2">
                            <Link to="#" className="profile" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center',marginLeft:"20px"}}>
                                <img src="../../public/profile.jpg" alt="Profile" style={{  marginRight: '5px' }} />
                                <p className="text-a-profile" style={{ margin: '0', fontSize: '14px', marginLeft: '5px' }}>{imageData.Username}</p>
                            </Link>
                        </div>
                        <div className="col-a-sm-2 text-a-right">
                        {isLoggedIn && (
                            <label className="love-checkbox">
                                <input type="checkbox" checked={isChecked} onChange={handleLike} />
                                <span className="heart">❤</span> 
                                <p style={{margin:"0", padding : "0", textAlign:"center"}}>{imageData.JumlahLike}</p>
                            </label>
                        )}
                        </div>
                    </div>
                </div>
                <div className="col-a">
                    <h4 style={{ marginTop:"5px", marginBottom:"5px"}}>Komentar</h4>
                    <div className="komentar border-a-bottom" style={{ overflow: 'auto', height: '200px' }}>
                        {komentar.map((komen) => (
                          <div key={komen.KomentarID} className="border-a-bottom" style={{marginBottom:"10px"}}>
                            <div className="row-a" style={{ display: 'flex', justifyContent:"space-between"}}>
                              <div className="col">{komen.Username}</div>
                              <div className="col">{komen.TanggalKomentar}</div>
                            </div>
                            <p style={{marginTop:"5px"}}>{komen.IsiKomentar}</p>
                          </div>
                        ))}
                    </div>
                    {isLoggedIn && (
                      <div style={{flexDirection: 'row', alignItems: 'center', padding:"15px" }}>
                          <div className="profile" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                              <img src="../../public/profile.jpg" alt="Profile" style={{  marginRight: '20px' }} />
                              <input type="text" name="komentar" className="form-a-purple" style={{marginRight:"20px"}} value={komentarSend} onChange={(e) => setKomentarSend(e.target.value)} />
                              <button style={{borderRadius:"50%", fontSize:"24px" }} onClick={handleKirimKomentar} className=" send-a-button btn-a-purple"><RxPaperPlane /></button>
                          </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
    );
}
export default DetailImage