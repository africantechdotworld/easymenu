import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Store,
    Users,
    Settings,
    LogOut,
    MoreVertical,
    Trash2,
    ExternalLink,
    Search,
    TrendingUp,
    Utensils,
    Layers,
    AlertCircle,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    getAllRestaurantsAdmin,
    getSystemStatsAdmin,
    deleteRestaurantAdmin
} from '@/lib/api';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [stats, setStats] = useState({
        totalRestaurants: 0,
        totalMenuItems: 0,
        totalCategories: 0
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('admin-token');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [restaurantsRes, statsRes] = await Promise.all([
                getAllRestaurantsAdmin(),
                getSystemStatsAdmin()
            ]);

            if (restaurantsRes.success) setRestaurants(restaurantsRes.data);
            if (statsRes.success) setStats(statsRes.data);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Data Failure",
                description: "Failed to pull system metrics and restaurant records."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Permanently remove ${name} and all its data? This cannot be undone.`)) return;

        try {
            const result = await deleteRestaurantAdmin(id);
            if (result.success) {
                toast({
                    title: "Restaurant Removed",
                    description: `${name} has been purged from the system.`
                });
                fetchData();
            } else {
                toast({
                    variant: "destructive",
                    title: "Purge Failed",
                    description: result.error
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "System Error",
                description: "Communications failure with central server."
            });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin-token');
        navigate('/admin/login');
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-slate-400 font-mono tracking-widest text-xs uppercase">Initialising System Control Center...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-primary selection:text-primary-foreground">
            {/* Main Wrapper */}
            <div className="flex h-screen overflow-hidden">

                {/* Sidebar */}
                <aside className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
                    <div className="p-6 mb-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        {isSidebarOpen && (
                            <div className="font-bold text-xl tracking-tight text-white">System<span className="text-primary">Admin</span></div>
                        )}
                    </div>

                    <nav className="flex-1 px-3 space-y-1">
                        <nav-item className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 text-primary cursor-pointer">
                            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                            {isSidebarOpen && <span className="font-medium">Global Console</span>}
                        </nav-item>

                        <nav-item className="p-3">
                            <p className={`text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-2 ${!isSidebarOpen && 'text-center'}`}>Internal Tools</p>
                            <div className="space-y-1">
                                <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <Store className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    {isSidebarOpen && <span className="font-medium">Restaurant Cluster</span>}
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <Users className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    {isSidebarOpen && <span className="font-medium">Access Logs</span>}
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer group">
                                    <Settings className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                                    {isSidebarOpen && <span className="font-medium">Cluster Config</span>}
                                </div>
                            </div>
                        </nav-item>
                    </nav>

                    <div className="p-4 border-t border-slate-800">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors group"
                        >
                            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                            {isSidebarOpen && <span className="font-medium">Terminate Session</span>}
                        </button>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto flex flex-col">
                    {/* Header */}
                    <header className="h-20 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-8 z-10 sticky top-0">
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Main Console</h2>
                            <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">Global Instance Status: 01.03.OK</p>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search nodes by business/email..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-slate-800 border-none rounded-full py-2 pl-10 pr-6 text-sm text-slate-300 w-64 focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-600"
                                />
                            </div>
                            <Separator orientation="vertical" className="h-6 bg-slate-800" />
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <p className="text-sm font-bold text-white leading-none">Root Admin</p>
                                    <p className="text-[10px] text-primary font-mono lowercase tracking-tighter">system_administrator@v1</p>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center text-primary border border-slate-700">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-8 space-y-8 max-w-7xl mx-auto w-full">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-slate-900 border-slate-800 hover:border-primary/50 transition-colors overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                            <Store className="w-6 h-6" />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 uppercase font-mono">Real-time Count</Badge>
                                    </div>
                                    <h4 className="text-3xl font-black text-white">{stats.totalRestaurants}</h4>
                                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Registered Nodes</p>
                                </CardContent>
                                <div className="h-1 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                            </Card>

                            <Card className="bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-colors overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <Utensils className="w-6 h-6" />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 uppercase font-mono">Cluster Assets</Badge>
                                    </div>
                                    <h4 className="text-3xl font-black text-white">{stats.totalMenuItems}</h4>
                                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Total Catalog Items</p>
                                </CardContent>
                                <div className="h-1 w-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
                            </Card>

                            <Card className="bg-slate-900 border-slate-800 hover:border-emerald-500/50 transition-colors overflow-hidden group">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-500 uppercase font-mono">Structure</Badge>
                                    </div>
                                    <h4 className="text-3xl font-black text-white">{stats.totalCategories}</h4>
                                    <p className="text-sm text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Menu Schema Classes</p>
                                </CardContent>
                                <div className="h-1 w-full bg-emerald-500/20 group-hover:bg-emerald-500 transition-colors" />
                            </Card>
                        </div>

                        {/* Node Management List */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-lg font-bold text-white tracking-widest uppercase text-xs">Node Directory</h3>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>Last updated: {new Date().toLocaleTimeString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <AnimatePresence mode="popLayout">
                                    {filteredRestaurants.length === 0 ? (
                                        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                                            <AlertCircle className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                            <p className="text-slate-500 uppercase tracking-widest text-xs">No active nodes found matching parameters</p>
                                        </div>
                                    ) : (
                                        filteredRestaurants.map((r, index) => (
                                            <motion.div
                                                key={r._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Card className="bg-slate-900/50 border-slate-800 hover:bg-slate-900 transition-all duration-300 group overflow-hidden">
                                                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                                                        {/* Icon/Logo Cluster */}
                                                        <div className="relative flex-shrink-0">
                                                            <div className="h-16 w-16 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-700 group-hover:border-primary/30 transition-colors">
                                                                {r.logoUrl ? (
                                                                    <img src={r.logoUrl.startsWith('http') ? r.logoUrl : `http://localhost:5000${r.logoUrl}`} className="h-full w-full object-cover" alt="Node" />
                                                                ) : (
                                                                    <Store className="w-8 h-8 text-slate-600" />
                                                                )}
                                                            </div>
                                                            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 border-4 border-slate-950 shadow-lg" title="Operational" />
                                                        </div>

                                                        {/* Identity Info */}
                                                        <div className="flex-1 text-center sm:text-left min-w-0">
                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-1">
                                                                <h4 className="text-lg font-bold text-white truncate max-w-[200px]">{r.name}</h4>
                                                                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-mono px-2 py-0">Node_UID: {r._id.slice(-6).toUpperCase()}</Badge>
                                                            </div>
                                                            <p className="text-sm text-slate-400 font-medium">{r.email}</p>
                                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 uppercase tracking-widest font-bold">
                                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Established: {new Date(r.createdAt).toLocaleDateString()}</span>
                                                                <span className="flex items-center gap-1.5 text-slate-600/50 font-mono">Internal_ID: {r._id}</span>
                                                            </div>
                                                        </div>

                                                        {/* Interface Actions */}
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-slate-400 hover:text-white hover:bg-slate-800"
                                                                onClick={() => window.open(`/restaurant/${r._id}`, '_blank')}
                                                            >
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                            <Separator orientation="vertical" className="h-8 mx-1 bg-slate-800" />
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-slate-400 hover:text-red-500 hover:bg-red-500/10"
                                                                onClick={() => handleDelete(r._id, r.name)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                <span className="ml-2 hidden lg:inline">Purge Node</span>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
