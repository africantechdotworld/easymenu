import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }, // Optional, for item-specific reviews
    userName: { type: String, default: 'Anonymous' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Review', reviewSchema);
