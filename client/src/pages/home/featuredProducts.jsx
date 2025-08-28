import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "@/components/product/ProductCard";
import { useSelector, } from "react-redux";
import { selectAuth,  } from "../../store/auth-slice";
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

  if (loading)
    return <div className="text-center mt-10 text-gray-700 font-semibold">Loading...</div>;

  if (error)
    return <div className="text-center mt-10 text-red-600 font-bold">{error}</div>;

  return (
    <section className="py-4 px-4">
      <div className="text-center  mb-28">
        <h2 className=" text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight">
          Curated Just for You{""}{isAuthenticated && (
    <span className="text-cyan-600">{" - "+user?.name}!</span>)}
        </h2>
        <p className="mt-8 text-gray-600 text-lg max-w-xl mx-auto">
          Discover timeless essentials with a modern edge, crafted with elegance and precision.
        </p>
      </div>

      <div className="grid gap-4  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {featuredProducts.length > 0 ? (
          featuredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onLike={handleLike} // Pass parent handler
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
