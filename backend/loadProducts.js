import mongoose from "mongoose";
import Product from "./models/Product.js";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables (adjust path if needed)
dotenv.config({ path: "./.env" });

// Connect to MongoDB
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

// Resolve __dirname for ES modules
const __dirname = path.resolve();

// Set the path to your JSON file (adjust if necessary)
const jsonFilePath = path.join(__dirname, "..", "frontend", "public", "data", "product.json");

let productsData;
try {
  const data = fs.readFileSync(jsonFilePath, "utf-8");
  productsData = JSON.parse(data);
} catch (err) {
  console.error("Error reading JSON file:", err);
  process.exit(1);
}

// Clean the product objects: remove the "id" field so Mongoose can assign its own _id
const cleanProducts = productsData.products.map((product) => {
  if (product.hasOwnProperty("id")) {
    delete product.id;
  }
  // Optionally, if your JSON keys have dashes (e.g., "sub-title"), convert them to camelCase
  if (product["sub-title"]) {
    product.subTitle = product["sub-title"];
    delete product["sub-title"];
  }
  if (product["sub-description"]) {
    product.subDescription = product["sub-description"];
    delete product["sub-description"];
  }
  if (product["more info"]) {
    product.moreInfo = product["more info"];
    delete product["more info"];
  }
  return product;
});

// Function to import data into MongoDB
const importData = async () => {
  try {
    // Optionally clear existing products
    await Product.deleteMany();
    // Insert cleaned product data
    await Product.insertMany(cleanProducts);
    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

importData();
