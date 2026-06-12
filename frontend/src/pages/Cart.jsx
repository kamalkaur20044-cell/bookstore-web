import { useContext } from "react";
import { CartContext } from "../context/CartContent";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    totalPrice,
  } = useContext(CartContext);

  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-600">Cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">

          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">

            {cartItems.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between bg-white shadow p-4 rounded"
              >
                {/* Product Info */}
                <div className="flex gap-4 items-center">

                  <img
                    src={item.image || "https://via.placeholder.com/80"}
                    className="h-16 w-16 object-cover rounded"
                  />

                  <div>
                    <h2 className="font-semibold">
                      {item.title}
                    </h2>

                    <p className="text-amber-600 font-bold">
                      ₹{item.price}
                    </p>
                  </div>

                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={() => decreaseQty(item.productId)}
                    className="px-2 bg-gray-200"
                  >
                    -
                  </button>

                  <span>{item.qty}</span>

                  <button
                    onClick={() => increaseQty(item.productId)}
                    className="px-2 bg-gray-200"
                  >
                    +
                  </button>

                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="text-red-500"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          {/* Summary */}
          <div className="bg-white shadow p-5 rounded h-fit">

            <h2 className="text-lg font-bold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Total Items</span>
              <span>
                {cartItems.reduce(
                  (sum, item) => sum + (item.qty || 0),
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between mb-4">
              <span>Total Price</span>
              <span className="font-bold text-amber-600">
                ₹{totalPrice}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-amber-500 text-slate-900 py-2 rounded hover:bg-amber-600 transition"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>
      )}
    </div>
  );
}