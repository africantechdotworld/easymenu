import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String },
    orderInfo: { type: Number, default: 0 },
});

export default mongoose.model('MenuCategory', categorySchema);
