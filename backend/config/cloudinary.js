// config/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: './.env' }); 

// Configuration with fallbacks
const config = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
};

// Only configure Cloudinary if we have all required values
let storage = null;
if (config.cloud_name && config.api_key && config.api_secret) {
  cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
    secure: true
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'e-commerce',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit' }],
      unique_filename: true,
      overwrite: false
    }
  });
} else {
  console.warn('Cloudinary not configured - using local fallback for images');
}

export { cloudinary, storage };