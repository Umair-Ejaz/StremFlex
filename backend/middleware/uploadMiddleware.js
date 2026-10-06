import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: isVideo ? 'youtube_clone/videos' : 'youtube_clone/thumbnails',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo ? ['mp4', 'mkv', 'webm'] : ['jpg', 'png', 'jpeg', 'webp'],
    };
  },
});

const upload = multer({ storage });

export default upload;