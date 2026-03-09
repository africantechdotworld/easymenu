import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Store, Globe, MapPin, Clock } from 'lucide-react';
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
        website: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getAuthProfile();
            if (res.success) {
                // Map backend 'name' to frontend 'businessName'
                setProfile({
                    ...res.data,
                    businessName: res.data.name || ''
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Map back to 'name' for the backend
        const updateData = {
            ...profile,
            name: profile.businessName
        };

        const res = await updateAuthProfile(updateData);
        if (res.success) {
            toast({ title: "Settings Saved", description: "Your restaurant profile has been updated." });
        } else {
            toast({ variant: "destructive", title: "Error", description: res.error });
        }
        setSaving(false);
    };

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Restaurant Settings</h1>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* General Info */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-primary" />
                            General Information
                        </CardTitle>
                        <CardDescription>Tell customers about your restaurant</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Business Name</Label>
                                <Input
                                    value={profile.businessName}
                                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    value={profile.email}
                                    disabled
                                    className="bg-slate-50 cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                rows={4}
                                value={profile.description}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                placeholder="Describe your restaurant's story, cuisine, and vibe..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Contact & Location */}
                <Card className="border-none shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Location & Contact
                        </CardTitle>
                        <CardDescription>How customers can find and reach you</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Full Address</Label>
                            <Input
                                value={profile.address}
                                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone Number</Label>
                                <Input
                                    value={profile.phone}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Website</Label>
                                <Input
                                    value={profile.website}
                                    placeholder="https://"
                                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Opening Hours Mockup */}
                <Card className="border-none shadow-sm bg-slate-50 border border-dashed border-slate-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-slate-400">
                            <Clock className="w-5 h-5" />
                            Business Hours (Coming Soon)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="opacity-40 pointer-events-none">
                        <div className="space-y-3">
                            {['Monday', 'Tuesday', 'Wednesday'].map(day => (
                                <div key={day} className="flex items-center justify-between py-2 border-b border-slate-200">
                                    <span className="font-medium">{day}</span>
                                    <span className="text-sm">9:00 AM - 10:00 PM</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="pt-6 border-t border-slate-200 flex justify-end gap-3">
                <Button variant="outline">Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default DashboardSettings;
