import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { getRestaurantRatings } from '@/lib/api';
import { ArrowLeft, Star, MessageSquare, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RatingSummary = ({ stats }) => {
    const total = stats.totalReviews;

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center gap-6 mb-6">
                    <div className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</div>
                    <div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-5 h-5 ${star <= Math.round(stats.averageRating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                            Based on {total} {total === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                            <div className="w-12 text-sm">{rating} stars</div>
                            <Progress
                                value={total > 0 ? (stats.ratingDistribution[rating] || 0) / total * 100 : 0}
                                className="flex-1"
                            />
                            <div className="w-12 text-sm text-right">
                                {stats.ratingDistribution[rating] || 0}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

const ReviewCard = ({ review }) => {
    const date = new Date(review.createdAt);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
        >
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`w-4 h-4 ${star <= review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="mt-1 font-medium">{review.userName || 'Anonymous'}</div>
                            <div className="text-sm text-muted-foreground">
                                {date.toLocaleDateString()}
                            </div>
                        </div>
                        {review.menuItemName && (
                            <div className="text-sm text-muted-foreground">
                                Reviewed: {review.menuItemName}
                            </div>
                        )}
                    </div>
                    <p className="mt-4 text-muted-foreground">{review.comment}</p>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const RestaurantReviews = () => {
    const { id: restaurantId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getRestaurantRatings(restaurantId);

                if (result.success) {
                    setReviews(result.data.reviews);
                    setStats(result.data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [restaurantId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-3xl p-4 mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Restaurant Reviews</h1>
                </div>

                {/* Rating Summary */}
                {stats && <RatingSummary stats={stats} />}

                {/* Reviews List */}
                <div className="space-y-4">
                    {reviews.length > 0 ? (
                        <AnimatePresence>
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="py-8 text-center">
                            <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/50" />
                            <h3 className="mt-4 text-lg font-medium">No reviews yet</h3>
                            <p className="mt-2 text-muted-foreground">
                                Be the first to review this restaurant!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RestaurantReviews;