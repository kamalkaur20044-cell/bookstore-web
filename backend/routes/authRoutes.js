import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const SALT_ROUNDS = 10;

const signToken = (user) =>
  jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: "local",
    });

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("Signup route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    if (user.provider === "google") {
      return res.status(400).json({ message: "Please sign in with Google." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("Signin route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/google-login", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email || !name) {
      return res.status(400).json({ message: "Google user data is missing." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, provider: "google" });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error("Google login route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
