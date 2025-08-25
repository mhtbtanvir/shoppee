"use client";
import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdArrowDropright, IoMdClose } from "react-icons/io";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, logoutUser } from "../../store/auth-slice";
import { LogOut, User, LogIn, UserPlus } from "lucide-react"; // icons  

const Navbar = () => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, user } = useSelector(selectAuth); // 👈 from Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Catalog", href: "/products" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`, {
          withCredentials: true,
        });

        const products = res.data.products || [];
        const grouped = Object.values(
          products.reduce((acc, product) => {
            const cat = product.category || "Uncategorized";
            if (!acc[cat]) {
              acc[cat] = { category: cat, items: [] };
            }
            acc[cat].items.push(product);
            return acc;
          }, {})
        );

        setCategories(grouped);
        setSelectedCategory(grouped[0]?.category || null);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen((prev) => !prev);
  };

  const closeSubMenu = () => {
    setDesktopMenuOpen(false);
    setSelectedCategory(null);
  };

const handleLogout = async () => {
  await dispatch(logoutUser());
  navigate("/auth/login");
};



  return (
    <>
      {/* NAVBAR */}
      <nav className="hidden md:block bg-gray-500 mx-6 px-2 relative rounded-lg ]">
        <div className="mx-auto -my-4 flex h-12 max-w-[1200px] items-center">
          {/* Categories Button */}
          <button
            onClick={toggleDesktopMenu}
            className="ml-5 rounded-sm border-2 border-white text-white border-y-0 flex h-full w-40 items-center justify-center gap-2 bg-black cursor-pointer"
          >
            <RxHamburgerMenu className="mx-1 w-6 h-6 text-white" />
            Categories
          </button>

          {/* Nav Links */}
          <div className="mx-7 flex gap-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className="font-light text-white hover:text-yellow-400 hover:underline duration-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Auth Links */}
          <div className="ml-auto flex items-center gap-6 px-6 font-medium">
            {isAuthenticated ? (
              <>
                {/* Greeting with user icon */}
                <div className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-colors duration-150">
                  <User className="w-5 h-5" />
                  <span className="tracking-wide">
                    <span className="font-semibold">{user?.name || "User"}</span>
                  </span>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-white/90 hover:text-red-400 transition-colors duration-150"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="tracking-wide">Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login link */}
                <Link
                  to="/auth/login"
                  className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-colors duration-150"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="tracking-wide">Login</span>
                </Link>

                {/* Register link */}
                <Link
                  to="/auth/register"
                  className="flex items-center gap-2 text-white/90 hover:text-yellow-400 transition-colors duration-150"
                >
                  <UserPlus className="w-5 h-5" />
                  <span className="tracking-wide">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* DROPDOWN MENU */}
      {desktopMenuOpen && (
        <section className="left-0 right-0 shadow-md z-10 w-full border bg-white">
          <div className="hidden mx-auto md:flex max-w-[1200px] py-10 relative">
            {/* Categories List */}
            <div className="w-[300px] border-r overflow-y-auto max-h-[500px]">
              <ul className="px-5">
                {loading ? (
                  <li className="py-2 text-gray-500">Loading...</li>
                ) : (
                  categories.map((cat, index) => (
                    <li
                      key={index}
                      className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-neutral-100 ${
                        selectedCategory === cat.category ? "bg-gray-400" : ""
                      }`}
                      onClick={() =>
                        setSelectedCategory(
                          selectedCategory === cat.category ? null : cat.category
                        )
                      }
                    >
                      {cat.category}
                      <span className="ml-auto">
                        <IoMdArrowDropright className="h-4 w-4" />
                      </span>
                    </li>
                  ))
                )}
              </ul>
            </div>

            {/* Submenu */}
            <div className="flex w-full justify-between">
              {selectedCategory &&
                categories
                  .find((cat) => cat.category === selectedCategory)
                  ?.items.slice(0, 8)
                  .map((item, idx) => (
                    <div key={idx} className="mx-5">
                      <Link
                        to={`productsDetails/${item._id}`}
                        className="hover:underline hover:text-violet-700 block py-1"
                      >
                        {item.name}
                      </Link>
                    </div>
                  ))}
            </div>

            {/* Close Button */}
            <button
              onClick={closeSubMenu}
              className="absolute top-5 right-5 text-gray-600 hover:text-black"
            >
              <IoMdClose className="w-6 h-6" />
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default Navbar;
