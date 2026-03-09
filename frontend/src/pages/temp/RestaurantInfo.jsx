import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProfileDataFromFirebase } from '@/data/firebaseFunctions';
import { 
    ArrowLeft, 
    Clock, 
    MapPin, 
    Phone, 
    Globe, 
    Facebook, 
    Instagram, 
    Twitter, 
    MessageSquare,
    Video
} from 'lucide-react';

const RestaurantInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const result = await getProfileDataFromFirebase(id);
                if (result.success) {
                    setRestaurant(result.data);
                } else {
                    setError("Restaurant not found");
                }
            } catch (error) {
                setError("Failed to load restaurant data");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurantData();
    }, [id]);

    const getSocialIcon = (platform) => {
        switch (platform) {
            case 'facebook': return Facebook;
            case 'instagram': return Instagram;
            case 'twitter': return Twitter;
            case 'tiktok': return Video;
            case 'whatsapp': return MessageSquare;
            case 'website': return Globe;
            default: return Globe;
        }
    };

    const formatTime = (time) => {
        return time === 'closed' ? 'Closed' : time;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-muted/50 flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-muted/50 p-4 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6 text-center">
                        <p className="text-red-500 mb-4">{error}</p>
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
        <div className="min-h-screen bg-muted/50 p-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate(`/restaurant/${id}`)}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <h1 className="text-2xl font-bold">Restaurant Information</h1>
                </div>

                {/* Basic Info Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>About {restaurant.businessName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            {restaurant.description}
                        </p>
                        
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{restaurant.businessAddress}</span>
                            </div>
                            
                            {restaurant.phoneNumber && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{restaurant.phoneNumber}</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Business Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Business Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {restaurant.businessHours && Object.entries(restaurant.businessHours).map(([day, hours]) => (
                                <div key={day} className="flex justify-between items-center py-2">
                                    <span className="capitalize">{day}</span>
                                    <span className="text-muted-foreground">
                                        {hours.isOpen 
                                            ? `${formatTime(hours.from)} - ${formatTime(hours.to)}`
                                            : 'Closed'
                                        }
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Social Media Links */}
                {restaurant.socialMedia && Object.entries(restaurant.socialMedia).some(([_, data]) => data.enabled) && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Connect With Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(restaurant.socialMedia)
                                    .filter(([_, data]) => data.enabled)
                                    .map(([platform, data]) => {
                                        const Icon = getSocialIcon(platform);
                                        return (
                                            <a
                                                key={platform}
                                                href={data.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 p-3 rounded-lg border hover:bg-muted transition-colors"
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="capitalize">{platform}</span>
                                            </a>
                                        );
                                    })
                                }
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Additional Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span>Business Type</span>
                            <span className="text-muted-foreground">{restaurant.businessType}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                            <span>Category</span>
                            <span className="text-muted-foreground">{restaurant.businessCategory}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RestaurantInfo;