import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Success() {
  const navigate = useNavigate();

  useEffect(() => {
    // auto redirect after 5 seconds (optional)
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">

        {/* Success Icon */}
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-2xl font-bold text-green-600">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mt-2">
          Your order has been placed successfully.
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Redirecting to your orders page in 5 seconds...
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className="bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-600"
          >
            View Orders
          </button>

          <button
            onClick={() => navigate("/")}
            className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}