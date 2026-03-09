import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";

import {
    Heart,
    Star,
    MessageSquare,
    Minus,
    Plus,
    Image as ImageIcon,
    Loader2
} from 'lucide-react';

const MenuPreviewDialog = ({
    menu,
    isOpen,
    onClose,
    restaurantId,
    onReviewClick,
    orderingEnabled = false
}) => {
    const [quantity, setQuantity] = useState(1);
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);

    // Check if menu is favorited on load
    useEffect(() => {
        const checkFavoriteStatus = () => {
            if (menu) {
                const storedFavorites = localStorage.getItem('menuFavorites');
                if (storedFavorites) {
                    const favorites = JSON.parse(storedFavorites);
                    const menuId = menu._id || menu.id;
                    setIsFavorited(favorites.some(fav => (fav._id || fav.id) === menuId));
                }
            }
        };

        checkFavoriteStatus();
    }, [menu]);

    const handleQuantityChange = (increment) => {
        const newQuantity = quantity + increment;
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    };

    const handleFavoriteClick = () => {
        handleFavoriteToggle();
    };

    const handleFavoriteToggle = () => {
        // Prepare menu data for favorite
        const menuData = {
            id: menu._id || menu.id,
            _id: menu._id || menu.id,
            name: menu.name,
            price: menu.price,
            imageUrl: menu.imageUrl || menu.image,
            restaurantId,
            categoryId: menu.categoryId,
            description: menu.description
        };

        // Update local state
        const newFavoritedState = !isFavorited;
        setIsFavorited(newFavoritedState);

        // Update localStorage
        const storedFavorites = localStorage.getItem('menuFavorites');
        let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

        const menuId = menu._id || menu.id;
        if (newFavoritedState) {
            favorites.push(menuData);
        } else {
            favorites = favorites.filter(fav => (fav._id || fav.id) !== menuId);
        }

        localStorage.setItem('menuFavorites', JSON.stringify(favorites));
    };

    const handleConsentAccept = () => {
        setShowConsentDialog(false);
        handleFavoriteToggle();
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        return `http://localhost:5000${url}`;
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl overflow-hidden">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">
                            {menu?.name}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Menu Image */}
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        {(menu?.imageUrl || menu?.image) ? (
                            <img
                                src={getImageUrl(menu.imageUrl || menu.image)}
                                alt={menu?.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                            </div>
                        )}
                    </div>

                    {/* Actions Row */}
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-semibold">
                            ${menu?.price}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleFavoriteClick}
                                className={isFavorited ? "text-red-500" : ""}
                            >
                                <Heart
                                    className="w-5 h-5"
                                    fill={isFavorited ? "currentColor" : "none"}
                                />
                            </Button>
                            {import.meta.env.VITE_EDUCATIONAL_VERSION !== 'true' && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onReviewClick(menu)}
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="font-medium mb-2">Description</h3>
                        <p className="text-muted-foreground">
                            {menu?.description || "No description available"}
                        </p>
                    </div>

                    {/* Customization Options */}
                    {menu?.customizations?.length > 0 && (
                        <>
                            <Separator />
                            <div className="space-y-4">
                                {menu.customizations.map((section, sectionIndex) => (
                                    <div key={sectionIndex} className="space-y-2">
                                        <h3 className="font-medium">{section.sectionTitle}</h3>
                                        <div className="space-y-2">
                                            {section.options.map((option) => (
                                                <div
                                                    key={option.id}
                                                    className="flex justify-between items-center py-2"
                                                >
                                                    <span>{option.name}</span>
                                                    <span className="text-muted-foreground">
                                                        ${option.price}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Ordering Controls - Only show if enabled */}
                    {orderingEnabled && (
                        <>
                            <Separator />
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(-1)}
                                        disabled={quantity <= 1}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="font-medium text-lg">{quantity}</span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleQuantityChange(1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button className="px-8">
                                    Add to Order
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Consent Dialog */}
            <AlertDialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Enable Favorites</AlertDialogTitle>
                        <AlertDialogDescription>
                            To save your favorite items and access them later, we need to create an anonymous profile.
                            No personal information is required or collected.
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
        </>
    );
};

export default MenuPreviewDialog;