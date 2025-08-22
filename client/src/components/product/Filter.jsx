import React, { useState, useEffect } from "react";

const Filter = ({ products, onFilterChange, initialCategory }) => {
  const [category, setCategory] = useState(initialCategory || "All");
  const [brand, setBrand] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [rating, setRating] = useState("All");
  const [discount, setDiscount] = useState("All");

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];
  const uniqueBrands = ["All", ...new Set(products.map((p) => p.brand))];

  const maxPrice = Math.max(...products.map((p) => p.discountPrice || p.price), 0);

  useEffect(() => {
    let filtered = products;

    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase()
      );
    }

    if (brand !== "All") {
      filtered = filtered.filter(
        (p) => p.brand?.toLowerCase() === brand.toLowerCase()
      );
    }

    filtered = filtered.filter(
      (p) => p.discountPrice >= priceRange[0] && p.discountPrice <= priceRange[1]
    );

    if (rating !== "All") {
      filtered = filtered.filter(
        (p) => (p.ratings?.average || 0) >= parseInt(rating)
      );
    }

    if (discount !== "All") {
      switch (discount) {
        case "10%+": 
          filtered = filtered.filter((p) => p.discount >= 10); 
          break;
        case "20%+": 
          filtered = filtered.filter((p) => p.discount >= 20); 
          break;
        case "30%+": 
          filtered = filtered.filter((p) => p.discount >= 30); 
          break;
        case "50%+": 
          filtered = filtered.filter((p) => p.discount >= 50); 
          break;
        default: 
          break;
      }
    }

    onFilterChange(filtered);
  }, [category, brand, priceRange, rating, discount, products, onFilterChange]);

  return (
    <div className="flex flex-wrap gap-6 mb-6 justify-center items-center p-4 bg-gray-100 rounded-md border border-gray-700/70">
      {/* Category */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          {uniqueCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Brand</label>
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          {uniqueBrands.map((b) => (
            <option key={b} value={b}>{b || "Unknown"}</option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div className="flex flex-col w-48">
        <label className="text-gray-700 text-sm font-medium mb-1">Max Price: ${priceRange[1]}</label>
        <input
          type="range"
          min="0"
          max={Math.ceil(maxPrice / 100) * 100}
          value={priceRange[1]}
          onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
          className="w-full h-1 bg-gray-300 rounded-lg accent-gray-700"
        />
      </div>

      {/* Rating */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          {["All", 5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r === "All" ? "All" : `${r}<= & up`}
            </option>
          ))}
        </select>
      </div>

      {/* Discount */}
      <div className="flex flex-col">
        <label className="text-gray-700 text-sm font-medium mb-1">Discount</label>
        <select
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
        >
          {["All", "10%+", "20%+", "30%+", "50%+"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;
