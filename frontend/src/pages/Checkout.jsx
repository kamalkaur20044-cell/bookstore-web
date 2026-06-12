import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContent";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cartItems, totalPrice, clearCart } =
    useContext(CartContext);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handlePayment = async () => {
    if (!cartItems.length) {
      alert("Cart is empty");
      return;
    }

    if (!import.meta.env.VITE_RAZORPAY_KEY_ID) {
      alert("Razorpay key missing");
      return;
    }

    try {
      const { data } = await api.post(
        "/payment/create-order",
        {
          amount: totalPrice,
        }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "BookSphere",
        description: "Book Purchase",
        order_id: data.id,

        handler: async function (response) {
          try {
            await api.post("/orders", {
              userId: user._id,
              items: cartItems,
              address,
              totalAmount: totalPrice,
              paymentId:
                response.razorpay_payment_id,
              orderId:
                response.razorpay_order_id,
            });

            await api.delete(`/cart/${user._id}`);

            alert("Order placed successfully!");

            navigate("/success");
          } catch (error) {
            console.error(
              "Order Save Error:",
              error
            );
          }
        },

        theme: {
          color: "#F59E0B",
        },
      };

      const razorpay =
        new window.Razorpay(options);

      razorpay.open();
    } catch (error) {
      console.error(
        "Payment Error:",
        error
      );
      alert("Unable to initiate payment");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!address.fullName.trim()) {
      newErrors.fullName =
        "Full name is required";
    }

    if (!address.phone.trim()) {
      newErrors.phone =
        "Phone number is required";
    } else if (
      !/^\d{10}$/.test(address.phone)
    ) {
      newErrors.phone =
        "Enter a valid 10-digit mobile number";
    }

    if (!address.address.trim()) {
      newErrors.address =
        "Address is required";
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!address.pincode.trim()) {
      newErrors.pincode =
        "Pincode is required";
    } else if (
      !/^\d{6}$/.test(address.pincode)
    ) {
      newErrors.pincode =
        "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    handlePayment();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

        {/* Address Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-6">
            Delivery Address
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={address.fullName}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">
                {errors.fullName}
              </p>
            )}

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={address.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">
                {errors.phone}
              </p>
            )}

            <textarea
              name="address"
              placeholder="Full Address"
              value={address.address}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
            {errors.address && (
              <p className="text-red-500 text-sm">
                {errors.address}
              </p>
            )}

            <input
              type="text"
              name="city"
              placeholder="City"
              value={address.city}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3"
            />
            {errors.city && (
              <p className="text-red-500 text-sm">
                {errors.city}
              </p>
            )}

            <div className="flex gap-4">
              <div className="w-1/2">
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={address.state}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">
                    {errors.state}
                  </p>
                )}
              </div>

              <div className="w-1/2">
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm">
                    {errors.pincode}
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 text-slate-900 py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
            >
              Proceed to Payment
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-6">
            Order Summary
          </h2>

          {cartItems.length === 0 ? (
            <p className="text-gray-500">
              Your cart is empty
            </p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id || item.id}
                  className="flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {item.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>

                  <p className="font-semibold">
                    ₹{item.price * item.qty}
                  </p>
                </div>
              ))}

              <hr />

              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>₹{totalPrice}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}