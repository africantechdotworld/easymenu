import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getRestaurantProfile, getMenuCategories } from '@/lib/api';
import {
    ArrowLeft,
    Info,
    Clock,
    MapPin,
    Phone,
    ChevronRight,
    Star
} from 'lucide-react';

const RestaurantView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parseTimeString = (timeStr) => {
        // Split the time and the AM/PM modifier
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        // Adjust hours for PM (unless it's 12 PM) and for 12 AM
        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [restaurantResult, categoriesResult] = await Promise.all([
                    getRestaurantProfile(id),
                    getMenuCategories(id)
                ]);

                if (restaurantResult.success && categoriesResult.success) {
                    setRestaurant(restaurantResult.data);
                    setCategories(categoriesResult.data);
                } else {
                    setError("Failed to load restaurant data");
                }
            } catch (error) {
                setError("An error occurred while fetching data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    /*
const isOpen = () => {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    console.log(day);
    const time = now.toLocaleTimeString('en-US', { hour12: false });

    if (!restaurant?.businessHours?.[day]) return false;

    const from = restaurant.businessHours[day].from;
    const to = restaurant.businessHours[day].to;
    console.log(from, to);
    console.log('time: ', time);
    return time >= from && time <= to;
};
*/

    const isOpen = () => {
        const now = new Date();

        // Get the full day name (e.g., "wednesday") in lowercase
        const day = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        console.log(day);

        // Calculate the current time in minutes since midnight
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        console.log('Current minutes:', currentMinutes);

        // Make sure there are business hours defined for the day
        if (!restaurant?.businessHours?.[day]) return false;

        // Retrieve the opening and closing times
        const from = restaurant.businessHours[day].from; // e.g., "09:00 AM"
        const to = restaurant.businessHours[day].to;     // e.g., "09:30 PM"
        console.log('From:', from, 'To:', to);

        // Convert the business hours to minutes since midnight
        const fromMinutes = parseTimeString(from);
        const toMinutes = parseTimeString(to);
        console.log('From minutes:', fromMinutes, 'To minutes:', toMinutes);

        // Check if the current time is within the range
        return currentMinutes >= fromMinutes && currentMinutes <= toMinutes;
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Skeleton className="w-full h-64" />
                <div className="p-4 space-y-4">
                    <Skeleton className="w-32 h-32 -mt-16 border-4 rounded-full border-background" />
                    <Skeleton className="w-3/4 h-8" />
                    <Skeleton className="w-1/2 h-4" />
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-48 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-background">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6 space-y-4">
                        <p className="text-destructive">{error || "Restaurant not found"}</p>
                        <Button onClick={() => navigate('/')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-background"
        >
            {/* Cover Image */}
            <div className="relative h-64 bg-muted">
                <img
                    src={restaurant.coverPhoto || "/api/placeholder/800/400"}
                    alt={restaurant.establishmentName}
                    className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="flex items-start justify-between p-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => navigate('/')}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/20"
                            onClick={() => navigate(`/restaurant/${id}/info`)}
                        >
                            <Info className="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Restaurant Info */}
            <div className="relative z-10 px-4 -mt-16">
                <div className="mb-6">
                    <img
                        src={restaurant.profileLogo || "/api/placeholder/120/120"}
                        alt="Logo"
                        className="object-cover w-32 h-32 border-4 rounded-full shadow-lg border-background bg-background"
                    />
                </div>

                <div className="space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">{restaurant.businessName}</h1>
                        <p className="text-muted-foreground">{restaurant.description?.substring(0, 100)}</p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        <Badge variant={isOpen() ? "success" : "secondary"}>
                            <Clock className="w-4 h-4 mr-1" />
                            {isOpen() ? "Open Now" : "Closed"}
                        </Badge>
                        <Badge variant="outline">
                            <MapPin className="w-4 h-4 mr-1" />
                            {restaurant.address}
                        </Badge>
                        {restaurant.phone && (
                            <Badge variant="outline">
                                <Phone className="w-4 h-4 mr-1" />
                                {restaurant.phone}
                            </Badge>
                        )}
                    </div>

                    {restaurant.description && (
                        <p className="text-muted-foreground">
                            {restaurant.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Categories */}
            <ScrollArea className="h-[calc(100vh-24rem)] px-4 mt-6">
                <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 md:grid-cols-3">
                    {categories.map((category) => (
                        <motion.div
                            key={category.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Card
                                className="overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/restaurant/${id}/menu/${category.id}`)}
                            >
                                <div className="relative h-48">
                                    <img
                                        src={category.image || "/api/placeholder/400/300"}
                                        alt={category.name}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                                        <div className="flex items-center justify-between w-full text-white">
                                            <h3 className="text-lg font-semibold">{category.name}</h3>
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </ScrollArea>
        </motion.div>
    );
};

export default RestaurantView;