import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: String,
    items: Array,
    address: Object,
    totalAmount: Number,
    paymentId: String,
    orderId: String,
    status: {
      type: String,
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);