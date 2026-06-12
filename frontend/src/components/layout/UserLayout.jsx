import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import { Outlet } from "react-router-dom";
import LoginModal from "../auth/LoginModal.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

export default function UserLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <LoginModal />
      <Outlet />
      <Footer />
    </>
  );
}