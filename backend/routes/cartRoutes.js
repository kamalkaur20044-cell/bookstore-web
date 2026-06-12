import express from "express";
import Cart from "../models/Cart.js";

const router = express.Router();

/**
 * GET CART BY USER
 */
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

/**
 * ADD TO CART
 */
router.post("/add", async (req, res) => {
  try {
    const { userId, product } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [product],
      });
    } else {
      const index = cart.items.findIndex(
        (item) => item.productId === product.productId
      );

      if (index > -1) {
        cart.items[index].qty += 1;
      } else {
        cart.items.push(product);
      }

      await cart.save();
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart" });
  }
});

/**
 * DECREASE QTY (remove 1, delete item if qty reaches 0)
 */
router.post("/decrease", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) => item.productId === productId
    );

    if (index > -1) {
      if (cart.items[index].qty > 1) {
        cart.items[index].qty -= 1;
      } else {
        cart.items.splice(index, 1);
      }
    }

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error decreasing qty" });
  }
});

/**
 * REMOVE ITEM completely
 */
router.post("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) return res.json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId !== productId
    );

    await cart.save();

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error removing item" });
  }
});

/**
 * CLEAR CART (after payment)
 */
router.delete("/:userId", async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.params.userId },
      { items: [] }
    );

    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Error clearing cart" });
  }
});

export default router;