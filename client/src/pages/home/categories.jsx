// src/components/Categories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useRef } from "react";
const Categories = () => {
  const topRef = useRef(null);
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ For pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`/api/products`, {
          withCredentials: true,
        });

        const products = res.data.products || [];

        const grouped = products.reduce((acc, product) => {
          const cat = product.category || "Uncategorized";
          if (!acc[cat]) {
            acc[cat] = {
              name: cat,
              items: [],
              image: product.images?.[0] || null,
            };
          }
          acc[cat].items.push(product);
          return acc;
        }, {});

        setCategories(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch categories from products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Update items per page depending on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2); // sm screen
      } else {
        setItemsPerPage(4); // md+ screen
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

if (loading) {
  return (
    <div className="featured-products p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
      {Array.from({ length: 4}).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="bg-gray-600 h-60 rounded-md mb-4"></div>

          {/* Title Placeholder */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

        
          {/* Like/Action Placeholder */}
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
        </div>
      ))}
   <p className="col-span-full text-center text-gray-500 mt-4 text-sm">
  Loading featured products… please wait a few seconds.{" "}
  <span className="text-gray-400 italic">
    (First-time load may take up to 30 seconds as the server starts)
  </span>
</p>

    </div>
  );
}


if (error) {
  return (
    <div className="flex flex-col items-center justify-center mt-20 text-red-600">
      <p className="text-lg font-bold">⚠️ Oops! Something went wrong.</p>
      <p className="text-sm text-gray-500 mt-1">
        Failed to load Catagories. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Retry
      </button>
    </div>
  );
}

  const allCategories = Object.values(categories);
  const totalPages = Math.ceil(allCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = allCategories.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-5">
      <h2 className="mt-4 text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight text-center">
        Browse Categories
      </h2>
      <p className="my-8  text-gray-600 text-lg max-w-xl mx-auto text-center">
        Discover our diverse collection of products, carefully curated to suit every taste and need.
      </p>

      {/* Categories Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {paginatedCategories.length > 0 ? (
          paginatedCategories.map((cat) => (
            <div
              key={cat.name}
              className="relative border border-gray-800 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden">
                {cat.image ? (
                  <img
                    src={
                      typeof cat.image === "string"
                        ? cat.image.startsWith("/uploads/")
                          ? `${import.meta.env.VITE_API_URL}${cat.image}`
                          : cat.image
                        : cat.image.url
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Count Badge */}
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold rounded z-10">
                  {cat.items.length} items
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 border-t border-gray-400 flex flex-col flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {cat.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Explore the best {cat.name.toLowerCase()}.
                </p>

                <div className="mt-auto flex justify-end">
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
                  >
                    Explore <AiOutlineArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No categories found
          </p>
        )}
      </div>

      {/* ✅ Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6 md:mt-10">
          {/* Prev Button (hidden on small screens) */}
          <button
             onClick={() => {
            setCurrentPage((prev) => Math.max(prev -1, 1));
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
            disabled={currentPage === 1}
            className="hidden md:block px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Prev
          </button>

          {/* Dots for mobile */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-2 h-2 rounded-full ${
                  currentPage === i + 1 ? "bg-cyan-600" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Next Button (hidden on small screens) */}
          <button
          
                    onClick={() => {
  setCurrentPage((prev) => Math.max(prev +1, 1));
  topRef.current?.scrollIntoView({ behavior: "smooth" });
}}
            disabled={currentPage === totalPages}
            className="hidden md:block px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Categories;
