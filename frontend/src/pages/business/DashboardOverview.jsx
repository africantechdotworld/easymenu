import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Users,
    Menu as MenuIcon,
    Plus,
    CheckCircle,
    LayoutDashboard,
    Eye,
    Utensils
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { getMenuCategories } from '@/lib/api';

const StatCard = ({ title, value, icon: Icon, description }) => (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-slate-900">{value}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Icon className="w-5 h-5 text-primary" />
                </div>
            </div>
            {description && (
                <div className="mt-4">
                    <p className="text-xs text-slate-400">{description}</p>
                </div>
            )}
        </CardContent>
    </Card>
);

const DashboardOverview = () => {
    const [stats, setStats] = useState({
        categories: 0,
        totalItems: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const bizToken = localStorage.getItem('biz-token');
                if (!bizToken) return;

                // For now let's assume we can get it or use a "me" endpoint if we had one
                const result = await getMenuCategories();

                // Mocking data for the demonstration
                setStats({
                    categories: 5,
                    totalItems: 64
                });
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-6 pt-0">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
                <div>
                    <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="bg-white">
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                    </Button>
                    <Link to="/dashboard/menu">
                        <Button size="sm" className="shadow-sm">
                            <Plus className="w-4 h-4 mr-2" />
                            New Item
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                    title="Menu Categories"
                    value={stats.categories}
                    icon={MenuIcon}
                    description="Active groups on your menu"
                />
                <StatCard
                    title="Quick Setup"
                    value="100%"
                    icon={CheckCircle}
                    description="Profile is complete"
                />
                <StatCard
                    title="Total Menu Items"
                    value={stats.totalItems}
                    icon={Utensils}
                    description="Dishes across all categories"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 border-none shadow-md overflow-hidden bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Restaurant Summary</CardTitle>
                        <CardDescription>Quick overview of your active platform presence</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MenuIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Menu Visibility</p>
                                        <p className="text-xs text-slate-500">Your digital menu is live and accessible</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Active</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <LayoutDashboard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">Storefront Ready</p>
                                        <p className="text-xs text-slate-500">QR codes are generated and functional</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Ready</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { label: 'Edit Restaurant Profile', path: '/dashboard/settings', color: 'bg-blue-50 text-blue-600' },
                            { label: 'Update Business Hours', path: '/dashboard/settings', color: 'bg-amber-50 text-amber-600' },
                            { label: 'Manage QR Codes', path: '/dashboard/qr', color: 'bg-purple-50 text-purple-600' },
                        ].map((action, i) => (
                            <Link
                                key={i}
                                to={action.path}
                                className={`flex items-center justify-between p-4 rounded-xl hover:opacity-80 transition-opacity ${action.color}`}
                            >
                                <span className="font-semibold text-sm">{action.label}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div >
    );
};

const ArrowRight = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
);

export default DashboardOverview;
