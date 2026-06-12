import { createContext, useEffect, useState, useContext } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useContext(AuthContext);

  //  Load cart from backend
  useEffect(() => {
    if (!user?._id) return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`/cart/${user._id}`);
        setCartItems(res.data.items || []);
      } catch (err) {
        console.log("Cart fetch error:", err);
      }
    };

    fetchCart();
  }, [user]);

  // ➕ Add to cart
  const addToCart = async (book, user) => {
    if (!user) {
      toast.error("Login required");
      return;
    }

    try {
      await api.post("/cart/add", {
        userId: user._id,
        product: {
          productId: book._id,
          title: book.title,
          price: book.price,
          image: book.image,
          qty: 1,
        },
      });

      const res = await api.get(`/cart/${user._id}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  //  Remove
  const removeFromCart = async (id) => {
    try {
      await api.post("/cart/remove", {
        userId: user._id,
        productId: id,
      });

      const res = await api.get(`/cart/${user._id}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      toast.error("Remove failed");
    }
  };

  // 🔼 Increase
  const increaseQty = async (productId) => {
    try {
      // Find the item in local state to get full product details
      const item = cartItems.find((i) => i.productId === productId);
      if (!item) return;

      await api.post("/cart/add", {
        userId: user._id,
        product: {
          productId: item.productId,
          title: item.title,
          price: item.price,
          image: item.image,
          qty: 1,
        },
      });

      const res = await api.get(`/cart/${user._id}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // 🔽 Decrease (decrements by 1, removes item if qty reaches 0)
  const decreaseQty = async (productId) => {
    try {
      await api.post("/cart/decrease", {
        userId: user._id,
        productId,
      });

      const res = await api.get(`/cart/${user._id}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};