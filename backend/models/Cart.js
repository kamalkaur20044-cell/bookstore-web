import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        productId: String,
        title: String,
        price: Number,
        image: String,
        qty: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);