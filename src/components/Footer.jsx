import React from "react";


const Footer = () => {
    return (
        <footer className="footer d-flex flex-wrap justify-content-center align-items-center py-3 border-top" >
            <div className="col-md-4 d-flex align-items-center">
                <a href="#" className="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
                    <img src="../../public/Logo2.png" alt="logo" width={40} height={40} />
                </a>
            <span className="mb-3 mb-md-0 text-muted">© By Aihako 2024, all right reserved</span>
            </div>
        </footer>
    );
    
    }

export default Footer;