import express from "express";
import razorpay from "../config/razorpay.js";

const router = express.Router();

router.post("/create-order", async (req, res) => {
  try {
    console.log("BODY:", req.body);
    const { amount } = req.body;
   
    if (!amount) {
      return res.status(400).json({ message: "Amount required" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json(order);
  } catch (err) {
    console.error("Razorpay error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;