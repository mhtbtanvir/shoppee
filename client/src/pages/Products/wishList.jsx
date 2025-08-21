// src/pages/Wishlist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const Wishlist = () => {
  const [products, setProducts] = useState([]);
  const [liked, setLiked] = useState({}); // key: productId, value: true/false
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        const normalizedProducts = (res.data.products || []).map((product) => {
          // Fix broken images
          const images =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img) => ({
                  url: img.startsWith("/uploads/")
                    ? `http://localhost:5000${img}`
                    : img,
                  alt: product.name,
                }))
              : [];

          return {
            ...product,
            images,
            likedBy: product.likedBy?.map(String) || [],
            ratings: product.ratings || { average: 0, count: 0 },
          };
        });

        setProducts(normalizedProducts);

        // Get current user ID from first likedBy array (or auth)
        const userId =
          normalizedProducts.flatMap((p) => p.likedBy).find(Boolean) || null;
        setCurrentUserId(userId);

        // Initialize liked state
        const likedState = {};
        normalizedProducts.forEach((p) => {
          likedState[p._id] = p.likedBy.includes(userId);
        });
        setLiked(likedState);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle like/unlike
  const handleLike = async (productId) => {
    if (!currentUserId) return;

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/products/${productId}/like`,
        {},
        { withCredentials: true }
      );

      // Update liked state
      setLiked((prev) => ({
        ...prev,
        [productId]: data.product.likedBy.includes(currentUserId),
      }));

      // Update products array to reflect new like count
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, likedBy: data.product.likedBy.map(String), like: data.product.like }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Filter only liked products
  const likedProducts = products.filter((p) => liked[p._id]);

  return (
    <div className="m-6 border border-black shadow-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">
        Your Wishlist
      </h1>

      {loading ? (
        <p className="text-center text-gray-700 font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-bold">{error}</p>
      ) : likedProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {likedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={{ ...product, liked: true }}
              onLike={handleLike}
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
