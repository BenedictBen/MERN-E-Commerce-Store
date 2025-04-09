import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/categoryModel.js";

dotenv.config({ path: "./.env" });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");

    try {
      // List current indexes for logging
      const indexes = await Category.collection.indexes();
      console.log("Current indexes:", indexes);

      // Attempt to drop the old index on the "name" field
      const result = await Category.collection.dropIndex("name_1");
      console.log("Index dropped:", result);
    } catch (err) {
      console.error("Error dropping index:", err);
    } finally {
      mongoose.connection.close();
      process.exit();
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
