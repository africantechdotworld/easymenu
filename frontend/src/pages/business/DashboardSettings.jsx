import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save, Store, Globe, MapPin, Clock, Check } from 'lucide-react';
import { getAuthProfile, updateAuthProfile } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

const DashboardSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        businessName: '',
        email: '',
        description: '',
        address: '',
        phone: '',
        website: '',
        logoUrl: '',
        bannerUrl: ''
    });

    // Temp states for previews
    const [logoPreview, setLogoPreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [logoFile, setLogoFile] = useState(null);
    const [bannerFile, setBannerFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getAuthProfile();
            if (res.success) {
                const data = res.data;
                setProfile({
                    ...data,
                    businessName: data.name || '',
                });
                if (data.logoUrl) setLogoPreview(data.logoUrl.startsWith('http') ? data.logoUrl : `http://localhost:5000${data.logoUrl}`);
                if (data.bannerUrl) setBannerPreview(data.bannerUrl.startsWith('http') ? data.bannerUrl : `http://localhost:5000${data.bannerUrl}`);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;

        if (type === 'logo') {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            setBannerFile(file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Prepare data for backend
        const updateData = {
            name: profile.businessName,
            description: profile.description,
            address: profile.address,
            phone: profile.phone,
            website: profile.website,
        };

        if (logoFile) updateData.logoUrl = logoFile;
        if (bannerFile) updateData.bannerUrl = bannerFile;

        const res = await updateAuthProfile(updateData);
        if (res.success) {
            toast({ title: "Settings Saved", description: "Your restaurant profile has been updated." });
            // Update profile state with new URLs if they returned
            if (res.data.logoUrl) setLogoPreview(`http://localhost:5000${res.data.logoUrl}`);
            if (res.data.bannerUrl) setBannerPreview(`http://localhost:5000${res.data.bannerUrl}`);
            setLogoFile(null);
            setBannerFile(null);
        } else {
            toast({ variant: "destructive", title: "Error", description: res.error });
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 leading-tight">Restaurant Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your public presence and brand identity.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="px-8 shadow-lg shadow-primary/20">
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save All Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* General Info */}
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Store className="w-5 h-5 text-primary" />
                                General Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Business Name</Label>
                                    <Input
                                        value={profile.businessName}
                                        onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Email Address (Read Only)</Label>
                                    <Input
                                        value={profile.email}
                                        disabled
                                        className="h-11 rounded-xl bg-slate-50 text-slate-400 border-dashed"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Description</Label>
                                <Textarea
                                    rows={4}
                                    value={profile.description}
                                    onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                    placeholder="Describe your restaurant's story, cuisine, and vibe..."
                                    className="rounded-xl resize-none"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact & Location */}
                    <Card className="border-none shadow-sm overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="w-5 h-5 text-indigo-500" />
                                Location & Contact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Full Address</Label>
                                <Input
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className="h-11 rounded-xl"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Phone Number</Label>
                                    <Input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-700 font-semibold">Website</Label>
                                    <Input
                                        value={profile.website}
                                        placeholder="https://"
                                        onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                        className="h-11 rounded-xl"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-8">
                    {/* Branding / Images */}
                    <Card className="border-none shadow-md overflow-hidden bg-white">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-lg">Storefront Assets</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-8">
                            {/* Logo Upload */}
                            <div className="space-y-4">
                                <Label className="text-slate-700 font-semibold block">Restaurant Logo</Label>
                                <div className="relative group mx-auto w-32 h-32">
                                    <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-inner">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Store className="w-10 h-10 text-slate-300" />
                                        )}
                                    </div>
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                        <span className="text-white text-xs font-bold">Change Logo</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} />
                                    </label>
                                </div>
                                <p className="text-[10px] text-center text-slate-400">Recommended: Square PNG/JPG, 512x512px</p>
                            </div>

                            <Separator className="bg-slate-100" />

                            {/* Banner Upload */}
                            <div className="space-y-4">
                                <Label className="text-slate-700 font-semibold block">Cover Banner</Label>
                                <div className="relative group w-full h-32 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                                    {bannerPreview ? (
                                        <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                                    ) : (
                                        <Globe className="w-8 h-8 text-slate-300" />
                                    )}
                                    <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                        <span className="text-white text-xs font-bold">Change Cover</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                    </label>
                                </div>
                                <p className="text-[10px] text-center text-slate-400">Recommended: 16:9 Aspect Ratio, Min 1200px width</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Card */}
                    <Card className="border-none bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                        <CardContent className="p-6">
                            <h4 className="font-bold text-primary mb-2 text-sm">Storefront Status</h4>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Check className={`w-4 h-4 ${profile.businessName ? 'text-emerald-500' : 'text-slate-300'}`} />
                                    Business Name Set
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Check className={`w-4 h-4 ${logoPreview ? 'text-emerald-500' : 'text-slate-300'}`} />
                                    Logo Uploaded
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                    <Check className={`w-4 h-4 ${bannerPreview ? 'text-emerald-500' : 'text-slate-300'}`} />
                                    Banner Uploaded
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardSettings;
