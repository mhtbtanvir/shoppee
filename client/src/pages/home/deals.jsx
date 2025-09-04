// src/pages/Deals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const API_URL = `/api/products`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL, { withCredentials: true });

        const normalizedProducts = (res.data.products || []).map((product) => {
          const images =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img) => ({
                  url: img.startsWith("/uploads/")
                    ? `${import.meta.env.VITE_API_URL}${img}`
                    : img,
                  alt: product.name,
                }))
              : [];

          const discountPrice =
            product.discount > 0
              ? (product.price * (100 - product.discount)) / 100
              : product.price;

          return {
            ...product,
            images,
            discountPrice,
            likedByCurrentUser: product.likedByCurrentUser || false,
            like: product.like || product.likedBy?.length || 0,
            ratings: product.ratings || { average: 0, count: 0 },
          };
        });

        // Sort by discount descending (not just 4 — let pagination handle slicing)
        const sortedDeals = normalizedProducts.sort(
          (a, b) => (b.discount || 0) - (a.discount || 0)
        );

        setProducts(sortedDeals);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Responsive items per page
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(4); // sm screens → 2 per page
      } else {
        setItemsPerPage(4); // md+ → 4 per page
      }
    };
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const handleLike = async (productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? {
              ...p,
              likedByCurrentUser: !p.likedByCurrentUser,
              like: !p.likedByCurrentUser ? p.like + 1 : Math.max(p.like - 1, 0),
            }
          : p
      )
    );

    try {
      const res = await axios.post(`${API_URL}/${productId}/like`, {}, {
        withCredentials: true,
      });
      const updatedServerProduct = res.data.product;

      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                likedByCurrentUser: updatedServerProduct.likedByCurrentUser,
                like: updatedServerProduct.like || p.like,
                images: p.images,
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking product:", err);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="container mx-auto  py-8">
      {/* Heading */}
      <h2
        className="pb-12 text-center text-3xl md:text-4xl lg:text-5xl 
                   font-extrabold tracking-tight font-prata
                   bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-800
                   bg-clip-text text-transparent drop-shadow-md"
      >
        Biggest Discounts Across the Web!
      </h2>

      {/* Loading / Error / Product Grid */}
      {loading ? (
            <div className="featured-products p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
      {Array.from({ length: 4}).map((_, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg p-4 shadow-sm animate-pulse"
        >
          {/* Image Placeholder */}
          <div className="bg-gray-300 h-40 rounded-md mb-4"></div>

          {/* Title Placeholder */}
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

          {/* Price Placeholder */}
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>

          {/* Like/Action Placeholder */}
          <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
        </div>
      ))}
   <p className="col-span-full text-center text-gray-500 mt-4 text-sm">
  Loading Discount Products… please wait a few seconds.{" "}
  <span className="text-gray-400 italic">
    (First-time load may take up to 30 seconds as the server starts)
  </span>
</p>

    </div>
      ) : error ? (
        <p className="text-center text-red-600 font-bold mt-8">{error}</p>
      ) : products.length > 0 ? (
        <>
   <div
  className="flex gap-4  overflow-x-auto pb-3 
             md:grid md:grid-cols-2 lg:grid-cols-4 
             md:gap-6 md:overflow-visible scrollbar-hide"
>
  {paginatedProducts.map((product) => (
    <div
      key={product._id}
     className="w-[70%] sm:w-[45%] md:w-full flex-shrink-0 
                   flex flex-col justify-between
                   bg-white rounded-lg shadow-sm 
                   hover:shadow-2xl hover:scale-105 hover:z-10
                   transition-transform scr duration-200 ease-in-out"
      >
      <ProductCard product={product} onLike={handleLike} />
    </div>
  ))}
</div>


          {/* ✅ Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6 md:mt-10">
              {/* Prev Button (md+) */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="hidden md:block px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                Prev
              </button>

              {/* Dots (always visible) */}
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

              {/* Next Button (md+) */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="hidden md:block px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">No deals available</p>
      )}
    </div>
  );
};

export default Deals;
