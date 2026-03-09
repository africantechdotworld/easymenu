import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
    AlertDialogDescription, AlertDialogFooter
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { submitReview, getMenuItemReviews, getMenuItemRatingStats } from '@/lib/api';
import { ArrowLeft, Star, StarHalf, MessageSquare, ThumbsUp, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StarRating = ({ rating, onRate, size = "md", disabled = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const starSizes = {
        sm: "w-4 h-4",
        md: "w-6 h-6",
        lg: "w-8 h-8"
    };

    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={disabled}
                    className={`text-yellow-400 ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
                    onMouseEnter={() => !disabled && setHoverRating(star)}
                    onMouseLeave={() => !disabled && setHoverRating(0)}
                    onClick={() => !disabled && onRate(star)}
                >
                    <Star
                        className={`${starSizes[size]} ${(hoverRating || rating) >= star
                            ? 'fill-current'
                            : 'fill-none'
                            }`}
                    />
                </button>
            ))}
        </div>
    );
};

const RatingStats = ({ stats }) => {
    const total = stats.totalReviews;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">{stats.averageRating.toFixed(1)}</div>
                <div>
                    <StarRating rating={Math.round(stats.averageRating)} disabled />
                    <div className="text-sm text-muted-foreground">
                        {total} {total === 1 ? 'review' : 'reviews'}
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center gap-2">
                        <div className="w-12 text-sm">{rating} stars</div>
                        <Progress
                            value={(stats.ratingDistribution[rating] / total) * 100}
                            className="flex-1"
                        />
                        <div className="w-12 text-sm text-right">
                            {stats.ratingDistribution[rating]}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ReviewRepliesModal = ({ isOpen, onClose, replies }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Restaurant Replies</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                    {replies.map((reply, index) => (
                        <Card key={index}>
                            <CardContent className="pt-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-medium">Restaurant Staff</div>
                                        <div className="text-sm text-muted-foreground">
                                            {new Date(reply.createdAt?.toDate?.() || reply.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-2 text-muted-foreground">{reply.text}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const ReviewCard = ({ review }) => {
    const [showReplies, setShowReplies] = useState(false);
    const date = review.createdAt instanceof Date
        ? review.createdAt
        : new Date(review.createdAt?.toDate?.() || review.createdAt);

    const hasReplies = review.replies && review.replies.length > 0;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <StarRating rating={review.rating} disabled size="sm" />
                                <div className="mt-1 font-medium">{review.userName || 'Anonymous'}</div>
                                <div className="text-sm text-muted-foreground">
                                    {date.toLocaleDateString()}
                                </div>
                            </div>
                            {hasReplies && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowReplies(true)}
                                    className="text-primary"
                                >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    {review.replies.length} {review.replies.length === 1 ? 'Reply' : 'Replies'}
                                </Button>
                            )}
                        </div>
                        <p className="mt-4 text-muted-foreground">{review.comment}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Replies Modal */}
            {hasReplies && (
                <ReviewRepliesModal
                    isOpen={showReplies}
                    onClose={() => setShowReplies(false)}
                    replies={review.replies}
                />
            )}
        </>
    );
};

const MenuReviews = () => {
    const { id: restaurantId, menuId } = useParams();
    const navigate = useNavigate();
    const [showConsentDialog, setShowConsentDialog] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [userName, setUserName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [reviewsResult, statsResult] = await Promise.all([
                    getMenuItemReviews(menuId),
                    getMenuItemRatingStats(menuId)
                ]);

                console.log('Reviews Result:', reviewsResult); // Debug log

                if (reviewsResult.success) {
                    setReviews(reviewsResult.data);
                }
                if (statsResult.success) {
                    setStats(statsResult.data);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [menuId, restaurantId]);

    const handleSubmit = async () => {
        if (!rating) return;

        try {
            setIsSubmitting(true);

            const reviewData = {
                menuItemId: menuId,
                restaurantId,
                rating,
                comment,
                userName: userName.trim() || 'Anonymous'
            };

            const result = await submitReview(reviewData);

            if (result.success) {
                // Add new review to list and update stats
                setReviews(prev => [result.data, ...prev]);
                const statsResult = await getMenuItemRatingStats(menuId);
                if (statsResult.success) {
                    setStats(statsResult.data);
                }

                // Reset form
                setRating(0);
                setComment('');
                setUserName('');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReviewStart = () => {
        // Continue with review
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4 bg-background">
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
                    <h1 className="text-2xl font-bold">Reviews & Ratings</h1>
                </div>

                {/* Rating Stats */}
                {stats && <RatingStats stats={stats} />}

                {/* Review Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Rating</label>
                            <StarRating
                                rating={rating}
                                onRate={setRating}
                                size="lg"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name (optional)</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Anonymous"
                                className="w-full px-3 py-2 border rounded-md"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Review</label>
                            <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Share your thoughts about this item..."
                                rows={4}
                            />
                        </div>

                        <Button
                            className="w-full"
                            onClick={handleSubmit}
                            disabled={!rating || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Review'
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Reviews List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Reviews</h2>
                    {reviews.length > 0 ? (
                        <AnimatePresence>
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </AnimatePresence>
                    ) : (
                        <div className="py-8 text-center text-muted-foreground">
                            No reviews yet. Be the first to review!
                        </div>
                    )}
                </div>
            </div>

            {/* Consent Dialog */}
            <AlertDialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Enable Reviews</AlertDialogTitle>
                        <AlertDialogDescription>
                            To submit reviews, we need to create an anonymous profile.
                            No personal information is required or collected.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Button variant="outline" onClick={() => setShowConsentDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={() => {
                            setShowConsentDialog(false);
                            handleReviewStart();
                        }}>
                            Accept & Continue
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default MenuReviews;