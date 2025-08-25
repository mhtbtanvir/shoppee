import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/wishlist`,
          { withCredentials: true }
        );

        if (data.success) {
          setUserEmail(data.userEmail || null);

          const normalizedProducts = (data.products || []).map((product) => {
            // Normalize images to absolute URLs
            const images = (product.images || []).map((img) =>
              typeof img === "string"
                ? img.startsWith("/uploads/")
                  ? `${import.meta.env.VITE_API_URL}${img}`
                  : img
                : img.url
            );

            return {
              ...product,
              images,
              likedBy: product.likedBy || [],
              likedByCurrentUser: data.userEmail
                ? product.likedBy.includes(data.userEmail)
                : false,
              like: product.like || product.likedBy.length || 0,
            };
          });

          setProducts(normalizedProducts);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch wishlist");
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleLike = async (productId) => {
    if (!userEmail) return;

    // Optimistic update
    setProducts((prev) =>
      prev
        .map((p) =>
          p._id === productId
            ? {
                ...p,
                likedByCurrentUser: !p.likedByCurrentUser,
                like: !p.likedByCurrentUser ? p.like + 1 : Math.max(p.like - 1, 0),
              }
            : p
        )
        .filter((p) => p.likedByCurrentUser) // remove if unliked
    );

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/products/${productId}/like`,
        
        {},
        { withCredentials: true }
      );

      // Sync with server
      setProducts((prev) =>
        prev
          .map((p) =>
            p._id === productId
              ? {
                  ...p,
                  likedByCurrentUser: data.product.likedBy.includes(userEmail),
                  like: data.product.like,
                  likedBy: data.product.likedBy,
                }
              : p
          )
          .filter((p) => p.likedBy.includes(userEmail))
      );
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  return (
        <div className="m-6 border-2 border-gray-500/30 shadow-xl p-6">
        <div className="absolute m-6 z-50">
                 <button
                      onClick={() => navigate(-1)}
                      className="flex items-center gap-2   text-gray-700 hover:text-gray-900 -mt-2"
                    >
                      <IoArrowBackOutline className="-ml-6 w-6 h-6" />
                      <span className="font-medium hidden md:block">Back </span>
                      
                    </button>
            </div>
      <h1 className="text-4x font-prata flex justify-center items-center pb-5 font-extrabold text-gray-900 tracking-tight">
      WishList
    </h1>

      {loading ? (
        <p className="text-center text-gray-700 font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-bold">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onLike={handleLike} // pass parent handler
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No products in your wishlist
        </p>
      )}
    </div>
  );
};

export default Wishlist;
