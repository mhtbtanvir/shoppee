"use client";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart, CiSearch, CiUser } from "react-icons/ci";
import { IoBagHandleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { selectAuth, logout } from "../../store/auth-slice"; // ✅ use your slice
import logo from "../../assets/logo2.png";
import SearchForm from "./searchForm";
import { ShoppingCart } from "lucide-react";
import { IoArrowBackOutline } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { logoutUser } from "../../store/auth-slice";
const Header = () => {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(selectAuth); // ✅ use selector
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());

    navigate("/"); // back to homepage
  };
  


const CartIcon = () => {
  const { totalQuantity } = useSelector((state) => state.cart);

  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className=" w-6 h-6" />
      {totalQuantity > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-slate-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
};

  const links = [
    { text: "Home", url: "/" },
    { text: "Catalog", url: "/products" },
    { text: "About Us", url: "/about" },
    { text: "Contact Us", url: "/contact" },
  ];

const iconLinks = [
  { href: "/wishlist", icon: <CiHeart className="h-6 w-6" />, text: "Wishlist" },
  { href: "/cart", icon: "cart", text: "Cart" }, // special case
  { href: "/profile", icon: <CiUser className="h-6 w-6" />, text: "Admin" },
  {href:"/order-history",icon:<IoBagHandleSharp className="h-6 w-6" />,text:"Order History"},
];


  return (
    <div className=" w-full -mt-3">
      <header className="w-full bg-white shadow-sm shadow-gray-400 top-0 z-10">
       <div className="mx-auto flex h-24 max-w-[2400px] items-center justify-between px-8">
  
  <Link to="/" className="w-16 flex">
    <img
      className="cursor-pointer sm:h-auto sm:w-auto"
      src={logo}
      alt="logo"
    />
  </Link>

  
    <Link
      onClick={() =>
         setMobileMenuOpen(false)}
      to="/"
      className="flex flex-col items-center justify-center gap-1 text-gray-700 hover:text-yellow-500 transition-colors"
    >
      <AiOutlineHome className="md:hidden text-blue-600/80 w-6 h-6" />
    </Link>

    {/* Hamburger */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="bg-white md:hidden border-2 border-black p-2 rounded-md hover:bg-gray-100 transition"
    >
      <RxHamburgerMenu className="md:hidden w-6 h-6 text-black" />
    </button>
  

  {/* Search (desktop only) */}
  <div className="hidden mx-auto md:flex w-1/5">
    <SearchForm className="h-9 w-full" />
  </div>

  {/* Icons + Auth Links (desktop only) */}
  <div className="hidden md:flex gap-5 items-center">
    {iconLinks.map((link, index) => (
      <div
        key={index}
        className="flex cursor-pointer flex-col items-center justify-center hover:text-yellow-500 transition-colors"
      >
        {link.icon === "cart" ? (
          <CartIcon /> // already has its own <Link>
        ) : (
          <Link to={link.href}>{link.icon}</Link>
        )}
        <p className="text-xs">{link.text}</p>
      </div>
    ))}
  </div>
</div>

      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
  <section className="md:hidden absolute left-0 right-0 z-50 h-screen w-full bg-white">
    <div className="mx-auto relative">
      {/* Back Arrow */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-2 text-gray-700 hover:text-yellow-500 transition-colors font-medium"
        >
          <IoArrowBackOutline className="w-6 h-6" />
          <span></span>
        </button>
      </div>

      {/* Icons */}
      <div className="mx-auto flex w-full justify-center gap-6 py-4 mt-12">
        {iconLinks.map((link, index) => (
          <div
          onClick={() => setMobileMenuOpen(false)}
            key={index}
            className="flex cursor-pointer flex-col items-center justify-center hover:text-yellow-500 transition-colors"
          >
            
            {link.icon === "cart" ? <CartIcon /> : <Link to={link.href}>{link.icon}</Link>}
            <p className="text-xs">{link.text}</p>
          </div>
        ))}
      </div>

      {/* Auth (mobile) */}
      <div className="text-center py-3">
        {isAuthenticated ? (
          <div className="flex flex-col items-center gap-2">
            <span className="text-gray-700">Hi, {user?.name || "User"}</span>
            <button 
            onClick={() => {
              setMobileMenuOpen(false);
              handleLogout();
            }}

          
             
             className="text-red-600 hover:text-red-800">
              LOGOUT
            </button>
          </div>
        ) : (
          <div className="flex justify-center gap-4">
            <Link to="/auth/login" className="text-gray-700">LOGIN</Link>
            <span>|</span>
            <Link to="/auth/register" className="text-gray-700">SIGNUP</Link>
          </div>
        )}
      </div>

      {/* Search (mobile) */}
      <SearchForm className="mx-5 my-10 flex justify-center ml-16 " />

      {/* Links */}
      <ul className="text-center font-medium">
        {links.map((link, index) => (
          <li key={index} className="py-2">
            <Link
            onClick={() => setMobileMenuOpen(false)}
             to={link.url}>{link.text}</Link>
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
