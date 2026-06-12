import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { WishlistContext } from "../context/WishlistContext";
import { CartContext } from "../context/CartContent";
import { getOrders } from "../services/order.service";
import {
  FiShoppingBag,
  FiHeart,
  FiBookmark,
  FiCreditCard,
  FiChevronRight,
  FiLogOut,
  FiEdit2,
} from "react-icons/fi";

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const { wishlist } = useContext(WishlistContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const [editData, setEditData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [orders, setOrders] = useState([]);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (user?._id) {
      getOrders(user._id)
        .then(setOrders)
        .catch(() => { });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        <div className="text-center">
          <p className="mb-4">Please sign in to view your profile.</p>
          <button
            onClick={() => navigate("/signin")}
            className="bg-amber-500 text-slate-900 px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const updatedUser = {
        ...user,
        name: editData.name,
        phone: editData.phone,
      };

      // Later you can call API here

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const initials = (user.name || user.email || "?").charAt(0).toUpperCase();
  const showPhoto = user.photo && !imgError;

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  const menuItems = [
    {
      icon: <FiShoppingBag />,
      label: "Orders",
      sub: `${orders.length} order${orders.length !== 1 ? "s" : ""}`,
      to: "/orders",
    },
    {
      icon: <FiHeart />,
      label: "Wishlist",
      sub: `${wishlist.length} item${wishlist.length !== 1 ? "s" : ""}`,
      to: "/wishlist",
    },
    {
      icon: <FiBookmark />,
      label: "Cart",
      sub: `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`,
      to: "/cart",
    },
    {
      icon: <FiCreditCard />,
      label: "Payment Methods",
      sub: "Manage cards",
      to: null,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Page title */}
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

        {/* Profile card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
              {showPhoto ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <span className="text-3xl font-bold text-amber-600">{initials}</span>
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {user.name}
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">
                        {user.email}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {user.phone || "No contact number added"}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditData({
                          name: "",
                          phone: "",
                        });
                        setIsEditing(true);
                      }}
                      className="p-2 text-slate-500 hover:text-amber-600 transition rounded-lg hover:bg-slate-100"
                    >
                      <FiEdit2 className="text-lg" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          name: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      value={editData.phone}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full border border-slate-200 bg-slate-100 rounded-lg px-3 py-2 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditData({
                          name: user.name || "",
                          phone: user.phone || "",
                        });
                      }}
                      className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-5 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {menuItems.map((item, idx) => (
            <div key={idx}>
              {item.to ? (
                <Link
                  to={item.to}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition group"
                >
                  <span className="text-xl text-slate-500 group-hover:text-amber-500 transition">
                    {item.icon}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <FiChevronRight className="text-slate-300 group-hover:text-amber-400 transition" />
                </Link>
              ) : (
                <div className="flex items-center gap-4 px-6 py-4 opacity-50 cursor-not-allowed">
                  <span className="text-xl text-slate-500">{item.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                  <FiChevronRight className="text-slate-300" />
                </div>
              )}
              {idx < menuItems.length - 1 && (
                <div className="border-t border-slate-100 mx-6" />
              )}
            </div>
          ))}
        </div>

        {/* Recently viewed — from wishlist as a proxy */}
        {wishlist.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-slate-900">Recently Wishlisted</h3>
              <Link to="/wishlist" className="text-sm text-amber-600 font-semibold hover:underline">
                View All
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {wishlist.slice(0, 4).map((book) => (
                <Link
                  to={`/book/${book._id || book.id}`}
                  key={book._id || book.id}
                  className="shrink-0 w-32 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={book.image || "https://placehold.co/128x96?text=Book"}
                    alt={book.title}
                    className="w-full h-24 object-cover"
                    onError={(e) => { e.target.src = "https://placehold.co/128x96?text=Book"; }}
                  />
                  <div className="p-2">
                    <p className="text-xs font-semibold text-slate-800 truncate">{book.title}</p>
                    <p className="text-xs text-amber-600 font-bold mt-0.5">₹{book.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm text-red-500 hover:bg-red-50 transition font-semibold text-sm"
        >
          <FiLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
}