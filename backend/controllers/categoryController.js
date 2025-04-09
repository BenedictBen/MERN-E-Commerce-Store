import Category from "../models/categoryModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import Product from "../models/productModel.js";
import mongoose from 'mongoose';

// Create a new category with main, sub, and optional tags
const createCategory = asyncHandler(async (req, res) => {
  try {
    const { main, sub, tags } = req.body;
    if (!main || !sub) {
      return res.json({ error: "Both main and sub category fields are required" });
    }

    // Find existing category by main and sub
    const existingCategory = await Category.findOne({ main, sub });
    if (existingCategory) {
      return res.json({ error: "Category already exists" });
    }

    const category = await new Category({ main, sub, tags }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
});

// Update an existing category by its ID
const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { main, sub, tags } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Update fields; use new values if provided, else keep current ones
    category.main = main || category.main;
    category.sub = sub || category.sub;
    if (tags) {
      category.tags = tags;
    }

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove a category by its ID
const removeCategory = asyncHandler(async (req, res) => {
  try {
    const removed = await Category.findByIdAndRemove(req.params.categoryId);
    res.json(removed);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// List all categories
const listCategory = asyncHandler(async (req, res) => {
  try {
    const allCategories = await Category.find({}).lean();

    // Group by `main` category
    const grouped = allCategories.reduce((acc, category) => {
      const existing = acc.find(item => item.main === category.main);
      const subData = {
  
        sub: category.sub,
        tags: category.tags
      };

      if (existing) {
        existing.subs.push(subData);
      } else {
        acc.push({
          _id: category._id, // ✅ Add the _id for the main category
          main: category.main,
          subs: [subData]
        });
      }

      return acc;
    }, []);

    res.json(grouped);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});


// Read a single category by its ID
const readCategory = asyncHandler(async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.json(category);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error.message);
  }
});

const getCategoryProducts = asyncHandler(async (req, res) => {
  try {
    // Validate the category ID first
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid category ID format"
      });
    }
    // 1. Find the main category
    const mainCategory = await Category.findById(req.params.id);
    
    if (!mainCategory) {
      return res.status(404).json({ 
        success: false,
        error: "Category not found" 
      });
    }

    // 2. Find ALL subcategories that share the same main category name
    const subCategories = await Category.find({ 
      main: mainCategory.main 
    });

    // 3. Get IDs of all related categories (main + subs)
    const categoryIds = [
      mainCategory._id,
      ...subCategories.map(sub => sub._id)
    ];

    // 4. Query products from ALL these categories
    const products = await Product.find({ 
      category: { $in: categoryIds } 
    })
    .select('name price images slug')
    .sort({ createdAt: -1 })
    .limit(100)
    .exec();
    
    res.json({
      success: true,
      category: {
        _id: mainCategory._id,
        main: mainCategory.main,
        sub: mainCategory.sub,
        tags: mainCategory.tags
      },
      products: products.map(product => ({
        _id: product._id,
        name: product.name,
        price: product.price,
        slug: product.slug,
        primaryImage: product.images.find(img => img.isPrimary) || product.images[0]
      }))
    });
  } catch (error) {
    console.error("Error fetching category products:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch category products",
      details: error.message 
    });
  }
});

export {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
  getCategoryProducts,
};
