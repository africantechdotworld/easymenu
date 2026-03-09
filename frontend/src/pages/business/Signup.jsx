import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Store, Mail, Lock, User } from 'lucide-react';
import { signupBusiness } from '@/lib/api';
import { useToast } from "@/hooks/use-toast";

const BusinessSignup = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const token = localStorage.getItem('biz-token');
        if (token) {
            navigate('/dashboard');
        }
    }, [navigate]);

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                variant: "destructive",
                title: "Validation Error",
                description: "Passwords do not match.",
            });
            return;
        }

        setLoading(true);

        try {
            const signupData = {
                businessName: formData.businessName,
                email: formData.email,
                password: formData.password
            };

            const result = await signupBusiness(signupData);
            if (result.success) {
                toast({
                    title: "Welcome to EasyMenu!",
                    description: "Your business account has been created successfully.",
                });
                navigate('/dashboard');
            } else {
                toast({
                    variant: "destructive",
                    title: "Signup Failed",
                    description: result.error || "Something went wrong. Please try again.",
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
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        EasyMenu
                    </Link>
                    <h1 className="text-2xl font-semibold mt-4 text-slate-900">Get Started with EasyMenu</h1>
                    <p className="text-slate-500 mt-2">Join thousands of restaurants digitizing their experience</p>
                </div>

                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Create Business Account</CardTitle>
                        <CardDescription>Fill in the details to register your restaurant</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="businessName">Business Name</Label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="businessName"
                                        placeholder="The Great Pizza"
                                        required
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="h-12 pl-10 border-slate-200 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="admin@restaurant.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="h-12 pl-10 border-slate-200 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="h-12 pl-10 border-slate-200 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="h-12 pl-10 border-slate-200 focus:ring-primary/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 py-2">
                                <input type="checkbox" required className="mt-1 accent-primary" id="terms" />
                                <Label htmlFor="terms" className="text-xs text-slate-500 leading-normal font-normal cursor-pointer">
                                    I agree to the <Link className="text-primary hover:underline">Terms of Service</Link> and <Link className="text-primary hover:underline">Privacy Policy</Link>.
                                </Label>
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
                                        Create Account
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link to="/business/login" className="text-primary font-semibold hover:underline">
                                Log in
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

export default BusinessSignup;
