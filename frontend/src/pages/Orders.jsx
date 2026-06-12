import { useEffect, useState, useContext } from "react";
import { getOrders } from "../services/order.service";
import { AuthContext } from "../context/AuthContext";

export default function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
     try {
      const data = await getOrders(user._id);
      setOrders(data);
    } catch (err) {
      console.log("Error fetching orders:", err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow p-4 mb-4 rounded"
          >
            <p className="font-semibold">
              Order ID: {order._id}
            </p>

            <p>Total: ₹{order.totalAmount}</p>

            <p>Status: {order.status}</p>
          </div>
        ))
      )}
    </div>
  );
}