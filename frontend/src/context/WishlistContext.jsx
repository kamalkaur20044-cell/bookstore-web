import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  // load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist"));
    if (stored) setWishlist(stored);
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // add to wishlist
  const addToWishlist = (book, user) => {
    if (!user || user.role === "admin") {
      toast.error("Please login to add to wishlist");
      return false;
    }

    const bookId = String(book.id || book._id);

    const exists = wishlist.find((item) => item.id === bookId);

    if (exists) return "exists";

    const normalized = { ...book, id: bookId };
    setWishlist([...wishlist, normalized]);
    return "added";
  };

  //  remove
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item._id !== id));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};