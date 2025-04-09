import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { 
      type: Number, 
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value between 1-5'
      }
    },
    comment: { type: String, required: true, minlength: 10 },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values despite unique index
      trim: true,
      lowercase: true
    },
    images: [{
      url: { 
        type: String, 
        required: true,
        default: '/images/default-product.jpg',
        validate: {
          validator: function(v) {
            return /\.(jpg|jpeg|png|webp)$/i.test(v);
          },
          message: props => `${props.value} is not a valid image URL!`
        }
      },
      alt: {
        type: String,
        default: 'Product image'
      },
      isPrimary: {
        type: Boolean,
        default: false
      }
    }],
    brand: { 
      type: String, 
      required: false,
      default: 'Unbranded',
      trim: true,
      maxlength: 50
    },
    quantity: { 
      type: Number, 
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    category: { 
      type: ObjectId, 
      ref: "Category", 
      required: true,
      index: true 
    },
    description: { 
      type: String, 
      required: true,
      minlength: 50,
      maxlength: 2000 
    },
    reviews: [reviewSchema],
    ratings: {
      count: { type: Number, default: 0, min: 0 },
      average: { 
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5,
        set: v => parseFloat(v.toFixed(2))
      },
      distribution: {
        1: { type: Number, default: 0, min: 0 },
        2: { type: Number, default: 0, min: 0 },
        3: { type: Number, default: 0, min: 0 },
        4: { type: Number, default: 0, min: 0 },
        5: { type: Number, default: 0, min: 0 }
      }
    },
    price: { 
      type: Number, 
      required: true, 
      default: 0,
      min: 0,
      set: v => parseFloat(v.toFixed(2))
    },
    countInStock: { 
      type: Number, 
      required: true, 
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    variants: {
      colors: [{ 
        name: { type: String, required: false }, // Changed to false
        value: { type: String, required: false }  // Changed to false
      }],
      storage: [{ 
        value: { type: String, required: false } // Changed to false
      }],
      sizes: [{ 
        name: { type: String, required: false }  // Changed to false
      }],
      finishes: [{
        name: { type: String, required: true },
        stock: { 
          type: Number, 
          required: true,
          min: 0,
          default: 0
        },
        priceAdjustment: {
          type: Number,
          default: 0
        },
        images: [String]
      }]
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);
 
// Compound index for better query performance
productSchema.index({ 
  name: 'text', 
  description: 'text',
  brand: 1,
  category: 1,
  price: 1,
  'variants.colors.value': 1,
  'variants.storage.value': 1,
  'variants.sizes.name': 1
});

// Virtual for total available stock including variants
productSchema.virtual('totalStock').get(function() {
  if (this.variants?.finishes?.length > 0) {
    return this.variants.finishes.reduce((sum, finish) => sum + (finish.stock || 0), 0);
  }
  return this.countInStock;
});

// Middleware to update countInStock when variants change
productSchema.pre('save', function(next) {
  if (this.isModified('variants.finishes') && this.variants?.finishes) {
    this.countInStock = this.variants.finishes.reduce(
      (sum, finish) => sum + (finish.stock || 0), 0
    );
  }
  next();
});

// Add pre-save hook to automatically generate slugs
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')     // Replace spaces with -
      .replace(/[^\w\-]+/g, '')  // Remove all non-word chars
      .replace(/\-\-+/g, '-')    // Replace multiple - with single -
      .replace(/^-+/, '')        // Trim - from start of text
      .replace(/-+$/, '');       // Trim - from end of text
  }
  next();
});

// Static method for updating ratings
productSchema.statics.updateProductRatings = async function(productId) {
  const product = await this.findById(productId);
  if (!product) return;

  const reviews = product.reviews;
  const count = reviews.length;
  const average = count > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
    : 0;

  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach(review => {
    const rating = Math.floor(review.rating);
    distribution[rating]++;
  });

  await this.findByIdAndUpdate(productId, {
    $set: {
      'ratings.count': count,
      'ratings.average': parseFloat(average.toFixed(2)),
      'ratings.distribution': distribution
    }
  });
};

const Product = mongoose.model("Product", productSchema);
export default Product;
