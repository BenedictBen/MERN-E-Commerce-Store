import mongoose from 'mongoose';
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js"; 
import { cloudinary } from '../config/cloudinary.js';
import path from 'path';
import fs from 'fs/promises'; // You'll need this for file operations

// Cloudinary image upload helper
const uploadToCloudinary = async (file) => {
  try {
    // Check if file exists using fs.promises.access
    try {
      await fs.access(file.path);
    } catch (err) {
      throw new Error('File does not exist or path is invalid');
    }

    // Get file stats using fs.promises.stat
    const stats = await fs.stat(file.path);
    if (stats.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds 10MB limit');
    }

    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'e-commerce',
      transformation: { 
        width: 800, 
        height: 800, 
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      },
      resource_type: 'auto'
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      alt: file.name || 'Product image'
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  } finally {
    // Ensure temp file cleanup
    if (file.path) {
      try {
        await fs.unlink(file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  }
};

// Cloudinary image deletion helper
const deleteFromCloudinary = async (publicId) => {
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

// In your productController.js file
const addProduct = asyncHandler(async (req, res) => {
  try {
    const data = req.fields || req.body;
    const { name, description, price, category, quantity, brand } = data;
    const imageFiles = req.files?.images;

    // Validation
    const requiredFields = { name, price, category, quantity };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null || value === '')
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missingFields,
        details: `Missing: ${missingFields.join(', ')}`
      });
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Product name is required and must be a non-empty string"
      });
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        error: "Price must be a valid number"
      });
    }

    if (isNaN(numericQuantity)) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a valid number"
      });
    }

    // Category handling
    let categoryId = category;
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const foundCategory = await mongoose.model('Category').findOne({ name: category });
      if (!foundCategory) {
        return res.status(400).json({
          success: false,
          error: "Invalid category",
          details: `Category '${category}' not found`
        });
      }
      categoryId = foundCategory._id;
    }

    // Process images with Cloudinary
    const uploadedImages = [];
    let uploadErrors = [];
    
    if (imageFiles) {
      const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      
      for (const file of filesArray) {
        try {
          const ext = path.extname(file.name).toLowerCase();
          const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
          
          if (!validExtensions.includes(ext)) {
            uploadErrors.push(`Invalid file type: ${file.name}`);
            continue;
          }

          const uploadedImage = await uploadToCloudinary(file);
          uploadedImages.push({
            ...uploadedImage,
            alt: name || 'Product image',
            isPrimary: uploadedImages.length === 0
          });
        } catch (uploadError) {
          uploadErrors.push(`Failed to upload ${file.name}: ${uploadError.message}`);
          continue;
        }
      }
    }

    // Create product
    const product = new Product({
      name,
      description: description || "",
      price: numericPrice,
      category: categoryId,
      quantity: numericQuantity,
      brand: brand || "Unbranded",
      images: uploadedImages.length > 0 ? uploadedImages : [{
        url: 'https://res.cloudinary.com/dp4dqtywa/image/upload/v12345/default-product.jpg',
        alt: name || 'Product image',
        isPrimary: true
      }]
    });

    await product.save();

    // Add product to category
    await Category.findByIdAndUpdate(
      categoryId,
      { $addToSet: { products: product._id } },
      { new: true }
    );

    // Response with upload details
    const response = {
      success: true,
      product: product.toObject(),
      images: {
        uploaded: uploadedImages.length,
        attempted: imageFiles ? (Array.isArray(imageFiles) ? imageFiles.length : 1) : 0,
        errors: uploadErrors.length > 0 ? uploadErrors : undefined
      }
    };

    if (uploadedImages.length === 0 && imageFiles) {
      response.warning = "No valid images were uploaded - using default image";
    }

    res.status(201).json(response);

  } catch (error) {
    console.error('Product creation error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry",
        details: error.message
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during product creation',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});


const updateProductDetails = asyncHandler(async (req, res) => {
  try {
    const data = req.fields || req.body;
    const { name, description, price, category, quantity, brand, deletedImages } = data;
    const imageFiles = req.files?.images;

    // Validation (unchanged)
    const requiredFields = { name, price, category, quantity };
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => value === undefined || value === null || value === '')
      .map(([field]) => field);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        missingFields,
        details: `Missing: ${missingFields.join(', ')}`
      });
    }

    const numericPrice = parseFloat(price);
    const numericQuantity = parseInt(quantity);

    if (isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        error: "Price must be a valid number"
      });
    }

    if (isNaN(numericQuantity)) {
      return res.status(400).json({
        success: false,
        error: "Quantity must be a valid number"
      });
    }

    // Find existing product
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: "Product not found"
      });
    }

    // Delete removed images from Cloudinary
    if (deletedImages && deletedImages.length > 0) {
      await Promise.all(
        deletedImages.map(publicId => deleteFromCloudinary(publicId))
      );
    }

    // Upload new images to Cloudinary
    const newImages = [];
    if (imageFiles) {
      const filesArray = Array.isArray(imageFiles) ? imageFiles : [imageFiles];
      
      for (const file of filesArray) {
        const ext = path.extname(file.name).toLowerCase();
        const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
        
        if (!validExtensions.includes(ext)) {
          continue;
        }

        try {
          const uploadedImage = await uploadToCloudinary(file);
          newImages.push({
            ...uploadedImage,
            alt: name || 'Product image'
          });
        } finally {
          // Clean up temp file
          if (file.path) await fs.promises.unlink(file.path).catch(console.error);
        }
      }
    }

    // Filter out deleted images and add new ones
    const updatedImages = [
      ...product.images.filter(img => !deletedImages?.includes(img.public_id)),
      ...newImages
    ];

    // Ensure we have at least one image
    if (updatedImages.length === 0) {
      updatedImages.push({
        url: 'https://res.cloudinary.com/dp4dqtywa/image/upload/v12345/default-product.jpg',
        alt: name || 'Product image',
        isPrimary: true
      });
    }

    // Update product
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description: description || "",
        price: numericPrice,
        category,
        quantity: numericQuantity,
        brand: brand || "Unbranded",
        images: updatedImages
      },
      { new: true, runValidators: true }
    );

     // Update category reference if category changed
     if (updatedProduct.category.toString() !== category.toString()) {
      // Remove from old category
      await Category.findByIdAndUpdate(
        updatedProduct.category,
        { $pull: { products: updatedProduct._id } }
      );
      
      // Add to new category
      await Category.findByIdAndUpdate(
        category,
        { $addToSet: { products: updatedProduct._id } }
      );
    }

    res.json({
      success: true,
      product: updatedProduct
    });

  } catch (error) {
    console.error('Product update error:', error);
    
    // Error handling (unchanged)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Duplicate entry",
        details: error.message
      });
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).reduce((acc, err) => {
        acc[err.path] = err.message;
        return acc;
      }, {});

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error during product update'
    });
  }
});


const removeProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from Cloudinary
    const publicIds = product.images
      .map(img => img.public_id)
      .filter(publicId => publicId && !publicId.includes('default-product'));
    
    if (publicIds.length > 0) {
      await Promise.all(publicIds.map(publicId => deleteFromCloudinary(publicId)));
    }
 // Remove product reference from category
 await Category.findByIdAndUpdate(
  product.category,
  { $pull: { products: product._id } }
);
    await product.deleteOne();
    res.json({ success: true, message: "Product removed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

const fetchProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createdAt: -1 });

    const baseUrl = process.env.BASE_URL;
    
    const productsWithFullUrls = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(img => ({
        ...img,
        url: img.url.startsWith('http') ? img.url : `${baseUrl}${img.url}`
      }))
    }));

    res.json({
      success: true,
      count: products.length,
      products: productsWithFullUrls
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error fetching products'
    });
  }
});

const fetchProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");

    if (!product) {
      console.error("Product not found:", req.params.id); // ✅ Debugging
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Server error" });
  }
});


const fetchAllProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .sort({ createAt: -1 });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Initialize ratings object if it doesn't exist
    if (!product.ratings) {
      product.ratings = {
        count: 0,
        average: 0,
        distribution: {}
      };
    }

    // Check if user has already reviewed the product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already reviewed");
    }

    // Create review object
    const review = {
      name: req.user.username,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Initialize reviews array if it doesn't exist
    if (!product.reviews) {
      product.reviews = [];
    }

    // Add review to the product
    product.reviews.push(review);

    // Update aggregated ratings
    product.ratings.count = product.reviews.length;
    product.ratings.average =
      product.reviews.reduce((acc, cur) => acc + cur.rating, 0) / product.reviews.length;

    // Update rating distribution
    const ratingKey = String(Math.floor(rating));
    product.ratings.distribution[ratingKey] =
      (product.ratings.distribution[ratingKey] || 0) + 1;

    await product.save();
    res.status(201).json({
      message: "Review added successfully",
      reviews: product.reviews,
      ratings: product.ratings,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

const fetchTopProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const fetchNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ _id: -1 }).limit(5);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
});

const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;

    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
});

export {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
};
