// src/components/Footer.jsx
import React from "react";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative w-full bg-gray-900/90 backdrop-blur-md text-white px-6 md:px-12 py-16 overflow-hidden">
      {/* Decorative blurred shapes */}
      <div className="absolute -left-10 -top-10 w-56 h-56 bg-blue-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute right-0 bottom-0 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl -z-10" />

      {/* Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-prata">Our Brand</h3>
          <p className="text-gray-300 text-sm">
            Premium fashion curated for modern lifestyles. Follow us for
            latest trends and exclusive collections.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-prata">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white transition">Home</li>
            <li className="hover:text-white transition">Shop</li>
            <li className="hover:text-white transition">About</li>
            <li className="hover:text-white transition">Contact</li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-prata">Customer Service</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-white transition">FAQ</li>
            <li className="hover:text-white transition">Shipping & Returns</li>
            <li className="hover:text-white transition">Privacy Policy</li>
            <li className="hover:text-white transition">Terms of Service</li>
          </ul>
        </div>

        {/* Newsletter & Social */}
        <div>
          <h3 className="text-xl font-bold mb-4 font-prata">Stay Updated</h3>
          <p className="text-gray-300 text-sm mb-4">
            Subscribe to our newsletter for exclusive offers.
          </p>
          <form className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 font-semibold hover:opacity-95 transition">
              Subscribe
            </button>
          </form>
          <div className="flex gap-4 mt-6">
            <Facebook className="w-6 h-6 hover:text-blue-500 transition cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-pink-400 transition cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-blue-400 transition cursor-pointer" />
            <Youtube className="w-6 h-6 hover:text-red-600 transition cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-12 border-t border-white/20 pt-6 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Our Brand. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
