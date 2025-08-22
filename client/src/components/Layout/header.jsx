"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart, CiSearch, CiUser } from "react-icons/ci";
import { IoBagHandleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { selectAuth, logout } from "../../store/auth-slice"; // ✅ use your slice
import logo from "../../assets/logo2.png";
import SearchForm from "./SearchForm";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(selectAuth); // ✅ use selector
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/"); // back to homepage
  };

  const links = [
    { text: "Home", url: "/homepage" },
    { text: "Catalog", url: "/products" },
    { text: "About Us", url: "/about-us" },
    { text: "Contact Us", url: "/contact-us" },
  ];

  const iconLinks = [
    {
      href: "/wishlist",
      icon: <CiHeart className="h-6 w-6" />,
      text: "Wishlist",
    },
    {
      href: "/cart",
      icon: <IoBagHandleSharp className="h-6 w-6" />,
      text: "Cart",
    },
    {
      href: "/account",
      icon: <CiUser className="h-6 w-6" />,
      text: "Account",
    },
  ];

  return (
    <div className="w-full -mt-3">
      <header className="w-full bg-white shadow-sm shadow-gray-400 top-0 z-10">
        <div className="mx-auto flex h-24 max-w-[2400px] items-center justify-between px-8">
          {/* Logo */}
          <Link to="/homepage" className="w-16 flex">
            <img
              className="cursor-pointer sm:h-auto sm:w-auto"
              src={logo}
              alt="logo"
            />
          </Link>

          {/* Hamburger (mobile) */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-white border-2 border-black p-2 rounded-md hover:bg-gray-100 transition"
            >
              <RxHamburgerMenu className="w-6 h-6 text-black" />
            </button>
          </div>

        
          {/* Search (desktop) */}
          <SearchForm className="hidden h-9 w-2/5 md:flex" />

          {/* Icons + Auth Links (desktop) */}
          <div className="hidden gap-5 md:!flex items-center">
            {iconLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="flex cursor-pointer flex-col items-center justify-center"
              >
                {link.icon}
                <p className="text-xs">{link.text}</p>
              </Link>
            ))}

            
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <section className="md:hidden absolute left-0 right-0 z-50 h-screen w-full bg-white">
          <div className="mx-auto">
            {/* Icons */}
            <div className="mx-auto flex w-full justify-center gap-6 py-4">
              {iconLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="flex cursor-pointer flex-col items-center justify-center"
                >
                  {link.icon}
                  <p className="text-xs">{link.text}</p>
                </Link>
              ))}
            </div>

            {/* Auth (mobile) */}
            <div className="text-center py-3">
              {isAuthenticated ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-gray-700">
                    Hi, {user?.name || "User"}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex justify-center gap-4">
                  <Link to="/auth/login" className="text-gray-700">
                    Login
                  </Link>
                  <span>|</span>
                  <Link to="/auth/register" className="text-gray-700">
                    Signup
                  </Link>
                </div>
              )}
            </div>

            {/* Search (mobile) */}
            <SearchForm className="flex h-9 w-full md:hidden my-4  mx-auto" />
             

            {/* Links */}
            <ul className="text-center font-medium">
              {links.map((link, index) => (
                <li key={index} className="py-2">
                  <Link to={link.url}>{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default Header;
