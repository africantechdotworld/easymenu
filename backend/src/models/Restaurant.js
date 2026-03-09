import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    description: { type: String },
    address: { type: String },
    phone: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    bannerUrl: { type: String },
    themeColor: { type: String, default: '#e11d48' }, // Default red-rose color
    businessHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Restaurant', restaurantSchema);
