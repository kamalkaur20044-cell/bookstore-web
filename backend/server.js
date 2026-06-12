import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbConnection from "./config/db.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

dbConnection();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/payment", paymentRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});