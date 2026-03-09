import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './styles/Restaurant.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence } from 'framer-motion';
import SearchView from "@/components/app/SearchView";
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Timer, Clock } from "lucide-react";


import {
    faCircleInfo,
    faHeart,
    faChevronRight,
    faChevronLeft,
    faLocationDot,
    faStar,
    faList,
    faClock
} from "@fortawesome/free-solid-svg-icons";
import { getRestaurantProfile, getMenuCategories, getRestaurantRatings, getRestaurantSpecials } from '@/lib/api';

const ViewRestaurant = () => {
    const { id } = useParams();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 960);
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ratings, setRatings] = useState(null);
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [specials, setSpecials] = useState([]);
    const [selectedSpecial, setSelectedSpecial] = useState(null);

    // Temporary mock data for reviews
    const mockRating = {
        average: 4.5,
        total: 128
    };

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 960);
        window.addEventListener('resize', handleResize);

        const fetchData = async () => {
            try {
                const [restaurantData, categoriesData, ratingsResult, specialsResult] = await Promise.all([
                    getRestaurantProfile(id),
                    getMenuCategories(id),
                    getRestaurantRatings(id),
                    getRestaurantSpecials(id)
                ]);

                if (restaurantData.success) {
                    setRestaurant(restaurantData.data);
                }
                if (categoriesData.success) {
                    setCategories(categoriesData.data);
                }
                if (ratingsResult.success) {
                    setRatings(ratingsResult.data);
                }
                if (specialsResult.success) {
                    setSpecials(specialsResult.data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        return () => window.removeEventListener('resize', handleResize);
    }, [id]);


    // Add handlers for search results
    const handleMenuClick = (categoryId, menuId) => {
        setIsSearchOpen(false);
        // Navigate to the specific menu item or handle as needed
    };

    const handleCategoryClick = (categoryId) => {
        setIsSearchOpen(false);
        navigate(`/restaurant/${id}/menu/${categoryId}`);
    };

    const checkIfOpen = () => {
        if (!restaurant || !restaurant.businessHours) return true; // Default to open if no hours set

        const now = new Date();
        const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const currentTime = now.getHours() * 100 + now.getMinutes();

        const hours = restaurant.businessHours[day];
        if (!hours || hours.open === "closed") return false;

        const [openHour, openMin] = hours.open.split(':').map(Number);
        const [closeHour, closeMin] = hours.close.split(':').map(Number);

        if (isNaN(openHour) || isNaN(closeHour)) return true;

        const openTime = openHour * 100 + openMin;
        const closeTime = closeHour * 100 + closeMin;

        return currentTime >= openTime && currentTime <= closeTime;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/50">
                <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    const SpecialCard = ({ special }) => {
        const formatDateRange = (startDate, endDate) => {
            const start = new Date(startDate).toLocaleDateString();
            const end = new Date(endDate).toLocaleDateString();
            return `${start} - ${end}`;
        };

        return (
            <div
                className="relative w-48 h-48 min-w-[200px] overflow-hidden rounded-2xl group cursor-pointer hover:shadow-lg transition-all duration-300"
                onClick={() => setSelectedSpecial(special)}
            >
                <img
                    src={special.image}
                    alt={special.title}
                    className="absolute inset-0 object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <Badge
                        className="absolute text-white bg-red-500 border-none top-3 right-3 hover:bg-red-600"
                    >
                        Special
                    </Badge>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                    <h3 className="mb-1 text-lg font-semibold line-clamp-1">
                        {special.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-gray-200">
                        <Timer className="w-3 h-3" />
                        <span className="line-clamp-1">
                            {formatDateRange(special.startDate, special.endDate)}
                        </span>
                    </div>

                    {special.price && (
                        <div className="mt-1 font-semibold">
                            ${special.price}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="v-container">
            <div className="profile-container">
                <div className="photo-box">
                    {/* Cover Photo with Navigation */}
                    <div className="cover-nav">
                        <div className="n-item" onClick={() => navigate('/')}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </div>
                        <div className="n-item" onClick={() => navigate('/favorites')}>
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                    </div>
                    <img
                        className="c-photo"
                        src={restaurant?.bannerUrl ? (restaurant.bannerUrl.startsWith('http') ? restaurant.bannerUrl : `http://localhost:5000${restaurant.bannerUrl}`) : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'}
                        alt={restaurant?.name}
                    />
                    <div className="p-photo">
                        <img
                            src={restaurant?.logoUrl ? (restaurant.logoUrl.startsWith('http') ? restaurant.logoUrl : `http://localhost:5000${restaurant.logoUrl}`) : 'https://api.dicebear.com/7.x/initials/svg?seed=' + restaurant?.name}
                            alt="Restaurant logo"
                        />
                    </div>
                    <div className="c-details">
                        <h1 className="m-0">{restaurant?.name}</h1>
                        <div className="restaurant-info">
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <span className={`status-badge ${checkIfOpen() ? 'open' : 'closed'}`}>
                                    <FontAwesomeIcon icon={faClock} />
                                    {checkIfOpen() ? 'Open Now' : 'Closed'}
                                </span>

                                <div className="location">
                                    <FontAwesomeIcon icon={faLocationDot} />
                                    <span className="text-sm">{restaurant?.address}</span>
                                </div>

                                {ratings && (
                                    <div
                                        className="cursor-pointer rating"
                                        onClick={() => navigate(`/restaurant/${id}/reviews`)}
                                    >
                                        <FontAwesomeIcon icon={faStar} className="star-icon" />
                                        <span>{ratings.averageRating.toFixed(1)}</span>
                                        <span className="review-count text-xs">({ratings.totalReviews})</span>
                                        <span className="text-xs underline ml-1">Reviews</span>
                                    </div>
                                )}
                            </div>
                            {/* Location & Rating */}
                            {/*
                            <div className="info-row">
                                {!mockRating && (
                                    <div className="rating">
                                        <FontAwesomeIcon icon={faStar} className="star-icon" />
                                        <span>{mockRating.average}</span>
                                        <span className="review-count">({mockRating.total})</span>
                                    </div>
                                )}
                            </div>
                            */}
                            <div className="cta-buttons">
                                <p onClick={() => navigate(`/restaurant/${id}/menu`)}>
                                    Browse Menu
                                    <FontAwesomeIcon icon={faList} />
                                </p>
                                <p onClick={() => navigate(`/restaurant/${id}/info`)}>
                                    More Info
                                    <FontAwesomeIcon icon={faCircleInfo} />
                                </p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

            <div className="space-y-8 m-container">
                {/* Specials Section */}
                {specials.length > 0 && (
                    <div className="space-y-4 specials">
                        <h2>Specials</h2>
                        <div className="space-x-4 specials-body">
                            {specials.map((special) => (
                                <SpecialCard key={special.id} special={special} />
                            ))}
                        </div>

                        <Dialog open={!!selectedSpecial} onOpenChange={() => setSelectedSpecial(null)}>
                            <DialogContent className="sm:max-w-[425px]">
                                {selectedSpecial && (
                                    <>
                                        <DialogHeader>
                                            <DialogTitle>Special Offer</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <div className="relative w-full h-48 overflow-hidden rounded-lg">
                                                <img
                                                    src={selectedSpecial.image}
                                                    alt={selectedSpecial.title}
                                                    className="object-cover w-full h-full"
                                                />
                                                <Badge
                                                    className="absolute text-white bg-red-500 border-none top-3 right-3 hover:bg-red-600"
                                                >
                                                    Special
                                                </Badge>
                                            </div>

                                            <div>
                                                <h2 className="mb-2 text-xl font-semibold">{selectedSpecial.title}</h2>
                                                <p className="mb-4 text-sm text-muted-foreground">
                                                    {selectedSpecial.description}
                                                </p>

                                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                                    <Clock className="w-4 h-4" />
                                                    <span>
                                                        Valid from {new Date(selectedSpecial.startDate).toLocaleDateString()} to {new Date(selectedSpecial.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {selectedSpecial.price && (
                                                    <div className="mt-4">
                                                        <span className="text-xl font-bold text-primary">
                                                            ${selectedSpecial.price}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Categories Section */}
                <div className="space-y-4 categories">
                    <h2>Menu</h2>
                    <div className="search">
                        <input
                            type="text"
                            name="search"
                            placeholder={`Search ${restaurant?.name}`}
                            onClick={() => setIsSearchOpen(true)}
                            readOnly // Make it act like a button
                        />
                    </div>
                    <div className={isMobile ? "cat-container space-y-4" : "cat-body"}>
                        {isMobile ? (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="category-tile"
                                    onClick={() => navigate(`/restaurant/${id}/menu/${category._id}`)}
                                >
                                    <div className="flex items-center gap-3">
                                        {category.imageUrl && (
                                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                                                <img
                                                    src={category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:5000${category.imageUrl}`}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <h3>{category.name}</h3>
                                    </div>
                                    <FontAwesomeIcon icon={faChevronRight} className="icon-chevron" />
                                </div>
                            ))
                        ) : (
                            categories.map((category) => (
                                <div
                                    key={category._id}
                                    className="category-card"
                                    onClick={() => navigate(`/restaurant/${id}/menu/${category._id}`)}
                                >
                                    <img
                                        src={category.imageUrl ? (category.imageUrl.startsWith('http') ? category.imageUrl : `http://localhost:5000${category.imageUrl}`) : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                        alt={category.name}
                                    />
                                    <h2 className="category-title">{category.name}</h2>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add the SearchView component */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchView
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                        restaurantId={id}
                        restaurantName={restaurant?.establishmentName}
                        onMenuClick={handleMenuClick}
                        onCategoryClick={handleCategoryClick}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ViewRestaurant;