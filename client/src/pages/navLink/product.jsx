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
    <div className="m-6 border-2 border-gray-500/70 shadow-lg p-6">
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
        <p className="text-center text-gray-700 font-semibold">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-600 font-bold">{error}</p>
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
