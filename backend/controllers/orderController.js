import paystack from "../config/paystack.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import asyncHandler from "../middlewares/asyncHandler.js";

// Define trackOrder without exporting inline
const trackOrder = asyncHandler(async (req, res) => {
  const { orderId, billingEmail } = req.body;

  // Find the order by its ID
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Optional: if billingEmail is provided, verify it against the order's paymentResult.email_address
  if (billingEmail && order.paymentResult && order.paymentResult.email_address) {
    if (order.paymentResult.email_address.toLowerCase() !== billingEmail.toLowerCase()) {
      res.status(401);
      throw new Error("Billing email does not match");
    }
  }

  // Return the tracking details
  res.json({
    trackingNumber: order.trackingNumber || "N/A",
    shippingStatus: order.shippingStatus || "N/A",
    carrier: order.carrier || "N/A",
    estimatedDelivery: order.estimatedDelivery || null,
    updatedAt: order.updatedAt,
  });
});

function calcPrices(orderItems) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = (itemsPrice * taxRate).toFixed(2);

  const totalPrice = (
    itemsPrice +
    shippingPrice +
    parseFloat(taxPrice)
  ).toFixed(2);

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice,
    totalPrice,
  };
}

const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x.product) },
    });

    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient.product
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient.product}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient.product,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
      calcPrices(dbOrderItems);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const countTotalOrders = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calculateTotalSales = async (req, res) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const calcualteTotalSalesByDate = async (req, res) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const findOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const markOrderAsPaid = async ({
  amount,
  status,
  paid_at: paidAt,
  reference: paystackReference,
  id: paystackTransactionId,
}) => {
  try {
    const order = await Order.findOne({ paystackReference });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paidAt) {
      console.log('Order already marked as paid');
      return;
    }

    // Convert amount from kobo to currency
    const amountInCurrency = amount / 100;

    if (status !== 'success' || amountInCurrency !== order.totalPrice) {
      throw new Error(`Payment verification failed. Amount or status mismatch`);
    }

    order.isPaid = true;
    order.paidAt = paidAt || new Date();
    order.paymentResult = {
      id: paystackTransactionId,
      status,
      update_time: paidAt || new Date(),
      email_address: order.user.email, // Assuming user is populated
      reference: paystackReference
    };

    await order.save();
    return order;
  } catch (error) {
    console.error('Error marking order as paid:', error);
    throw error;
  }
};


const payOrder = async (req, res) => {
  try {
    const { callback_url, order } = req.body;

    // Validation
    switch (true) {
      case !callback_url:
        return res.json({ error: "callback_url is required" });
      case !order:
        return res.json({ error: "Order is required" });
    }

    const foundOrder = await Order.findById(order).populate("user", "id email");

    const transaction = await paystack.initializeTransaction({
      amount: (foundOrder.totalPrice * 100).toString(),
      currency: "GHS",
      email: foundOrder.user.email,
      callback_url,
    });

    if (foundOrder.paidAt) {
      res.status(400);
      throw new Error("Order has been paid for");
    }

    if (transaction) {
      foundOrder.paystackReference = transaction.data.reference;

      const updateOrder = await foundOrder.save();
      res.status(200).json({
        transaction,
        order: updateOrder,
      });
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const verifyPayment = asyncHandler(async (req, res) => {
  try {
    const { reference, order_id } = req.query;

    if (!reference || !order_id) {
      res.status(400);
      throw new Error("Reference and order ID are required");
    }

    // Verify transaction with Paystack
    const verification = await paystack.verifyTransaction(reference);

    // Additional verification checks
    if (!verification.status || verification.data.status !== 'success') {
      res.status(400);
      throw new Error(verification.message || "Payment verification failed");
    }

    // Mark order as paid
    await markOrderAsPaid({
      amount: verification.data.amount,
      status: verification.data.status,
      paid_at: verification.data.paid_at,
      reference: verification.data.reference,
      id: verification.data.id
    });

    // Get updated order
    const order = await Order.findById(order_id).populate('user', 'name email');

    res.json({
      success: true,
      order,
      paymentData: verification.data
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      error: error.message,
      success: false
    });
  }
});

const markOrderAsDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calcualteTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  payOrder,
  verifyPayment,
  markOrderAsDelivered,
  trackOrder,
};
