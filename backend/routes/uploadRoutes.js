
// routes/productRoutes.js
import express from 'express';
import multer from 'multer';
import { storage } from '../config/cloudinary.js';
import Product from '../models/productModel.js';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer based on storage availability
const upload = storage ? 
  multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpe?g|png|webp/;
      const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
      const extname = path.extname(file.originalname).toLowerCase();
      const mimetype = file.mimetype;

      if (filetypes.test(extname) && mimetypes.test(mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('Images only'), false);
      }
    }
  }) : 
  multer({
    dest: path.join(__dirname, '././public/uploads'),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const filetypes = /jpe?g|png|webp/;
      const extname = path.extname(file.originalname).toLowerCase();
      if (filetypes.test(extname)) {
        cb(null, true);
      } else {
        cb(new Error('Images only'), false);
      }
    }
  });

const router = express.Router();

router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, price, category, quantity, brand } = req.body;
    let images = [];

    if (req.files?.length > 0) {
      if (storage) {
        // Cloudinary upload
        images = req.files.map(file => ({
          url: file.path,
          public_id: file.filename,
          alt: name || 'Product image',
          isPrimary: false
        }));
      } else {
        // Local file upload
        images = await Promise.all(req.files.map(async (file) => {
          const newFilename = `${Date.now()}-${file.originalname}`;
          const newPath = path.join(__dirname, '../../public/uploads', newFilename);
          await fs.rename(file.path, newPath);
          return {
            url: `/uploads/${newFilename}`,
            alt: name || 'Product image',
            isPrimary: false,
            isLocal: true
          };
        }));
      }
      images[0].isPrimary = true;
    } else {
      // No images uploaded
      images = [{
        url: '/uploads/default-product.jpg',
        alt: name || 'Default product image',
        isPrimary: true,
        isLocal: true
      }];
    }

    const product = new Product({
      name,
      description: description || '',
      price: parseFloat(price),
      category,
      quantity: parseInt(quantity, 10),
      brand: brand || 'Unbranded',
      images
    });

    await product.save();

    // Prepare response with proper URLs
    const baseUrl = process.env.BASE_URL;
    res.status(201).json({
      success: true,
      product: {
        ...product.toObject(),
        images: product.images.map(img => ({
          ...img,
          url: img.isLocal ? `${baseUrl}${img.url}` : img.url
        }))
      }
    });

  } catch (error) {
    console.error('Product creation error:', error);
    
    // Cleanup files if error occurred
    if (req.files?.length > 0 && !storage) {
      await Promise.all(req.files.map(file => 
        fs.unlink(file.path).catch(console.error)
      ));
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors,
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during product creation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

export default router;