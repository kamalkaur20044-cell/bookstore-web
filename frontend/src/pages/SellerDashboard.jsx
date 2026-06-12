import { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { getBooks, addBook, deleteBook } from "../services/book.service";
import { getAllOrders } from "../services/order.service";
import { getAllUsers } from "../services/user.service";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiBook,
  FiShoppingCart,
  FiUsers,
  FiTrash2,
  FiLogOut,
  FiPlus
} from "react-icons/fi";

export default function SellerDashboard() {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("books"); // 'books', 'orders', 'users'
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    price: "",
    author: "",
    image: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const booksData = await getBooks();
      setBooks(booksData);

      const ordersData = await getAllOrders();
      setOrders(ordersData);

      const usersData = await getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // If user types a URL, clear the file selection
    if (e.target.name === "image") {
      setImageFile(null);
      setImagePreview(e.target.value);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    // Clear the URL input when a file is chosen
    setForm((f) => ({ ...f, image: "" }));
  };

  const handleAdd = async () => {
    try {
      if (!form.title || !form.price || !form.author) {
        toast.error("Please fill all required fields");
        return;
      }
      if (!imageFile && !form.image) {
        toast.error("Please provide an image file or URL");
        return;
      }

      await addBook(form, imageFile);
      toast.success("Book added successfully!");

      setForm({ title: "", price: "", author: "", image: "", description: "" });
      setImageFile(null);
      setImagePreview("");

      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add book");
    }
  };

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this book?"
      );

      if (!confirmDelete) return;

      await deleteBook(id);
      toast.success("Book deleted successfully!");
      
      // Reload data
      const booksData = await getBooks();
      setBooks(booksData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete book");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
    toast.success("Logged out successfully");
  };

  // Protect Route
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const adminName = user.name || "Kamal";
  const avatarUrl = user.photo || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces&q=80";

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Redesigned Premium Navbar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-xs h-16 flex items-center justify-between px-6 transition-all">
        {/* Left Side: Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="BookSphere Logo" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        {/* Right Side: User Profile Dropdown */}
        <div className="flex items-center gap-6">

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-all text-left focus:outline-none cursor-pointer"
            >
              <img
                src={avatarUrl}
                alt={adminName}
                className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 shadow-sm"
              />
              <div className="hidden sm:block">
                <h4 className="font-semibold text-slate-800 text-xs leading-none">
                  {adminName}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5 uppercase tracking-wide">
                  Admin
                </p>
              </div>
              <FiChevronDown className={`text-slate-400 text-xs transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs text-slate-400">Signed in as</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors text-sm text-left cursor-pointer"
                >
                  <FiLogOut className="text-base text-red-400" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Admin Dashboard Container */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-8">
        
        {/* Dynamic Header Titles */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            Admin dashboard
          </h1>
          <p className="text-slate-500 text-xs md:text-sm">
            Manage your bookstore inventory, customer orders, and registered user profiles.
          </p>
        </div>

        {/* First Three Statistics Cards (Excluding Total Revenue) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Books */}
          <div
            onClick={() => setActiveTab("books")}
            className={`bg-white border rounded-2xl p-6 shadow-xs flex items-center gap-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              activeTab === "books" 
                ? "border-violet-500 ring-2 ring-violet-500/10 bg-violet-50/5" 
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className={`p-4 rounded-2xl flex items-center justify-center transition-colors ${
              activeTab === "books" ? "bg-violet-600/10 text-violet-600" : "bg-violet-50 text-violet-500"
            }`}>
              <FiBook className="text-2xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Books</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-0.5 leading-none">
                {books.length}
              </h2>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1.5">
                ↑ 12.5% <span className="text-slate-400 font-medium lowercase">from last month</span>
              </span>
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div
            onClick={() => setActiveTab("orders")}
            className={`bg-white border rounded-2xl p-6 shadow-xs flex items-center gap-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              activeTab === "orders" 
                ? "border-emerald-500 ring-2 ring-emerald-500/10 bg-emerald-50/5" 
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className={`p-4 rounded-2xl flex items-center justify-center transition-colors ${
              activeTab === "orders" ? "bg-emerald-600/10 text-emerald-600" : "bg-emerald-50 text-emerald-500"
            }`}>
              <FiShoppingCart className="text-2xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Orders</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-0.5 leading-none">
                {orders.length}
              </h2>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1.5">
                ↑ 8.4% <span className="text-slate-400 font-medium lowercase">from last month</span>
              </span>
            </div>
          </div>

          {/* Card 3: Total Users */}
          <div
            onClick={() => setActiveTab("users")}
            className={`bg-white border rounded-2xl p-6 shadow-xs flex items-center gap-5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              activeTab === "users" 
                ? "border-indigo-500 ring-2 ring-indigo-500/10 bg-indigo-50/5" 
                : "border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className={`p-4 rounded-2xl flex items-center justify-center transition-colors ${
              activeTab === "users" ? "bg-indigo-600/10 text-indigo-600" : "bg-indigo-50 text-indigo-500"
            }`}>
              <FiUsers className="text-2xl" />
            </div>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Users</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 mt-0.5 leading-none">
                {users.length}
              </h2>
              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 mt-1.5">
                ↑ 15.3% <span className="text-slate-400 font-medium lowercase">from last month</span>
              </span>
            </div>
          </div>
        </section>

        {/* Dashboard Body Grid: Add Book Form & Dynamic List View */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Column 1: Add New Book (Existing UI, beautifully styled) */}
          <div className="bg-white border border-slate-100 shadow-xs rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FiPlus className="text-amber-500 text-xl" />
                Add New Book
              </h3>
              <p className="text-slate-400 text-xs mt-1">
                Enter details to add a new book to the library store catalog.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Book Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter book title"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 focus:outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Author *</label>
                  <input
                    type="text"
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Enter author"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Image *</label>

                {/* File upload */}
                <label className="flex items-center gap-2 cursor-pointer w-full border border-dashed border-slate-300 rounded-xl px-4 py-3 bg-slate-50/50 hover:border-amber-500 hover:bg-amber-50/20 transition-all">
                  <span className="text-slate-400 text-lg">📁</span>
                  <span className="text-sm text-slate-500 truncate">
                    {imageFile ? imageFile.name : "Upload from computer"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400">or</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* URL input */}
                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Paste image URL"
                  disabled={!!imageFile}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                />

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-50 relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/320x128?text=Invalid+URL";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(""); setForm((f) => ({ ...f, image: "" })); }}
                      className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-black/70"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter book description"
                  rows={4}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50/50 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/15 focus:outline-none transition-all resize-none"
                />
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full py-3 bg-amber-500 text-slate-900 font-semibold rounded-xl hover:bg-amber-600 transition shadow-sm hover:shadow hover:cursor-pointer flex items-center justify-center gap-2"
            >
              <FiPlus />
              Add Book
            </button>
          </div>

          {/* Column 2 & 3: Interactive Lists (Books, Orders, or Users) */}
          <div className="lg:col-span-2 bg-white border border-slate-100 shadow-xs rounded-2xl p-6">
            
            {/* Header of Content card */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 capitalize">
                  {activeTab === "books" && "Manage Books Catalog"}
                  {activeTab === "orders" && "Customer Orders"}
                  {activeTab === "users" && "User Directory"}
                </h3>
                <p className="text-slate-400 text-xs mt-1">
                  {activeTab === "books" && "Modify or remove existing titles in store."}
                  {activeTab === "orders" && "View all placed orders and total sales details."}
                  {activeTab === "users" && "Browse registered buyer accounts and access privileges."}
                </p>
              </div>
              <button 
                onClick={loadData}
                className="text-xs text-amber-600 hover:text-amber-700 font-semibold p-1 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
              >
                Refresh Data
              </button>
            </div>

            {/* Dynamic Content Views */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-3">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm">Fetching fresh database updates...</p>
              </div>
            ) : (
              <>
                {/* 1. Books Catalog Tab */}
                {activeTab === "books" && (
                  books.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <FiBook className="text-4xl mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No books available in the catalog yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                      {books.map((book) => (
                        <div
                          key={book._id}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 hover:border-slate-200 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={book.image || null}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded-lg shadow-xs border border-slate-100"
                            />
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                                {book.title}
                              </h4>
                              <p className="text-xs text-slate-400 mt-1 font-medium">
                                By {book.author}
                              </p>
                              <span className="inline-block mt-2 text-sm font-extrabold text-amber-600">
                                ₹{book.price}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDelete(book._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-red-100/50"
                            title="Delete Book"
                          >
                            <FiTrash2 className="text-lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* 2. Customer Orders Tab */}
                {activeTab === "orders" && (
                  orders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <FiShoppingCart className="text-4xl mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No orders have been placed yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50/50 hover:border-slate-200 transition-all space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Order ID</span>
                              <h4 className="font-mono text-xs text-slate-700 font-semibold">{order._id}</h4>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-slate-500">
                                {new Date(order.createdAt).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </span>
                              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase border ${
                                order.status === "completed" 
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                                  : order.status === "shipped"
                                  ? "bg-blue-50 text-blue-700 border-blue-100"
                                  : "bg-amber-50 text-amber-700 border-amber-100"
                              }`}>
                                {order.status || "placed"}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Customer</span>
                              <p className="text-sm font-medium text-slate-700 mt-1">{order.userId}</p>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Ordered Items</span>
                              <div className="mt-1 space-y-1">
                                {order.items?.map((item, idx) => (
                                  <div key={idx} className="flex justify-between text-xs text-slate-600">
                                    <span className="font-medium">{item.title} <span className="text-slate-400 font-normal">x{item.qty}</span></span>
                                    <span className="font-semibold text-slate-700">₹{item.price * item.qty}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-slate-100 font-bold text-slate-800 text-sm">
                            <span className="text-xs uppercase text-slate-400 tracking-wider">Total Amount</span>
                            <span className="text-base text-amber-600 font-extrabold">₹{order.totalAmount}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}

                {/* 3. User Directory Tab */}
                {activeTab === "users" && (
                  users.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <FiUsers className="text-4xl mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No registered users found.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-150 overflow-y-auto pr-2 custom-scrollbar">
                      {users.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50/50 hover:border-slate-200 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-violet-600/10 text-violet-600 flex items-center justify-center font-extrabold text-sm border border-violet-100/50 shadow-inner">
                              {(item.name || item.email || "?").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">
                                {item.name}
                              </h4>
                              <p className="text-xs text-slate-400 font-medium">
                                {item.email}
                              </p>
                              <div className="flex gap-2 mt-1.5">
                                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                                  item.role === "admin" 
                                    ? "bg-red-50 text-red-700 border-red-100" 
                                    : "bg-blue-50 text-blue-700 border-blue-100"
                                }`}>
                                  {item.role}
                                </span>
                                <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-500 rounded-full border border-slate-200 uppercase">
                                  {item.provider || "local"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Joined On</p>
                            <p className="text-xs text-slate-600 font-semibold mt-1">
                              {new Date(item.createdAt).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </>
            )}

          </div>

        </section>

      </main>
    </div>
  );
}