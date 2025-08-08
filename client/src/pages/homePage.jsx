import React from "react";
import { Link } from "react-router-dom";

const categories = ["Women", "Men", "Kids"];
const highlights = [
  { title: "New Collection", img: "/images/hero1.jpg" },
  { title: "Sale", img: "/images/hero2.jpg" },
];

const HomePage = () => (
  <div className="min-h-screen bg-white text-gray-900">
    {/* Navbar */}
    <nav className="fixed top-0 left-0 w-full bg-white z-10 flex items-center justify-between p-4 shadow-sm">
      <div className="text-xl font-bold">BrandLogo</div>

      <ul className="hidden md:flex space-x-6">
        {categories.map((cat) => (
          <li key={cat}>
            <Link to={`/${cat.toLowerCase()}`} className="hover:underline">
              {cat}
            </Link>
          </li>
        ))}
      </ul>

      <ul className="hidden md:flex space-x-4">
        <li>
          <Link
            to="/auth/login"
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            to="/auth/register"
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </li>
      </ul>
    </nav>

    <div className="pt-20">
      {/* Hero Carousel */}
      <div className="relative">
        {highlights.map((h, idx) => (
          <div
            key={idx}
            className={`h-screen bg-center bg-cover flex items-end justify-start transition-opacity duration-1000 ${
              idx === 0 ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${h.img})` }}
          >
            <h1 className="text-white text-4xl md:text-6xl font-bold p-8 backdrop-blur-sm">
              {h.title}
            </h1>
          </div>
        ))}
      </div>

      {/* Featured Grids */}
      <section className="py-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <h2 className="text-3xl font-semibold">Featured Women</h2>
        </div>
        <div className="h-96 bg-gray-300 flex items-center justify-center">
          <h2 className="text-3xl font-semibold">Featured Men</h2>
        </div>
        <div className="h-96 bg-gray-200 flex items-center justify-center">
          <h2 className="text-3xl font-semibold">Kids Picks</h2>
        </div>
        <div className="h-96 bg-gray-300 flex items-center justify-center">
          <h2 className="text-3xl font-semibold">Summer Essentials</h2>
        </div>
      </section>
    </div>
  </div>
);

export default HomePage;
