import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { useSelector, } from "react-redux";
import { selectAuth,  } from "../../store/auth-slice";
import ScrollToTop from "@/components/scrollToTop";
const FeaturedProducts = () => {
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


  if (loading)
    return <div className="text-center mt-10 text-gray-700 font-semibold">Loading...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-600 font-bold">{error}</div>;

 
 return (
  
    <section className="py-2 px-0 md:px-4">
      {/* Heading */}
      <div className="text-center mb-8 md:mb-16">
        <h2 className="pt-4 md:pt-8 text-2xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight">
          Curated Just for You
          {isAuthenticated && (
            <span className="text-cyan-600">{" - " + user?.name}!</span>
          )}
        </h2>
       
      </div>

      {/* Products */}
      {/* Mobile: horizontal scroll | Desktop: grid */}
  <div
  className="flex gap-2 overflow-x-auto pb-2 
             md:grid md:grid-cols-3 md:gap-6
              md:overflow-visible 
             py-2 scroll-smooth"
>
  {paginatedProducts.length > 0 ? (
    paginatedProducts.map((product) => (
      <div
        key={product._id}
        className="w-[70%] sm:w-[45%] md:w-full flex-shrink-0 
                   flex flex-col justify-between
                   bg-white rounded-lg shadow-sm 
                   hover:shadow-2xl hover:scale-105 hover:z-10
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
          {/* Prev Button (hidden on small screens) */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
          
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              
            }
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
