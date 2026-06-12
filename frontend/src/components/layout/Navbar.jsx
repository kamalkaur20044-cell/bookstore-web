import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContent";
import { WishlistContext } from "../../context/WishlistContext";
import logo from "../../assets/logo.png";

export default function Navbar() {
  const { user, setUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  const [showMenu, setShowMenu] = useState(false);

  const userInitial = user
    ? (user.name || user.email || "").trim().charAt(0).toUpperCase() || "?"
    : null;

  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="flex justify-between items-center px-12 py-1 shadow-md mb-1">

      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="BookSphere" className="h-15 w-auto" />
      </Link>

      <div className="flex items-center gap-6">

        <Link to="/" className="text-gray-700">Home</Link>

        <Link to="/wishlist" className="text-gray-700">
          Wishlist<sup className="text-xs align-super ml-1">{wishlist.length}</sup>
        </Link>

        <Link to="/cart" className="text-gray-700">
          Cart<sup className="text-xs align-super ml-1">{cartItems.length}</sup>
        </Link>

        {user && user.role !== "admin" ? (
          <div className="relative">
            <button
              onClick={() => setShowMenu((s) => !s)}
              className="h-9 w-9 rounded-full bg-amber-500 text-slate-900 font-semibold flex items-center justify-center"
            >
              {userInitial}
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded text-sm z-50">
                <Link to="/profile" onClick={() => setShowMenu(false)} className="block px-4 py-2 hover:bg-gray-100">My Profile</Link>
                <Link to="/orders" onClick={() => setShowMenu(false)} className="block px-4 py-2 hover:bg-gray-100">My Orders</Link>
                <Link to="/cart" onClick={() => setShowMenu(false)} className="block px-4 py-2 hover:bg-gray-100">Cart</Link>
                <Link to="/wishlist" onClick={() => setShowMenu(false)} className="block px-4 py-2 hover:bg-gray-100">Wishlist</Link>
                <hr />
                <button
                  onClick={() => { setShowMenu(false); handleLogout(); }}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          !user && (
            <button
              onClick={() => navigate("/signin")}
              className="bg-amber-500 text-slate-900 px-4 py-1 rounded hover:bg-amber-600 transition"
            >
              Login
            </button>
          )
        )}

      </div>
    </div>
  );
}
