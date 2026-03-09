import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { getMenuItemsByCategory, getMenuCategories } from '@/lib/api';
import { ArrowLeft, Search, Tag, Image as ImageIcon } from 'lucide-react';
import MenuPreviewDialog from '@/components/app/MenuPreviewDialog';

const MenuView = () => {
    const { id, categoryId } = useParams();
    const navigate = useNavigate();
    const [menus, setMenus] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMenu, setSelectedMenu] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        // Load favorites from localStorage
        const storedFavorites = localStorage.getItem('menuFavorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }

        const fetchData = async () => {
            try {
                const [menusResult, categoriesResult] = await Promise.all([
                    getMenuItemsByCategory(categoryId),
                    getMenuCategories(id)
                ]);

                if (menusResult.success && categoriesResult.success) {
                    setMenus(menusResult.data);
                    const currentCategory = categoriesResult.data.find(cat => (cat._id || cat.id) === categoryId);
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

    const handleFavoriteToggle = (menu) => {
        // Check if user has given consent before
        const hasConsent = localStorage.getItem('userConsent');

        if (!hasConsent) {
            setPendingAction(() => () => handleFavoriteToggle(menu));
            setShowConsentDialog(true);
            return;
        }

        const menuId = menu._id || menu.id;
        const newFavorites = favorites.some(fav => (fav._id || fav.id) === menuId)
            ? favorites.filter(fav => (fav._id || fav.id) !== menuId)
            : [...favorites, { ...menu, restaurantId: id }];

        setFavorites(newFavorites);
        localStorage.setItem('menuFavorites', JSON.stringify(newFavorites));
    };

    const handleReviewClick = (menu) => {
        const hasConsent = localStorage.getItem('userConsent');

        if (!hasConsent) {
            setPendingAction(() => () => handleReviewClick(menu));
            setShowConsentDialog(true);
            return;
        }

        navigate(`/restaurant/${id}/menu/${menu._id || menu.id}/reviews/`);
    };

    const handleConsentAccept = () => {
        localStorage.setItem('userConsent', 'true');
        setShowConsentDialog(false);
        // Execute pending action if exists
        if (pendingAction) {
            pendingAction();
            setPendingAction(null);
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-4 space-y-4">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-8 w-32" />
                </div>
                <Skeleton className="h-12 w-full" />
                <div className="space-y-4 pt-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
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
                        <h1 className="text-xl font-semibold">{category?.name}</h1>
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
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-4 space-y-4"
                >
                    {filteredMenus.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            {searchQuery ? "No items match your search" : "No items in this category"}
                        </div>
                    ) : (
                        filteredMenus.map((menu) => (
                            <motion.div
                                key={menu._id || menu.id}
                                layout
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <Card
                                    className="overflow-hidden cursor-pointer hover:border-primary/50"
                                    onClick={() => setSelectedMenu(menu)}
                                >
                                    <div className="flex gap-4">
                                        <div className="relative w-32 h-32 bg-muted flex-shrink-0">
                                            {(menu.imageUrl || menu.image) ? (
                                                <img
                                                    src={getImageUrl(menu.imageUrl || menu.image)}
                                                    alt={menu.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 py-4 pr-4">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="space-y-1">
                                                    <h3 className="font-semibold">{menu.name}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                                        {menu.description || "No description available"}
                                                    </p>
                                                </div>
                                                <div className="font-semibold">
                                                    ${menu.price}
                                                </div>
                                            </div>

                                            {(menu.options?.length > 0 || menu.tags?.length > 0) && (
                                                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Tag className="w-3 h-3" />
                                                    <span>
                                                        {menu.options?.length > 0 ? 'Options available' : ''}
                                                        {menu.options?.length > 0 && menu.tags?.length > 0 ? ' • ' : ''}
                                                        {menu.tags?.length > 0 ? `${menu.tags.length} tags` : ''}
                                                    </span>
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

            {/* Menu Preview Dialog */}
            <MenuPreviewDialog
                menu={selectedMenu}
                isOpen={!!selectedMenu}
                onClose={() => setSelectedMenu(null)}
                restaurantId={id}
                onFavoriteToggle={handleFavoriteToggle}
                onReviewClick={handleReviewClick}
                isFavorited={favorites.some(fav => (fav._id || fav.id) === (selectedMenu?._id || selectedMenu?.id))}
                orderingEnabled={category?.allowOrdering}
            />

            {/* Consent Dialog */}
            <AlertDialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Allow Data Storage</AlertDialogTitle>
                        <AlertDialogDescription>
                            To enable features like favorites and reviews, we need to store some data on your device.
                            This helps us provide a better experience and remember your preferences.
                            No personal information is collected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleConsentAccept}>
                            Accept & Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MenuView;