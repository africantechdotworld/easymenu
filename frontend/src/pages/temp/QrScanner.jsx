import { QrReader } from 'react-qr-reader';
import './styles/scanner.css';
import React, { useState, useEffect } from 'react';
import { height } from '@fortawesome/free-regular-svg-icons/faAddressBook';
import { useNavigate } from 'react-router-dom';


const QrScanner = () => {
    const [key, setKey] = useState(0); // Unique key to force remounting
    const navigate = useNavigate();
 
    const goToHome = () => {
        navigate('/');
    };


    const [scanResult, setScanResult] = useState(null);

    // To refresh component on reload
    useEffect(() => {
        setKey(prevKey => prevKey + 1);
    }, []);

    const handleScan = (data) => {
        if (data) {
            console.log("QR Code Data:", data);
            // Handle the QR code data
            setScanResult(data.text); // Store the scanned data
        }
    };

    const handleError = (err) => {
        console.error("QR Reader Error:", err);
    };

    return (
        <>
        <div className='main-container' style={{ textAlign: 'center' }}>
        <h1>Scan Qr Code</h1>
            <div id="scan-box">
            <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                    handleScan(result);
                    }
                    if (!!error) {
                    handleError(error);
                    }
                }}
                key={key} // Using key to force reinitialization
                delay={300}
                onError={handleError}
                onScan={handleScan}
                constraints={{ facingMode: 'environment' }} // to use back camera on mobile
            />
            </div>
            <div style={{ marginTop: '20px' }}>
                {scanResult ? (
                <div>
                    <h3>Scanned Result:</h3>
                    <p>{scanResult}</p>
                </div>
                ) : (
                    <>
                <p>Scan a QR code to browse menus</p>
                <a onClick={goToHome}>Go back to home</a>
                </>
                )}
            </div>           
        </div>
        </>
    );
};

export default QrScanner;
