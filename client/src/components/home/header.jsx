// components/Header.jsx
"use client";
import React, { useState } from "react";
import { CiHeart, CiSearch, CiUser } from "react-icons/ci";
import { IoBagHandleSharp } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { text: "Home", url: "index.html" },
    { text: "Catalog", url: "catalog.html" },
    { text: "About Us", url: "about-us.html" },
    { text: "Contact Us", url: "contact-us.html" },
  ];

  const iconLinks = [
    {
      href: "wishlist.html",
      icon: <CiHeart className="h-6 w-6" />,
      text: "Wishlist",
    },
    {
      href: "",
      icon: <IoBagHandleSharp className="h-6 w-6" />,
      text: "Cart",
    },
    {
      href: "",
      icon: <CiUser className="h-6 w-6" />,
      text: "Account",
    },
  ];

  return (
    <div >
    <header className="w-full bg-white shadow sticky top-0 z-50">
        <div className="mx-auto flex h-16 max-w-[2400px] items-center justify-between px-8">
            {/* Logo */}
            <a href="/" className="w-24">
            <img
                className="cursor-pointer sm:h-auto sm:w-auto"
                src="https://i.imgur.com/520zDfd.png"
                alt="logo"
            />
    </a>

    {/* Hamburger (mobile) */}
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
    <form className="bg-gray-200 rounded-xl hidden h-9 
    w-2/5 items-center
     border md:flex">
      <CiSearch className="mx-3 h-4 w-4" />
      <input
        className="w-11/12 outline-none bg-gray-200"
        type="search"
        placeholder="Search"
      />
      <button className="ml-auto py-1 text-white h-full items-center
       bg-gray-500 px-4 
       rounded-l-none rounded-r-xl">
        Search
      </button>
    </form>

    {/* Icons (desktop) */}
    <div className="hidden gap-3 md:!flex ">
      {iconLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          className="flex cursor-pointer flex-col items-center justify-center"
        >
          {link.icon}
          <p className="text-xs">{link.text}</p>
        </a>
      ))}
    </div>
  </div>
</header>

{/* Mobile menu */}
{mobileMenuOpen && (
  <section className="md:hidden absolute left-0 right-0 z-50 h-screen w-full bg-white">
    <div className="mx-auto">
      {/* Icons */}
      <div className="mx-auto flex w-full justify-center gap-3 py-4 ">
        {iconLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="flex cursor-pointer flex-col items-center justify-center"
          >
            {link.icon}
            <p className="text-xs">{link.text}</p>
          </a>
        ))}
      </div>

      {/* Search (mobile) */}
      <form className="bg-gray-200 my-4 mx-5 flex h-9 items-center border-2 rounded-xl">
        <CiSearch className="mx-3 h-4 w-4" />
        <input
          className="w-11/12 outline-none  bg-gray-200 "
          type="search"
          placeholder="Search"
        />
        <button
          type="submit"
          className="ml-auto py-1 text-white h-full items-center bg-gray-500 px-4 rounded-l-none rounded-r-xl"
        >
          Search
        </button>
      </form>

      {/* Links */}
      <ul className="text-center font-medium">
        {links.map((link, index) => (
          <li key={index} className="py-2">
            <a href={link.url}>{link.text}</a>
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