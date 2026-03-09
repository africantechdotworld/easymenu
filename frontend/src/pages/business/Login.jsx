import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from 'lucide-react';
import { loginBusiness } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

const BusinessLogin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await loginBusiness(formData.email, formData.password);
            if (result.success) {
                toast({
                    title: "Welcome back!",
                    description: "You have successfully logged in to your dashboard.",
                });
                navigate('/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Login Failed",
                    description: result.error || "Please check your credentials and try again.",
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        EasyMenu
                    </Link>
                    <h1 className="text-2xl font-semibold mt-4 text-slate-900">Partner Dashboard</h1>
                    <p className="text-slate-500 mt-2">Manage your restaurant efficiently</p>
                </div>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Enter your credentials to access your store</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@restaurant.com"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="h-12 border-slate-200 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link to="/business/forgot-password" title="Coming soon!" className="text-sm text-primary hover:underline">
                                        Forgot?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="h-12 border-slate-200 focus:ring-primary/20"
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-medium group"
                                disabled={loading}
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <Link to="/business/signup" className="text-primary font-semibold hover:underline">
                                Register your business
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-slate-400">
                    &copy; {new Date().getFullYear()} EasyMenu Business. All rights reserved.
                </p>
            </motion.div>
        </div>
    );
};

export default BusinessLogin;
