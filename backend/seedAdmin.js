import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './src/models/Admin.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easymenu');
        console.log('MongoDB Connected to seed admin...');

        const email = 'admin@easymenu.com';
        const hashedPassword = await bcrypt.hash('admin123', 10);

        const adminExists = await Admin.findOne({ email });

        if (adminExists) {
            console.log('Admin already exists');
        } else {
            await Admin.create({
                email,
                password: hashedPassword,
                name: 'System Administrator'
            });
            console.log('Admin seeded successfully: admin@easymenu.com / admin123');
        }

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
