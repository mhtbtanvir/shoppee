import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        // normalize & filter featured
        const normalized = (res.data.products || []).map((product) => {
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
              : 0;

          return {
            ...product,
            images,
            discountPrice,
            liked: product.likedByCurrentUser || false,
            ratings: product.ratings || { average: 0, count: 0 },
          };
        });

        setFeaturedProducts(normalized.filter((p) => p.isFeatured));
      } catch (err) {
        console.error("Error fetching featured products:", err);
        setError("Failed to fetch featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const handleLike = async (id) => {
    try {
      const product = featuredProducts.find((p) => p._id === id);
      const likedNow = !product.liked;

      setFeaturedProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, liked: likedNow, like: likedNow ? p.like + 1 : p.like - 1 }
            : p
        )
      );

      await axios.post(
        `http://localhost:5000/api/products/${id}/like`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-700 font-semibold">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="text-center mt-10 text-red-600 font-bold">{error}</div>
    );

  return (
    <section className="py-12 px-4">
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight">
          Curated Just for You
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          Discover timeless essentials with a modern edge, crafted with elegance
          and precision.
        </p>
      </div>

      {/* Featured Product Grid */}
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onLike={handleLike}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No featured products available.
          </p>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
