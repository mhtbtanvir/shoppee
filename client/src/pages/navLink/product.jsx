// src/pages/Product.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "@/components/product/ProductCard";
import Filter from "@/components/product/Filter";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";

const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const Product = () => {
  
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  // Fetch products
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

        setProducts(normalizedProducts);

        const initialFiltered = categoryFromQuery
          ? normalizedProducts.filter(
              (p) => p.category?.toLowerCase() === categoryFromQuery.toLowerCase()
            )
          : normalizedProducts;

        setFilteredProducts(initialFiltered);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFromQuery]);

  // Handle like/unlike
  const handleLike = async (productId) => {
    // Optimistic UI update
    setFilteredProducts((prev) =>
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

      // Preserve images from previous state
      setFilteredProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? {
                ...p,
                likedByCurrentUser: updatedServerProduct.likedByCurrentUser,
                like: updatedServerProduct.like || p.like,
                images: p.images, // important to keep images intact
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error liking product:", err);
      // Rollback optimistic update
      setFilteredProducts((prev) =>
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
    <div className="md:m-6   shadow-2xl p-6">
         <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
      >
        <IoArrowBackOutline className="w-6 h-6" />
        <span className="font-medium"> </span>
      </button>
      {/* Heading */}
      <div className="text-center  border-b-2 border-gray-100   pb-4">
        <h1 className="text-3x   font-prata flex justify-center items-center pb-8 -mt-14  text-gray-900 tracking-tight">
          {categoryFromQuery ? `${categoryFromQuery} Products` : "Our Products"}
        </h1>
      
      </div>

      {/* Filter Component */}
      <Filter
        products={
          categoryFromQuery
            ? products.filter(
                (p) => p.category?.toLowerCase() === categoryFromQuery.toLowerCase()
              )
            : products
        }
        initialCategory={categoryFromQuery || "All"}
        onFilterChange={setFilteredProducts}
      />

      {/* Products Grid */}
     {loading ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse max-w-7xl mx-auto mt-10 px-4 md:px-6 lg:px-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="border border-gray-200 rounded-lg p-4 shadow-sm">
        {/* Image placeholder */}
        <div className="bg-gray-300 h-40 rounded-md mb-4"></div>

        {/* Title placeholder */}
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>

        {/* Price placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>

        {/* Like/Action placeholder */}
        <div className="h-4 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>
    ))}

    <p className="col-span-full text-center text-gray-500 mt-4 text-sm">
      Loading featured products… please wait a few seconds.{" "}
      <span className="text-gray-400 italic">
        (First-time load may take up to 30 seconds while the server starts)
      </span>
    </p>
  </div>
) : error ? (
  <p className="text-center mt-10 text-red-600 text-lg font-semibold">
    ⚠️ {error}. Please try refreshing the page.
  </p>
) : filteredProducts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onLike={handleLike}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No products found</p>
      )}
    </div>
  );
};

export default Product;
