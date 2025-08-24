// src/pages/Deals.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

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

        // Sort by discount descending and take top 4 deals
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

  const handleLike = async (productId) => {
    // Optimistic UI update
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

      // Preserve images while syncing server response
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                likedByCurrentUser: updatedServerProduct.likedByCurrentUser,
                like: updatedServerProduct.like || p.like,
                images: p.images, // preserve images
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking product:", err);
      // Rollback optimistic update
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
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      {/* Heading */}
       <span>
      <h2 className=" pb-12 text-center text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight 
                 
bg-gradient-to-r from-cyan-700 font-prata via-blue-700 to-cyan-800
                 bg-clip-text text-transparent drop-shadow-md">
    Biggest Discounts Across the Web!
  </h2>
    </span>
      {/* <p className="mb-16 mt-8 text-gray-600 text-lg max-w-xl mx-auto text-center">
        Best discounts just for you!
      </p> */}

      {/* Loading / Error / Product Grid */}
      {loading ? (
        <p className="text-center text-gray-700 font-semibold mt-8">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-bold mt-8">{error}</p>
      ) : products.length > 0 ? (
   <div className=" container mx-auto px-4 py-4">
   
  

  <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 mt-10">
    {products.map((product) => (
      <ProductCard
        key={product._id}
        product={product}
        onLike={handleLike}
      />
    ))}
  </div>
</div>

      ) : (
        <p className="text-center text-gray-500 mt-8">No deals available</p>
      )}
    </div>
  );
};

export default Deals;
