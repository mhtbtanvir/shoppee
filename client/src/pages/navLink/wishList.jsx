import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products/wishlist",
          { withCredentials: true }
        );

        if (data.success) {
          setUserEmail(data.userEmail || null);

          const normalizedProducts = (data.products || []).map((product) => {
            // Normalize images to absolute URLs
            const images = (product.images || []).map((img) =>
              typeof img === "string"
                ? img.startsWith("/uploads/")
                  ? `http://localhost:5000${img}`
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
        `http://localhost:5000/api/products/${productId}/like`,
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
    <div className="m-6 border border-black shadow-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Your Wishlist
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
