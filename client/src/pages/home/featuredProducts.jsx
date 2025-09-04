import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { useSelector, } from "react-redux";
import { selectAuth,  } from "../../store/auth-slice";
import  { useRef } from "react";

const FeaturedProducts = () => {

   const topRef = useRef(null); // 👈 create a ref


  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useSelector(selectAuth); // 👈 from Redux
  



  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`/api/products`, {
          withCredentials: true,
        });

        const normalized = (res.data.products || [])
          .filter((p) => p.isFeatured)
          .map((product) => {
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
                : 0;

            return {
              ...product,
              images,
              discountPrice,
              // Use server-sent likedByCurrentUser
              like: product.like || product.likedBy?.length || 0,
            };
          });

        setFeaturedProducts(normalized);
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to fetch featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleLike = async (productId) => {
  // Optimistic UI update
  setFeaturedProducts((prev) =>
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
    const res = await axios.post(
      `/api/products/${productId}/like`,
      {},
      { withCredentials: true }
    );

    const updatedServerProduct = res.data.product;

    setFeaturedProducts((prev) =>
      prev.map((p) =>
        p._id === productId
          ? {
              ...p,
              likedByCurrentUser: updatedServerProduct.likedByCurrentUser,
              like: updatedServerProduct.like || p.like,
              images: p.images, // preserve existing images!
            }
          : p
      )
    );
  } catch (err) {
    console.error("Error liking product:", err);
    // Rollback optimistic update
    setFeaturedProducts((prev) =>
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
  }
};

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination math
  const totalPages = Math.ceil(featuredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = featuredProducts.slice(startIndex, startIndex + itemsPerPage);

if (loading) {
  return (
    <div className="featured-products p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
      {Array.from({ length: 8 }).map((_, i) => (
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
        Failed to load featured products. Please try refreshing the page.
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

 
return (
  <section ref={topRef} className="py-4 px-2 md:px-6">
    {/* Heading */}
    <div className="text-center mb-6 md:mb-12">
      <h2 className="text-2xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight pt-2 md:pt-6">
        Curated Just for You
        {isAuthenticated && (
          <span className="text-cyan-600">{" - " + user?.name}!</span>
        )}
      </h2>
    </div>

    {/* Products: mobile scroll / desktop grid */}
    <div
      className="flex gap-3 scrollbar-hide overflow-x-auto pb-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible scroll-smooth"
    >
      {paginatedProducts.length > 0 ? (
        paginatedProducts.map((product) => (
          <div
            key={product._id}
            className="flex-shrink-0 w-4/5 sm:w-2/3 md:w-full flex flex-col justify-between
                       bg-white rounded-lg shadow-sm hover:shadow-2xl hover:scale-105 hover:z-10
                       transition-transform duration-200 ease-in-out"
          >
            <ProductCard product={product} onLike={handleLike} />
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          No featured products available.
        </p>
      )}
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="flex justify-center items-center gap-2 mt-6 md:mt-10">
        {/* Prev Button (desktop only) */}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.max(prev - 1, 1));
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

        {/* Next Button (desktop only) */}
        <button
          onClick={() => {
            setCurrentPage((prev) => Math.min(prev + 1, totalPages));
            topRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
          disabled={currentPage === totalPages}
          className="hidden md:block px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    )}
  </section>
);

}

export default FeaturedProducts;
