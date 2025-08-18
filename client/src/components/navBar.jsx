// components/Navbar.jsx
"use client";
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdArrowDropright, IoMdClose } from "react-icons/io";
import { FaBed } from "react-icons/fa";
import { TbToolsKitchen3 } from "react-icons/tb";
import { MdOutdoorGrill } from "react-icons/md";

const Navbar = () => {
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [defaultCategory] = useState("Bedroom");

  const navItems = [
    { label: "Home", href: "#" },
    { label: "Catalog", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Contact Us", href: "#" },
  ];

  const categories = [
    {
      category: "Bedroom",
      icon: <FaBed />,
      menu: [
        {
          title: "Bedroom",
          items: [
            { label: "Luxurious Italian Bed", href: "" },
            { label: "Elegant Queen-size Bed", href: "" },
            { label: "Artisan Wooden Craft Bed", href: "" },
            { label: "Royal King-size Bed", href: "" },
          ],
        },
        {
          title: "Beds",
          items: [
            { label: "Classic Italian Bed", href: "" },
            { label: "Regal Queen-size Bed", href: "" },
            { label: "Handcrafted Wooden Bed", href: "" },
            { label: "Majestic King-size Bed", href: "" },
          ],
        },
      ],
    },
    {
      category: "Outdoor",
      icon: <MdOutdoorGrill />,
      menu: [
        {
          title: "Outdoor",
          items: [
            { label: "Sleek Italian Outdoor Bed", href: "" },
            { label: "Outdoor Queen-size Bed", href: "" },
            { label: "Natural Wooden Craft Bed", href: "" },
            { label: "Innovative King-size Outdoor Bed", href: "" },
          ],
        },
        {
          title: "Lamps",
          items: [
            { label: "Vibrant Italian Purple Lamp", href: "" },
            { label: "High-tech APEX Lamp", href: "" },
            { label: "Modern PIXAR Lamp", href: "" },
            { label: "Ambient Nightlamp", href: "" },
          ],
        },
      ],
    },
    {
      category: "Kitchen",
      icon: <TbToolsKitchen3 />,
      menu: [
        {
          title: "Kitchen",
          items: [
            { label: "Gourmet Italian Bed", href: "" },
            { label: "Designer Queen-size Bed", href: "" },
            { label: "Premium Wooden Craft Bed", href: "" },
            { label: "Modern King-size Bed", href: "" },
          ],
        },
        {
          title: "Special",
          items: [
            { label: "Aromatherapy Humidifier", href: "" },
            { label: "Advanced Bed Cleaner", href: "" },
            { label: "Smart Vacuum Cleaner", href: "" },
            { label: "Plush Pillow", href: "" },
          ],
        },
      ],
    },
  ];

  const closeSubMenu = () => {
    setDesktopMenuOpen(false);
    setSelectedCategory(null);
  };

  const toggleDesktopMenu = () => {
    setDesktopMenuOpen((prev) => !prev);
    setSelectedCategory(defaultCategory);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="hidden md:block w-full bg-violet-900 relative">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center">
          {/* Categories Button */}
          <button
            onClick={toggleDesktopMenu}
            className="ml-5 flex h-full w-40 items-center justify-center bg-amber-400 cursor-pointer"
          >
            <RxHamburgerMenu className="mx-1 w-6 h-6" />
            All Categories
          </button>

          {/* Nav Links */}
          <div className="mx-7 flex gap-8">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="font-light text-white hover:text-yellow-400 hover:underline duration-100"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth Links */}
          <div className="ml-auto flex gap-4 px-5">
            <a
              href="/auth/login.jsx/"
              className="font-light text-white hover:text-yellow-400 hover:underline duration-100"
            >
              Login
            </a>
            <span className="text-white">|</span>
            <a
              href="/auth"
              className="font-light text-white hover:text-yellow-400 hover:underline duration-100"
            >
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      {/* DROPDOWN MENU */}
      {desktopMenuOpen && (
        <section className="relative left-0 right-0 z-10 w-full border bg-white">
          <div className="hidden mx-auto md:flex max-w-[1200px] py-10 relative">
            {/* Categories List */}
            <div className="w-[300px] border-r">
              <ul className="px-5">
                {categories.map((category, index) => (
                  <li
                    key={index}
                    className={`flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-neutral-100 ${
                      selectedCategory === category.category
                        ? "bg-amber-400"
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.category
                          ? null
                          : category.category
                      )
                    }
                  >
                    {category.icon}
                    {category.category}
                    <span className="ml-auto">
                      <IoMdArrowDropright className="h-4 w-4" />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submenu */}
            <div className="flex w-full justify-between">
              {selectedCategory && (
                <div className="flex gap-6">
                  {categories
                    .find((cat) => cat.category === selectedCategory)
                    ?.menu.map((submenu, index) => (
                      <div key={index} className="mx-5">
                        <p className="font-medium text-gray-500">
                          {submenu.title}
                        </p>
                        <ul className="leading-8 text-sm">
                          {submenu.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <a
                                href={item.href}
                                className="hover:underline hover:text-violet-700"
                              >
                                {item.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              )}
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
