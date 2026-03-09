import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Loader2, User } from 'lucide-react';
import { getRestaurantRatings, getAuthProfile } from '@/lib/api';
import { Progress } from "@/components/ui/progress";

const DashboardReviews = () => {
    const [stats, setStats] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const profile = await getAuthProfile();
            if (profile.success) {
                const res = await getRestaurantRatings(profile.data._id);
                if (res.success) {
                    setStats(res);
                    // Add mock reviews if empty for visualization
                    setReviews(res.reviews || []);
                }
            }
            setLoading(false);
        };
        fetchReviews();
    }, []);

    if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const ratingDistribution = stats?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const totalReviews = stats?.totalReviews || 0;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Customer Reviews</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Stats */}
                <Card className="border-none shadow-sm h-fit">
                    <CardHeader><CardTitle className="text-lg">Rating Overview</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-4">
                            <h2 className="text-5xl font-bold text-slate-900">{stats?.averageRating?.toFixed(1) || '0.0'}</h2>
                            <div className="flex justify-center gap-1 my-3 text-amber-400">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star key={star} className={`w-5 h-5 ${star <= Math.round(stats?.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-slate-400">Based on {totalReviews} reviews</p>
                        </div>

                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map(stars => (
                                <div key={stars} className="flex items-center gap-4 text-sm">
                                    <span className="w-4 font-medium text-slate-600">{stars}</span>
                                    <Progress
                                        value={totalReviews > 0 ? (ratingDistribution[stars] / totalReviews) * 100 : 0}
                                        className="h-2 flex-1"
                                    />
                                    <span className="w-10 text-right text-slate-400">{ratingDistribution[stars]}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Review List */}
                <div className="lg:col-span-2 space-y-4">
                    {reviews.length > 0 ? (
                        reviews.map((review, i) => (
                            <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                                            <User className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{review.userName || 'Anonymous'}</h4>
                                                    <div className="flex gap-0.5 text-amber-400 mt-0.5">
                                                        {[1, 2, 3, 4, 5].map(s => (
                                                            <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400">
                                                    {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Recently'}
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                            <MessageSquare className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-slate-800">No Reviews Yet</h3>
                            <p className="text-slate-500">Reviews for your restaurant will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardReviews;
