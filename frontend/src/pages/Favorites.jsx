import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getRestaurantProfile } from '@/lib/api';
import {
    ArrowLeft,
    Heart,
    Store,
    ChevronRight,
    Loader2,
    ImageIcon,
    MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";

const FavoriteMenuItem = ({ item, restaurantName, onRestaurantClick, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="flex gap-4">
                        <div className="relative w-32 h-32 bg-muted flex-shrink-0">
                            {item.image ? (
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 py-0 pr-4">
                            <div className="flex my-4 justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h3 className="font-semibold line-clamp-2">{item.name}</h3>
                                    <button
                                        onClick={onRestaurantClick}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        {restaurantName}
                                    </button>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className="font-semibold">
                                        ${item.price}
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-600"
                                        onClick={() => onRemove(item)}
                                    >
                                        <Heart className="w-5 h-5" fill="currentColor" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [restaurants, setRestaurants] = useState({});
    const [error, setError] = useState(null);
    const { toast } = useToast();

    // Update useEffect to show loading toast for better UX
    useEffect(() => {
        const fetchFavorites = async () => {
            const loadingToast = toast({
                title: "Loading favorites...",
                description: "Please wait while we fetch your favorites."
            });

            try {
                setLoading(true);

                // Get favorites from local storage first
                const storedFavorites = localStorage.getItem('menuFavorites');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }



                // Fetch restaurant details
                const uniqueRestaurantIds = [...new Set(favorites.map(fav => fav.restaurantId))];
                const restaurantDetails = {};

                await Promise.all(
                    uniqueRestaurantIds.map(async (restaurantId) => {
                        const result = await getRestaurantProfile(restaurantId);
                        if (result.success) {
                            restaurantDetails[restaurantId] = result.data;
                        }
                    })
                );

                setRestaurants(restaurantDetails);
                loadingToast.dismiss();
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setError('Failed to load favorites');
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load your favorites. Please try again later."
                });
            } finally {
                setLoading(false);
            }
        };

    }, []);

    const handleRemoveFavorite = async (item) => {
        try {
            // Update local state first for immediate feedback
            const newFavorites = favorites.filter(fav => fav.id !== item.id);
            setFavorites(newFavorites);
            localStorage.setItem('menuFavorites', JSON.stringify(newFavorites));


        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "An unexpected error occurred. Please try again later."
            });
        }
    };

    const groupedFavorites = favorites.reduce((acc, item) => {
        if (!acc[item.restaurantId]) {
            acc[item.restaurantId] = [];
        }
        acc[item.restaurantId].push(item);
        return acc;
    }, {});

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl mx-auto p-4 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Favorites</h1>
                </div>

                {error && (
                    <Card className="bg-destructive/10">
                        <CardContent className="py-4 text-center text-destructive">
                            {error}
                        </CardContent>
                    </Card>
                )}

                {/* Favorites List */}
                {Object.keys(groupedFavorites).length === 0 ? (
                    <div className="text-center py-12">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
                        <p className="mt-2 text-muted-foreground">
                            Items you favorite will appear here
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="popLayout">
                        {Object.entries(groupedFavorites).map(([restaurantId, items]) => (
                            <motion.div
                                key={restaurantId}
                                layout
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Store className="w-5 h-5 text-muted-foreground" />
                                        <h2 className="font-semibold">
                                            {restaurants[restaurantId]?.businessName || 'Restaurant'}
                                        </h2>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/restaurant/${restaurantId}`)}
                                    >
                                        View Menu
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <FavoriteMenuItem
                                            key={item.id}
                                            item={item}
                                            restaurantName={restaurants[restaurantId]?.establishmentName}
                                            onRestaurantClick={() => navigate(`/restaurant/${restaurantId}`)}
                                            onRemove={handleRemoveFavorite}
                                        />
                                    ))}
                                </div>

                                <Separator className="my-6" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
};

export default FavoritesPage;