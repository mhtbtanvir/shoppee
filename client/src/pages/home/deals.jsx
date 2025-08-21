// src/pages/Deals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        const normalizedProducts = (res.data.products || []).map((product) => {
          const images =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img) => ({
                  url: img.startsWith("/uploads/")
                    ? `http://localhost:5000${img}`
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
            liked: product.likedByCurrentUser || false,
            ratings: product.ratings || { average: 0, count: 0 },
          };
        });

        // Sort by discount descending and take top 4
        const topDeals = normalizedProducts
          .sort((a, b) => (b.discount || 0) - (a.discount || 0))
          .slice(0, 4);

        setProducts(topDeals);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLike = async (id) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p._id === id ? { ...p, liked: !p.liked } : p))
      );

      await axios.post(`http://localhost:5000/api/products/${id}/like`, {}, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Heading */}
      <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight text-center">
        🔥 Top Deals
      </h2>
      <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto text-center">
        Best discounts just for you, You Lucky Duck!
      </p>

      {/* Loading / Error / Product Grid */}
      {loading ? (
        <p className="text-center text-gray-700 font-semibold mt-8">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-bold mt-8">{error}</p>
      ) : products.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} onLike={handleLike} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">No deals available</p>
      )}
    </div>
  );
};

export default Deals;
