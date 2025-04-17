

import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import cors from "cors";
import { Server } from "socket.io"; // Add this import
// Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();
const port = process.env.PORT || 5000;

connectDB();

const app = express();
const server = http.createServer(app); // Shared HTTP server

// Create Socket.io instance
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

// Attach Socket.io to app for access in routes
app.set("io", io); 

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes); // Cloudinary upload route
app.use("/api/webhooks", webhookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/chat", chatRoutes); // Chat routes

app.get("/", (req, res) => {
  res.json({ msg: "Server is running" });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));


// import express from "express";
// import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import http from "http";
// import cors from "cors";
// import { Server } from "socket.io";

// // Utils
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import categoryRoutes from "./routes/categoryRoutes.js";
// import productRoutes from "./routes/productRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
// import webhookRoutes from "./routes/webhookRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import { authenticateSocket } from "./middlewares/authMiddleware.js";
// import Message from "./models/Message.js";

// dotenv.config();
// const port = process.env.PORT || 5000;

// // Connect to DB
// connectDB();

// const app = express();
// const server = http.createServer(app);

// // Socket.io setup
// const io = new Server(server, {
//   path: "/socket.io/",
//   cors: {
//     origin: process.env.FRONTEND_URL || "*",
//     methods: ["GET", "POST"],
//     credentials: true
//   },
//   serveClient: false,
//   pingTimeout: 60000,
//   pingInterval: 25000
// });

// // Use middleware to authenticate sockets
// io.use(authenticateSocket); // ✅ Enable real auth here

// // WebSocket events
// io.on("connection", (socket) => {
//   console.log(`✅ New WebSocket connection: ${socket.id}`);
//   console.log(`🔐 Authenticated user: ${socket.user?._id}`);

//   socket.on("joinConversation", (conversationId) => {
//     if (!conversationId) {
//       return socket.emit("error", "Missing conversationId");
//     }
//     socket.join(conversationId);
//     console.log(`User ${socket.user._id} joined conversation: ${conversationId}`);
//   });

//   socket.on("sendMessage", async (messageData) => {
//     try {
//       if (!messageData?.content || !messageData?.receiver) {
//         throw new Error("Invalid message format");
//       }

//       const conversationId = messageData.conversationId || generateConversationId(socket.user._id, messageData.receiver);

//       const message = new Message({
//         sender: socket.user._id,
//         receiver: messageData.receiver,
//         content: messageData.content,
//         conversationId
//       });

//       const savedMessage = await message.save();
//       io.to(conversationId).emit("newMessage", savedMessage);
//     } catch (error) {
//       console.error("Message error:", error.message);
//       socket.emit("error", error.message);
//     }
//   });

//   socket.on("disconnect", (reason) => {
//     console.log(`❌ Disconnected (${reason}): ${socket.id}`);
//   });

//   socket.on("error", (err) => {
//     console.error("Socket error:", err);
//   });
// });

// // Helper to generate consistent conversation IDs
// function generateConversationId(userId1, userId2) {
//   const ids = [userId1.toString(), userId2.toString()].sort();
//   return `conv_${ids[0]}_${ids[1]}`;
// }

// // Middlewares
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//   credentials: true
// }));

// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(cookieParser());

// // REST Routes
// app.use("/api/users", userRoutes);
// app.use("/api/category", categoryRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/upload", uploadRoutes);
// app.use("/api/webhooks", webhookRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/chat", chatRoutes);

// // Health check
// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     websocket: io.engine.clientsCount > 0 ? "active" : "inactive"
//   });
// });

// // Start server
// server.listen(port, () => {
//   console.log(`🚀 Server running on port ${port}`);
//   console.log(`🔌 WebSocket listening at ws://localhost:${port}/socket.io/`);
// });

// // Unhandled errors
// process.on('unhandledRejection', (err) => {
//   console.error('Unhandled rejection:', err);
// });
