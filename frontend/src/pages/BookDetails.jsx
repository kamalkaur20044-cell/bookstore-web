import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContent";
import { WishlistContext } from "../context/WishlistContext";
import toast from "react-hot-toast";

export default function BookDetails() {
  const { id } = useParams();

  const [book, setBook] = useState(null);

  const { user, setRedirectPath } = useContext(AuthContext);
  console.log("USER:", user);
  const navigate = useNavigate();

  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get("/books");
      const found = res.data.find((b) => b._id === id);
      setBook(found);
    } catch (err) {
      console.log(err);
    }
  };

  if (!book) return <div className="p-6">Loading...</div>;

  const requireLogin = () => {
    setRedirectPath(`/book/${id}`);
    navigate("/signin");
  };

  const handleCart = () => {
    if (!user) {
      toast.error("Login required");
      requireLogin();
      return;
    }

    const added = addToCart(book,user);
    if(added){
      toast.success("Added to cart");
    }
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error("Login required");
      requireLogin();
      return;
    }

    const result = addToWishlist(book, user);

    if (result === "added") {
      toast.success("Added to wishlist");
    }
    else if (result === "exists") {
      toast("Already in wishlist");
    }
  };

  return (
    <div className="p-6 grid md:grid-cols-2 gap-10">

      <img
        src={book.image || null}
        className="w-full h-100 object-cover rounded"
      />

      <div>
        <h1 className="text-3xl font-bold">{book.title}</h1>

        <p className="text-gray-600 mt-2">
          {book.author}
        </p>

        <p className="text-amber-600 font-bold mt-3">
          ₹{book.price}
        </p>

        <p className="mt-4">
          {book.description}
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleCart}
            className="bg-amber-500 text-slate-900 px-4 py-2 rounded hover:bg-amber-600 transition"
          >
            Add to Cart
          </button>

          <button
            onClick={handleWishlist}
            className="border border-red-500 text-red-500 px-4 py-2 rounded"
          >
            Wishlist
          </button>
        </div>
      </div>
    </div>
  );
}