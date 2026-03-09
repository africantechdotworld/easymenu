import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Utensils,
    Settings,
    LogOut,
    Menu as MenuIcon,
    Bell,
    ChevronDown,
    QrCode as QrIcon,
    User,
    X
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { getAuthProfile } from '@/lib/api';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }) => (
    <Link
        to={path}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
        <span className="font-medium">{label}</span>
        {active && <motion.div layoutId="activeNav" className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />}
    </Link>
);

const DashboardLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            const result = await getAuthProfile();
            if (result.success) {
                setProfile({
                    ...result.data,
                    businessName: result.data.name
                });
            } else {
                // If unauthorized, redirect to login
                // For now we just console error
                console.error("Session expired or invalid");
            }
        };
        fetchProfile();
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: Utensils, label: 'Manage Menu', path: '/dashboard/menu' },
        { icon: QrIcon, label: 'QR Code', path: '/dashboard/qr' },
        { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('biz-token');
        navigate('/business/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 flex-shrink-0 bg-white border-r border-slate-200 p-4 sticky top-0 h-screen">
                <div className="px-4 py-6 mb-8">
                    <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        EasyMenu
                    </Link>
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">Business Partner</p>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-4 border-t border-slate-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
                    <button
                        className="md:hidden p-2 text-slate-500"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <MenuIcon className="w-6 h-6" />
                    </button>

                    <div className="hidden md:block">
                        <h2 className="text-lg font-semibold text-slate-800">
                            {navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-primary">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                        </Button>
                        <div className="h-8 w-px bg-slate-200" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-slate-900">{profile?.businessName || 'Loading...'}</p>
                                <p className="text-xs text-slate-500">Business Partner</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                {profile?.logo ? (
                                    <img src={profile.logo} alt="Store" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User className="w-5 h-5" />
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto pt-0 p-4 md:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, scale: 0.99 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.99 }}
                            transition={{ duration: 0.15 }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-50 p-6 lg:hidden"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="text-2xl font-bold text-primary">EasyMenu</span>
                                <button onClick={() => setIsMobileMenuOpen(false)}>
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <SidebarItem
                                        key={item.path}
                                        {...item}
                                        active={location.pathname === item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    />
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardLayout;
