// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // We keep the slug as unique so you can look up products by slug
    slug: { type: String, required: false, unique: true },
    name: { type: String, required: true },
    // Category is an object with main, sub, and tags
    category: {
      main: { type: String, required: true },
      sub: { type: String, required: true },
      tags: { type: [String], default: [] },
    },
    price: { type: Number, required: true },
    oldPrice: { type: Number },
    // Use camelCase for field names in JS (you can map "sub-title" to subTitle)
    subTitle: { type: String },
    subDescription: { type: String },
    description: { type: String, required: true },
    // moreInfo is an array of strings
    moreInfo: { type: [String], default: [] },
    // Images: each with url, alt, and isPrimary
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],
    // Variants may have several keys (colors, storage, sizes, finishes, etc.)
    variants: {
      colors: [{
        name: { type: String, default: '' },
        value: { type: String, default: '' }
      }],
      storage: [{
        value: { type: String, default: '' }
      }],
      sizes: [{
        name: { type: String, default: '' }
      }],
      finishes: [{
        name: { type: String, default: '' },
        stock: { type: Number, default: 0, min: 0 },
        priceAdjustment: { type: Number, default: 0 },
        images: [String]
      }]
    },
    // details: specs, features, manufacturer, etc.
    details: { type: mongoose.Schema.Types.Mixed, default: {} },
    // ratings: average, count, distribution (as mixed to allow object)
    ratings: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      distribution: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    // inventory information: stock, sku, restockDate, location
    inventory: { type: mongoose.Schema.Types.Mixed, default: {} },
    // shipping info: weight, dimensions, freeShipping, etc.
    shipping: { type: mongoose.Schema.Types.Mixed, default: {} },
    // similarProducts: array of objects (you can store them as mixed)
    similarProducts: { type: [mongoose.Schema.Types.Mixed], default: [] },
    // metadata: createdAt, updatedAt, staffPick, etc.
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// Add pre-save hook to generate slugs
productSchema.pre('save', async function(next) {
  if (!this.slug && this.name) {
    let baseSlug = this.name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
      
    let slug = baseSlug;
    let counter = 1;
    
    // Check for existing slugs
    while (true) {
      const exists = await this.constructor.findOne({ slug });
      if (!exists) break;
      slug = `${baseSlug}-${counter++}`;
    }
    
    this.slug = slug;
  }
  next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
