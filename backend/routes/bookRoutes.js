import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import Book from "../models/Book.js";
import { isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    console.error("BOOK FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch books", error: err.message });
  }
});

// ADD BOOK (Admin only)
// Accepts either:
//   - multipart/form-data with an "image" file  → uploaded to Cloudinary
//   - application/json with an "image" URL string → saved directly
router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, author, price, description, sellerId } = req.body;

    if (!title || !author || !price) {
      return res.status(400).json({ message: "Title, author and price are required" });
    }

    let imageUrl = req.body.image || "";

    // If a file was uploaded, stream it directly to Cloudinary from memory
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "booksphere" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const book = await Book.create({
      title,
      author,
      price,
      description,
      image: imageUrl,
      sellerId,
    });

    res.json(book);

  } catch (err) {
    console.error("ADD BOOK ERROR:", err);
    res.status(500).json({ message: "Error adding book" });
  }
});

// DELETE BOOK (Admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

export default router;
