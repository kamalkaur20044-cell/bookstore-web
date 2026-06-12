import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } =
    useContext(WishlistContext);

  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        My Wishlist ❤️
      </h1>

      {wishlist.length === 0 ? (
        <p>No items in wishlist</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id || item._id}
              className="bg-white shadow-md p-4 rounded"
            >
              <img
                src={item.image}
                className="h-40 w-full object-cover rounded"
              />

              <h2 className="font-semibold mt-2">
                {item.title}
              </h2>

              <p className="text-amber-600 font-bold">
                ₹{item.price}
              </p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() =>
                    navigate(`/book/${item.id || item._id}`)
                  }
                  className="text-amber-600 hover:text-amber-700"
                >
                  View
                </button>

                <button
                  onClick={() =>
                    removeFromWishlist(item.id || item._id)
                  }
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}