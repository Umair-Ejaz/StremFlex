import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Video from './models/Video.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/youtube_clone');
    console.log('Connected to MongoDB for seeding...');

    await User.deleteMany();
    await Video.deleteMany();
    console.log('Cleared existing data...');

    // Create both Admin and Regular user
    const createdUsers = await User.create([
      {
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123',
        isAdmin: true,
      },
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: 'password123',
        isAdmin: false,
      },
    ]);

    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[1]._id;

    console.log('Users seeded successfully');

    await Video.insertMany([
      {
        title: 'Full Stack MERN Tutorial',
        description: 'Learn MongoDB, Express, React, and Node.js from scratch.',
        sourceType: 'youtube',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600',
        uploader: adminUser,
        views: 1250,
      },
      {
        title: 'Cloudinary Video Upload Integration',
        description: 'How to stream file uploads using Multer and Cloudinary in Express.',
        sourceType: 'local',
        videoUrl: 'https://res.cloudinary.com/demo/video/upload/dog.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=600',
        uploader: regularUser,
        views: 340,
      },
    ]);

    console.log('Videos seeded successfully');
    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error(`Error during seeding: ${error.message}`);
    process.exit(1);
  }
};

seedData();