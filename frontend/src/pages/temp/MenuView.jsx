import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getMenusByCategory, getRestaurantCategories } from '@/data/firebaseFunctions';
import { ArrowLeft, Search, Tag, Clock } from 'lucide-react';

const MenuView = () => {
    const { id, categoryId } = useParams();
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menusResult, categoriesResult] = await Promise.all([
                    getMenusByCategory(id, categoryId),
                    getRestaurantCategories(id)
                ]);

                if (menusResult.success && categoriesResult.success) {
                    setMenus(menusResult.data);
                    const currentCategory = categoriesResult.data.find(cat => cat.id === categoryId);
                    setCategory(currentCategory);
                } else {
                    setError("Failed to load menu data");
                }
            } catch (error) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, categoryId]);

    const filteredMenus = menus.filter(menu => 
        menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        menu.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-4 space-y-4">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-12 w-full" />
                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen bg-background p-4 flex items-center justify-center">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6 space-y-4">
                        <p className="text-destructive">{error || "Category not found"}</p>
                        <Button onClick={() => navigate(`/restaurant/${id}`)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Categories
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3 mb-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigate(`/restaurant/${id}`)}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <h1 className="text-xl font-semibold">{category.name}</h1>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search menu items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Menu Items */}
            <ScrollArea className="h-[calc(100vh-8.5rem)] px-4">
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="py-4 space-y-4"
                >
                    {filteredMenus.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "No items match your search" : "No items in this category"}
                        </div>
                    ) : (
                        filteredMenus.map((menu) => (
                            <motion.div
                                key={menu.id}
                                variants={item}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Card className="overflow-hidden">
                                    <div className="flex gap-4 md:gap-6">
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
                                            <img
                                                src={menu.image || "/api/placeholder/160/160"}
                                                alt={menu.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {menu.prepTime && (
                                                <Badge 
                                                    variant="secondary" 
                                                    className="absolute bottom-2 left-2"
                                                >
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {menu.prepTime} mins
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex-1 py-4 pr-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold line-clamp-2">{menu.name}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {menu.description}
                                                    </p>
                                                </div>
                                                <div className="font-semibold">
                                                    ${menu.price}
                                                </div>
                                            </div>

                                            {menu.customizations && menu.customizations.length > 0 && (
                                                <div className="mt-3">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Tag className="w-3 h-3" />
                                                        <span>Options available</span>
                                                    </div>
                                                </div>
                                            )}

                                            {menu.tags && menu.tags.length > 0 && (
                                                <div className="mt-3 flex flex-wrap gap-2">
                                                    {menu.tags.map((tag, index) => (
                                                        <Badge 
                                                            key={index}
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))
                    )}
                </motion.div>
            </ScrollArea>
        </div>
    );
};

export default MenuView;