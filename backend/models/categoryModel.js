import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  main: {
    type: String,
    required: true,
    trim: true,
    maxLength: 32,
  },
  sub: {
    type: String,
    required: true,
    trim: true,
    maxLength: 32,
  },
  tags: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

// Create a compound index to ensure uniqueness for main and sub together
categorySchema.set('toObject', { virtuals: true });

categorySchema.index({ main: 1, sub: 1 }, { unique: true });

export default mongoose.model("Category", categorySchema);