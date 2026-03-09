import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Share2, Copy, Check, QrCode as QrIcon, Settings2, Palette } from 'lucide-react';
import { getAuthProfile } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

const DashboardQR = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [copied, setCopied] = useState(false);
    const [qrColor, setQrColor] = useState('#000000');
    const qrRef = useRef();

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getAuthProfile();
            if (res.success) {
                setProfile({
                    ...res.data,
                    businessName: res.data.name
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const restaurantUrl = profile ? `${window.location.origin}/restaurant/${profile._id}` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(restaurantUrl);
        setCopied(true);
        toast({ title: "Link Copied!", description: "The restaurant menu link is now in your clipboard." });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `${profile?.businessName || 'restaurant'}-menu-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "QR Code Downloaded", description: "Your high-resolution QR code is ready for printing." });
    };

    if (loading) return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <QrIcon className="w-6 h-6 text-primary" />
                        Management QR Code
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Generate and download your unique restaurant menu code.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopy} className="bg-white">
                        {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                        Copy Live Link
                    </Button>
                    <Button size="sm" onClick={handleDownload} className="shadow-lg shadow-primary/20">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                    </Button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* QR Preview Card */}
                <Card className="lg:col-span-1 border-none shadow-xl overflow-hidden bg-white">
                    <CardHeader className="text-center bg-slate-50/50 border-b border-slate-100">
                        <CardTitle className="text-sm uppercase tracking-widest text-slate-400 font-bold">QR Preview</CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 flex flex-col items-center justify-center">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 relative group"
                            ref={qrRef}
                        >
                            <QRCodeCanvas
                                value={restaurantUrl}
                                size={220}
                                level={"H"}
                                fgColor={qrColor}
                                includeMargin={false}
                                id="qr-canvas"
                            />
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-center justify-center">
                                <QrIcon className="w-12 h-12 text-primary/20" />
                            </div>
                        </motion.div>

                        <div className="mt-8 text-center space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-900">{profile?.businessName}</h3>
                                <p className="text-xs text-slate-400 truncate max-w-[220px] mx-auto opacity-70">
                                    Scan to view our digital menu
                                </p>
                            </div>
                            <Button
                                onClick={handleDownload}
                                className="w-full rounded-xl shadow-lg shadow-primary/20"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Download QR Code
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Customization & Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-none shadow-md bg-white">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Settings2 className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">Customization</CardTitle>
                                    <CardDescription>Match the QR code to your brand aesthetic.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="flex items-center gap-2 text-slate-700">
                                    <Palette className="w-4 h-4" />
                                    Brand Color
                                </Label>
                                <div className="flex flex-wrap gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    {[
                                        '#000000', // Black
                                        '#e11d48', // Rose/Red
                                        '#2563eb', // blue
                                        '#16a34a', // green
                                        '#7c3aed', // purple
                                        '#ea580c', // orange
                                    ].map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setQrColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${qrColor === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-white shadow-sm'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={qrColor}
                                        onChange={(e) => setQrColor(e.target.value)}
                                        className="w-10 h-10 rounded-full cursor-pointer h-10 w-10 overflow-hidden border-2 border-white shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100/50">
                                <p className="text-xs text-amber-700 font-medium">
                                    <strong className="block mb-1">Pro Tip:</strong>
                                    High contrast (dark QR on light background) is recommended for best scanning results on all mobile devices.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white overflow-hidden">
                        <CardHeader className="pb-3 border-b border-slate-50">
                            <CardTitle className="text-base">Quick Share</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 group">
                                <div className="flex-1 text-xs text-slate-500 font-mono truncate px-2">
                                    {restaurantUrl}
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Design Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/50">
                    <h4 className="font-bold text-indigo-900 mb-2">Print Ready</h4>
                    <p className="text-sm text-indigo-700/80">The downloaded PNG is high-resolution, suitable for printing on table tents, stickers, or physical menus.</p>
                </div>
                <div className="p-6 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                    <h4 className="font-bold text-primary mb-2">Instant Update</h4>
                    <p className="text-sm text-primary/70">The QR content never changes. Any updates you make to your menu on the dashboard are visible instantly when scanned.</p>
                </div>
            </div>
        </div>
    );
};

const Label = ({ children, className, ...props }) => (
    <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>
        {children}
    </label>
);

export default DashboardQR;
