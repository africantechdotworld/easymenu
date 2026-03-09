import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { loginAdmin } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('admin-token');
        if (token) {
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await loginAdmin(formData.email, formData.password);
            if (result.success) {
                toast({
                    title: "Access Granted",
                    description: "Welcome to the System Control Center.",
                });
                navigate('/admin/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: result.error || "Invalid administrator credentials.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "System Error",
                description: "Communications failure with central server.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4">
                        <ShieldCheck className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Administration</h1>
                    <p className="text-slate-400 mt-2">Secure Gateway to EasyMenu Infrastructure</p>
                </div>

                <Card className="border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
                    <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/40" />
                    <CardHeader className="pb-4">
                        <CardTitle className="text-white">Admin Authentication</CardTitle>
                        <CardDescription className="text-slate-400">Identity verification required for platform access</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Admin Identifier (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@system.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" title="Standard Admin Security" className="text-slate-300">Access Key</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:ring-primary/20"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-md font-semibold group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Authenticate
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-slate-600 font-mono uppercase tracking-widest">
                    Authorized Personnel Only &bull; Terminal Access Logged
                </p>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
