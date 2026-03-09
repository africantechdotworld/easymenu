import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getRestaurantProfile } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
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
    Video,
    Image as ImageIcon,
    ChevronRight,
    X,
    Grid,
    Wifi, Utensils, Baby, Accessibility, Coffee,
    Music, Ban, CreditCard, ParkingCircle, Tag
} from 'lucide-react';


const FullGallery = ({ isOpen, onClose, images }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-50 overflow-hidden bg-background"
        >
            <div className="flex flex-col h-full">
                {/* Gallery Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <h2 className="text-xl font-semibold">Photo Gallery</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <Grid className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{images.length} Photos</span>
                    </div>
                </div>

                {/* Gallery Grid */}
                <ScrollArea className="flex-1 p-4">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {images.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative overflow-hidden rounded-lg cursor-pointer group aspect-square"
                                onClick={() => setSelectedImage(photo)}
                            >
                                <img
                                    src={photo.url}
                                    alt={photo.alt || 'Restaurant photo'}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
                                {photo.caption && (
                                    <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white bg-black/50">
                                        {photo.caption}
                                    </div>
                                )}
                                {photo.featured && (
                                    <div className="absolute px-2 py-1 text-xs text-white rounded-full top-2 left-2 bg-primary">
                                        Featured
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                                    <ImageIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Full-size Image Dialog */}
                <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                    <DialogContent className="max-w-4xl">
                        <div className="relative">
                            {
                                /*
                                <Button
                                variant="ghost"
                                size="icon"
                                className="absolute z-10 top-2 right-2"
                                onClick={() => setSelectedImage(null)}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                                */
                            }
                            {selectedImage && (
                                <img
                                    src={selectedImage.url}
                                    alt={selectedImage.alt}
                                    className="w-full h-auto rounded-lg"
                                />
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );
};

const RestaurantInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]);

    // Mock gallery data - replace with actual data from Firebase
    const mockGallery = [
        { id: 1, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Restaurant Interior' },
        { id: 2, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Outdoor Seating' },
        { id: 3, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Bar Area' },
        { id: 4, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Private Dining' },
        { id: 5, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Kitchen' },
        { id: 6, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Events Space' },
        { id: 7, url: 'https://menuflixer.com/uploads/67a393013f187_0821FOO-watermelon-poke-bowl-05fc63ca14684fb798e36ec8e9827e47.jpg', alt: 'Events Space' }
    ];

    const getAttributeIcon = (attribute) => {
        const iconMap = {
            wifi: Wifi,
            familyFriendly: Baby,
            wheelchairAccessible: Accessibility,
            buffet: Utensils,
            liveMusic: Music,
            nonSmoking: Ban,
            creditCardsAccepted: CreditCard,
            parking: ParkingCircle,
            servesAlcohol: Coffee
        };

        return iconMap[attribute] || Tag;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getRestaurantProfile(id);
                if (result.success) {
                    setRestaurant(result.data);

                    // Set gallery images from Firebase data
                    if (result.data.gallery && Array.isArray(result.data.gallery)) {
                        setGalleryImages(result.data.gallery);
                    }
                } else {
                    setError("Restaurant not found");
                }
            } catch (error) {
                setError("Failed to load restaurant data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Get featured image or first image
    const getFeaturedImage = () => {
        if (!galleryImages || galleryImages.length === 0) return null;
        return galleryImages.find(img => img.featured) || galleryImages[0];
    };

    const formatTime = (time) => {
        return time === 'closed' ? 'Closed' : time;
    };

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

    const getEnabledAmenities = () => {
        if (!restaurant || !restaurant.attributes) return [];

        const amenities = [];

        // Add predefined amenities
        if (restaurant.attributes.predefined) {
            Object.entries(restaurant.attributes.predefined).forEach(([key, isEnabled]) => {
                if (isEnabled) {
                    amenities.push({
                        type: 'predefined',
                        key,
                        label: key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/^./, str => str.toUpperCase())
                    });
                }
            });
        }

        // Add custom amenities
        if (restaurant.attributes.custom) {
            restaurant.attributes.custom.forEach(amenity => {
                amenities.push({
                    type: 'custom',
                    key: amenity,
                    label: amenity
                });
            });
        }

        return amenities;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-muted/50">
                <div className="w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error || !restaurant) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-muted/50">
                <Card className="w-full max-w-md text-center">
                    <CardContent className="pt-6 space-y-4">
                        <p className="text-destructive">{error || "Restaurant not found"}</p>
                        <Button onClick={() => navigate(`/restaurant/${id}`)}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Restaurant
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    const amenities = getEnabledAmenities();
    console.log(amenities);

    return (
        <div className="min-h-screen p-4 bg-muted/50">
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
                        <CardTitle>About {restaurant.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">
                            {restaurant.description}
                        </p>

                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{restaurant.address}</span>
                            </div>

                            {restaurant.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                    <span>{restaurant.phone}</span>
                                </div>
                            )}

                            {restaurant.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                        {restaurant.website.replace(/^https?:\/\//, '')}
                                    </a>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Photo Gallery Card */}
                {galleryImages.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Photo Gallery</CardTitle>
                            {galleryImages.length > 6 && (
                                <Button
                                    variant="ghost"
                                    className="text-primary"
                                    onClick={() => setIsGalleryOpen(true)}
                                >
                                    See all photos
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                {galleryImages.slice(0, 6).map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="relative overflow-hidden rounded-lg cursor-pointer group aspect-video"
                                        onClick={() => setSelectedImage(photo)}
                                    >
                                        <img
                                            src={photo.url}
                                            alt={photo.alt || 'Restaurant photo'}
                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                        />
                                        {photo.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 p-2 text-sm text-white bg-black/50">
                                                {photo.caption}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 bg-black/40 group-hover:opacity-100">
                                            <ImageIcon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Amenities Card Section */}
                {amenities.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Amenities & Features</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {amenities.map((amenity) => {
                                    const Icon = amenity.type === 'predefined'
                                        ? getAttributeIcon(amenity.key)
                                        : Tag;

                                    return (
                                        <Badge key={amenity.key} variant="secondary" className="flex items-center gap-1 px-3 py-2">
                                            <Icon className="w-3 h-3" />
                                            <span>{amenity.label}</span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Business Hours Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Business Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {restaurant.businessHours && Object.entries(restaurant.businessHours).map(([day, hours]) => (
                                <div key={day} className="flex items-center justify-between py-2">
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
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                                                className="flex items-center gap-2 p-3 transition-colors border rounded-lg hover:bg-muted"
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

            {/* Full-size Image Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-4xl">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute z-10 top-2 right-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                        {selectedImage && (
                            <img
                                src={selectedImage.url}
                                alt={selectedImage.alt}
                                className="w-full h-auto rounded-lg"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Full Page Gallery */}
            <AnimatePresence>
                {isGalleryOpen && (
                    <FullGallery
                        isOpen={isGalleryOpen}
                        onClose={() => setIsGalleryOpen(false)}
                        images={galleryImages}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default RestaurantInfo;