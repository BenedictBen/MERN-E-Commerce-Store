import express from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  payOrder,
  verifyPayment,
  calcualteTotalSalesByDate,
  calculateTotalSales,
  findOrderById,
  markOrderAsDelivered,
  trackOrder, // New tracking endpoint
} from "../controllers/orderController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/pay").post(authenticate, payOrder);
router.route("/verify-payment").get(authenticate, verifyPayment); // Add this new route
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/track").post(authenticate, trackOrder); // Added tracking route
router.route("/:id").get(authenticate, findOrderById);
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
