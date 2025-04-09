import mongoose from "mongoose";
import Category from "./models/categoryModel.js";
import Product from "./models/productModel.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const __dirname = path.resolve();
const jsonFilePath = path.join(__dirname, "..", "frontend", "public", "data", "product.json");

let productsData;
try {
  const data = fs.readFileSync(jsonFilePath, "utf-8");
  productsData = JSON.parse(data);
} catch (err) {
  console.error("Error reading JSON file:", err);
  process.exit(1);
}

// Step 1: Extract unique categories from JSON data using a Map.
const uniqueCategories = new Map();

productsData.products.forEach((prodData) => {
  let catData = prodData.category; // Expected: { main, sub, tags }
  if (!catData || !catData.main || !catData.sub) {
    console.log(`Skipping product ${prodData.slug} due to missing category data.`);
    return;
  }
  // Create a key to uniquely identify a category
  const key = `${catData.main}|${catData.sub}`;
  if (!uniqueCategories.has(key)) {
    uniqueCategories.set(key, {
      main: catData.main,
      sub: catData.sub,
      tags: catData.tags || [],
    });
  }
});

// Step 2: Upsert each unique category into the Categories collection.
const upsertCategories = async () => {
  const upsertedCategories = new Map(); // Key: unique key, Value: category document
  for (const [key, catData] of uniqueCategories.entries()) {
    // Use findOneAndUpdate with upsert:true so that if it exists, we update it,
    // otherwise we insert a new document.
    const categoryDoc = await Category.findOneAndUpdate(
      { main: catData.main, sub: catData.sub },
      { $set: { tags: catData.tags } },
      { new: true, upsert: true }
    );
    upsertedCategories.set(key, categoryDoc);
    console.log(`Upserted category: ${categoryDoc.main} > ${categoryDoc.sub}`);
  }
  return upsertedCategories;
};

const updateProductsCategory = async (upsertedCategories) => {
  // Step 3: For each product in JSON, update its category field to reference the correct Category ObjectId.
  for (const prodData of productsData.products) {
    let catData = prodData.category;
    if (!catData || !catData.main || !catData.sub) continue;
    const key = `${catData.main}|${catData.sub}`;
    const categoryDoc = upsertedCategories.get(key);
    if (categoryDoc) {
      await Product.updateOne(
        { slug: prodData.slug },
        { $set: { category: categoryDoc._id } }
      );
      console.log(`Updated product ${prodData.slug} with category ${key}`);
    }
  }
};

const populateCategories = async () => {
  try {
    const upsertedCategories = await upsertCategories();
    await updateProductsCategory(upsertedCategories);
    console.log("Categories populated/updated successfully!");
    process.exit();
  } catch (error) {
    console.error("Error populating categories:", error);
    process.exit(1);
  }
};

populateCategories();
