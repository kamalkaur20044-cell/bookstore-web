import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Books from "../pages/Books";
import BookDetails from "../pages/BookDetails";
import Cart from "../pages/Cart";
import Wishlist from "../pages/Wishlist";
import SellerDashboard from "../pages/SellerDashboard";
import Orders from "../pages/Orders";
import Login from "../pages/SignUp";
import Signin from "../pages/Signin";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import Success from "../pages/Success";
import AdminRoute from "./AdminRoute";
import UserLayout from "../components/layout/UserLayout";
import AdminLayout from "../components/layout/AdminLayout";

export default function AppRoutes() {
  return (
    <Routes>

      {/* USER ROUTES */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/success" element={<Success />} />
      </Route>

      {/* ADMIN ROUTES */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<SellerDashboard />} />
        </Route>
      </Route>

    </Routes>
  );
}