import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Contact = () => {
 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-black- to-gray-50 flex items-center justify-center p-6">
     
      <div className="max-w-6xl w-full bg-white/30 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-10 flex flex-col lg:flex-row gap-10">
       
        {/* Left Side: Contact Form */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-wide">
            Get in Touch
          </h1>
          <p className="text-gray-600 mb-8">
            We’d love to hear from you! Send us a message and we’ll respond as soon as possible.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="p-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              className="p-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all"
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="6"
              className="p-4 rounded-xl border border-white/40 bg-white/20 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-purple-400 outline-none transition-all resize-none"
              required
            />
            <button
              type="submit"
              className="py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold tracking-wide hover:scale-105 transition-transform shadow-lg"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Right Side: Social Links & Info */}
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Follow Us</h2>
          <p className="text-gray-600 text-center mb-6">
            Stay connected through our social media channels.
          </p>

          <div className="flex  gap-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-blue-600 hover:text-white text-blue-600 transition-all shadow-md text-2xl"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-blue-400 hover:text-white text-blue-400 transition-all shadow-md text-2xl"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-pink-500 hover:text-white text-pink-500 transition-all shadow-md text-2xl"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white/30 backdrop-blur-sm hover:bg-blue-700 hover:text-white text-blue-700 transition-all shadow-md text-2xl"
            >
              <FaLinkedinIn />
            </a>
          </div>

          <p className="text-gray-500 mt-6 text-center">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </div>

    
  );
};

export default Contact;
