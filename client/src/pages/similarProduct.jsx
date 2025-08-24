import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const SimilarProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL, { withCredentials: true });
        const normalizedProducts = (res.data.products || []).map((product) => ({
          ...product,
          images: Array.isArray(product.images)
            ? product.images.map((img) =>
                typeof img === "string"
                  ? img.startsWith("/uploads/")
                    ? `${import.meta.env.VITE_API_URL}${img}`
                    : img
                  : img.url
              )
            : [],
          discountPrice:
            product.discount > 0
              ? (product.price * (100 - product.discount)) / 100
              : product.price,
          likedByCurrentUser: product.likedByCurrentUser || false,
          like: product.like || product.likedBy?.length || 0,
          ratings: product.ratings || { average: 0, count: 0 },
        }));

        // Pick only 5 products
        setProducts(normalizedProducts.slice(0, 8));
      } catch (err) {
        console.error(err);
        setError("Failed to fetch products");
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
      const res = await axios.post(`${API_URL}/${productId}/like`, {}, { withCredentials: true });
      const updatedProduct = res.data.product;
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, likedByCurrentUser: updatedProduct.likedByCurrentUser, like: updatedProduct.like }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      // rollback
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

  if (loading) return <p className="text-gray-500 animate-pulse">Loading similar products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
<div className="mt-10 px-10">
  <h2 className="text-2xl font-bold text-gray-800 mb-6">Similar Products</h2>

  <div className="flex gap-6 overflow-x-auto py-4 scroll-smooth custom-scrollbar">
    {products.map((product) => (
      <div
        key={product._id}
        className="flex-shrink-0 w-64 h-full flex flex-col justify-between
                   bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105
                   transition-transform duration-300"
      >
        <ProductCard product={product} onLike={() => handleLike(product._id)} />
      </div>
    ))}
  </div>
</div>

  );
};

export default SimilarProducts;
