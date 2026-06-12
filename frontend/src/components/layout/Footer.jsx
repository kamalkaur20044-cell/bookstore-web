import { useState } from "react";
import toast from "react-hot-toast";
import logo from "../../assets/logo.png";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSignup = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Subscribed! Check your email for exclusive offers.");
    setEmail("");
  };

  const footerLinks = {
    shop: [
      { label: "All Books", href: "/" },
      { label: "Bestsellers", href: "/" },
      { label: "New Arrivals", href: "/" },
      { label: "Categories", href: "/" },
    ],
    account: [
      { label: "Sign In", href: "/signin" },
      { label: "My Orders", href: "/orders" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "Account Settings", href: "/" },
    ],
    service: [
      { label: "Contact Us", href: "#" },
      { label: "Shipping & Delivery", href: "#" },
      { label: "Returns & Refunds", href: "#" },
      { label: "FAQ", href: "#" },
    ],
    about: [
      { label: "Our Story", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  };

  return (
    <footer className="bg-slate-900 text-white">
      {/* Newsletter Section */}
      
      {/* Footer Links */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="BookSphere" className="h-10 w-auto" />
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">A home for every story. Discover books that inspire, entertain, and enlighten.</p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-amber-300 transition text-2xl">
                <FaFacebook />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-300 transition text-2xl">
                <FaInstagram />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-300 transition text-2xl">
                <FaTwitter />
              </a>
              <a href="#" className="text-slate-400 hover:text-amber-300 transition text-2xl">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h4 className="font-bold text-white mb-4">My Account</h4>
            <ul className="space-y-2">
              {footerLinks.account.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              {footerLinks.service.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h4 className="font-bold text-white mb-4">About Us</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="text-slate-400 hover:text-white transition">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-700 pt-8">
          <p className="text-slate-400 text-center">© 2024 BookSphere. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}