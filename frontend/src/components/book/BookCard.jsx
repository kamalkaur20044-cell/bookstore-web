import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { WishlistContext } from "../../context/WishlistContext";
import { CartContext } from "../../context/CartContent";
import toast from "react-hot-toast";

export default function BookCard({ book }) {
  const navigate = useNavigate();

  const { user, setRedirectPath } = useContext(AuthContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const requireLogin = (redirectTo) => {
    setRedirectPath(redirectTo);
    toast.error("Login required");
    navigate("/signin");
  };

  const handleOpenBook = () => {
    if (!user?._id) {
      requireLogin(`/book/${book._id}`);
      return;
    }
    navigate(`/book/${book._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!user?._id) {
      requireLogin("/cart");
      return;
    }

    try {
      await addToCart(book, user);
      toast.success("Added to cart");
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart");
    }
  };

  const handleWishlist = (e) => {
    e.stopPropagation();

    if (!user?._id) {
      requireLogin("/wishlist");
      return;
    }

    const result = addToWishlist(book, user);

    if (result === "added") {
      toast.success("Added to wishlist");
    } else if (result === "exists") {
      toast("Already in wishlist");
    }
  };

  return (
    <div
      onClick={handleOpenBook}
      className="bg-white shadow-md rounded-lg p-4 cursor-pointer hover:shadow-lg transition relative"
    >
      <img
        src={book.image || "https://placehold.co/320x240?text=No+Image"}
        alt={book.title}
        className="h-40 w-full object-cover rounded"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/320x240?text=No+Image";
        }}
      />

      <h2 className="font-semibold mt-2 text-gray-800">
        {book.title}
      </h2>

      <p className="text-sm text-gray-500">
        {book.author}
      </p>

      <p className="text-amber-600 font-bold mt-1">
        ₹{book.price}
      </p>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-amber-500 text-slate-900 py-1 rounded hover:bg-amber-600 transition"
        >
          Add to Cart
        </button>

        <button
          onClick={handleWishlist}
          className="px-3 bg-gray-200 rounded hover:bg-gray-300"
        >
          ♥
        </button>
      </div>
    </div>
  );
}