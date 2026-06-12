import express from "express";
import Order from "../models/Order.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 GET ALL ORDERS (ADMIN ONLY)
 */
router.get("/", isAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching all orders" });
  }
});

/**
 CREATE ORDER (AFTER PAYMENT SUCCESS)
 */
router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      address,
      totalAmount,
      paymentId,
      orderId,
    } = req.body;

    if (!userId || !items || !paymentId || !orderId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const order = await Order.create({
      userId,
      items,
      address,
      totalAmount,
      paymentId,
      orderId,
      status: "paid",
    });

    res.status(201).json(order);
  } catch (err) {
    console.log("ORDER ERROR:", err);
    res.status(500).json({ message: "Error placing order" });
  }
});

/**
  GET ORDERS BY USER
 */
router.get("/user/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

export default router;