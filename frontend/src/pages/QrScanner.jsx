import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QrReader from '@uides/react-qr-reader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, ArrowLeft, Scan, RefreshCw } from 'lucide-react';

const QrScanner = () => {
    const [key, setKey] = useState(0);
    const [scanResult, setScanResult] = useState(null);
    const [error, setError] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [isRequesting, setIsRequesting] = useState(false);
    const navigate = useNavigate();

    const checkCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Clean up
            setHasPermission(true);
        } catch (err) {
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setHasPermission(false);
                setError("Camera permission denied. Please enable it in browser settings.");
            } else {
                setHasPermission(null);
            }
        }
    };


    const requestCameraPermission = async () => {
        setIsRequesting(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop());
            setHasPermission(true);
            setError(null);
            setKey(prev => prev + 1);
        } catch (err) {
            setError("Error accessing camera: " + err.message);
            setHasPermission(false);
        } finally {
            setIsRequesting(false);
        }
    };
    

    useEffect(() => {
        checkCameraPermission();
    }, []);

    const handleScan = (result) => {
        if (result) {
            const restaurantId = result;
            setScanResult(restaurantId);
            navigate(`/restaurant/${restaurantId}`);
        }
    };

    const handleError = (err) => {
        console.error("QR Scanner Error:", err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            setError("Camera access was denied. Please grant permission to use the scanner.");
            setHasPermission(false);
        } else {
            setError("Error accessing camera. Please check your device settings.");
        }
    };

    const handleRetry = () => {
        setError(null);
        setKey(prev => prev + 1);
        requestCameraPermission();
    };

    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center space-y-4">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button onClick={handleRetry} className="w-full">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Camera Access
                    </Button>
                </div>
            );
        }

        if (hasPermission === false) {
            return (
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Camera access is required to scan QR codes. Please enable camera access in your browser settings.
                    </p>
                    <Button onClick={handleRetry}>
                        <Camera className="w-4 h-4 mr-2" />
                        Enable Camera
                    </Button>
                </div>
            );
        }

        if (hasPermission === null && !isRequesting) {
            return (
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        We need permission to use your camera to scan QR codes.
                    </p>
                    <Button onClick={requestCameraPermission}>
                        <Camera className="w-4 h-4 mr-2" />
                        Grant Camera Access
                    </Button>
                </div>
            );
        }

        return (
            <div className="overflow-hidden rounded-lg bg-black aspect-square">
                <QrReader
                    onScan={(result) => {
                        if (result) {
                            handleScan(result);
                        }
                        if (error && error?.message?.toLowerCase().includes('permission')) {
                            handleError(error);
                        }
                    }}
                    key={key}
                    constraints={{
                        facingMode: 'environment',
                        aspectRatio: 1
                    }}
                    className="w-full h-full"
                />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-muted/50 p-4 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Scan Restaurant QR Code</CardTitle>
                    <CardDescription>
                        Point your camera at a restaurant's QR code to view their menu
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {renderContent()}

                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/')}
                            className="w-full"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>

                        {hasPermission === true && (
                            <div className="text-center text-sm text-muted-foreground">
                                <p>Having trouble? Make sure:</p>
                                <ul className="list-disc list-inside mt-2">
                                    <li>Your camera is unobstructed</li>
                                    <li>The QR code is well-lit</li>
                                    <li>You hold your device steady</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default QrScanner;