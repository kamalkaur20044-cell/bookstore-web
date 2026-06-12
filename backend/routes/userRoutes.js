import express from "express";
import User from "../models/User.js";
import { isAdmin, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// GET all users (Admin only)
router.get("/", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// Validate a user session — returns user if _id exists in DB
router.get("/me/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: "Invalid user" });
  }
});

// UPDATE profile — name, phone, dob, optional photo upload to Cloudinary
router.put("/me", protect, upload.single("photo"), async (req, res) => {
  try {
    const { name, phone, dob } = req.body;

    const updates = {};
    if (name  !== undefined) updates.name  = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();
    if (dob   !== undefined) updates.dob   = dob;

    // Upload photo to Cloudinary if a file was sent
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "booksphere/avatars",
            transformation: [{ width: 200, height: 200, crop: "fill", gravity: "face" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      updates.photo = uploadResult.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, select: "-password" }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
