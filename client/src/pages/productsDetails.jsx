// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart, AiFillStar } from "react-icons/ai";
import ProductReviews from "./productReviews";
import SimilarProduct from "./similarProduct";
import AddToCartButton from "@/components/addToCartButton";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  
  const [selectedColor, setSelectedColor] = useState("");
 const [selectedSize, setSelectedSize] = useState("");
    


 useEffect(() => {
  if (product) {
    setSelectedColor(product.color?.[0] || "");
    setSelectedSize(product.size?.[0] || "");
  }
}, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/products/${id}`, {
          withCredentials: true,
        });

        const normalized = {
          ...res.data.product,
          images: (res.data.product.images || []).map((img) =>
            typeof img === "string"
              ? img.startsWith("/uploads/")
                ? `${import.meta.env.VITE_API_URL}${img}`
                : img
              : img.url
          ),
          discountPrice:
            res.data.product.discount > 0
              ? (res.data.product.price * (100 - res.data.product.discount)) / 100
              : res.data.product.price,
        };

        setProduct(normalized);
        setLiked(normalized.likedByCurrentUser || false);
        setLikeCount(normalized.like || 0);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);



 if (loading) {
  return (
    <div className="max-w-7xl mx-auto mt-8 px-4 md:px-6 lg:px-8 animate-pulse">
      {/* Back button placeholder */}
      <div className="w-20 h-6 bg-gray-300 rounded mb-6"></div>

      {/* Main Product Area */}
      <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl p-8">
        {/* Left: Image Placeholder */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-full h-96 bg-gray-300 rounded-2xl mb-2"></div>
          <div className="flex gap-3 overflow-x-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-24 h-24 bg-gray-300 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Right: Product Info Placeholder */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="w-32 h-4 bg-gray-300 rounded"></div> {/* Stock */}
          <div className="w-3/4 h-8 bg-gray-300 rounded"></div> {/* Name */}
          <div className="w-1/2 h-4 bg-gray-300 rounded"></div> {/* Brand */}
          <div className="flex gap-3 mt-2">
            <div className="w-24 h-6 bg-gray-300 rounded"></div> {/* Price */}
            <div className="w-16 h-6 bg-gray-300 rounded"></div> {/* Discount */}
          </div>
          <div className="w-full h-4 bg-gray-300 rounded mt-2"></div> {/* Ratings */}
          <div className="w-full h-20 bg-gray-300 rounded mt-2"></div> {/* Description */}
          <div className="flex gap-2 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-6 h-6 bg-gray-300 rounded-full"></div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-10 h-6 bg-gray-300 rounded"></div> 
            ))}
          </div>
          <div className="w-32 h-10 bg-gray-300 rounded mt-4"></div> {/* Add to Cart */}
        </div>
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-gray-500 text-sm">
        Loading product details… please wait a few seconds.{" "}
        <span className="text-gray-400 italic">
          (First-time load may take up to 30 seconds while the server starts)
        </span>
      </p>
    </div>
  );
}

if (error)
  return (
    <p className="text-center mt-10 text-red-600 text-lg font-semibold">
      ⚠️ {error}. Please try refreshing the page.
    </p>
  );

if (!product)
  return (
    <p className="text-center mt-10 text-gray-700 text-lg font-semibold">
      Product not found. Please check the URL or browse other products.
    </p>
  );

  const images = product.images || [];
  const firstImage = images[selectedImage] || null;


 return (
  <div className=" max-w-7xl mx-auto mt-8 px-0 md:px-6 lg:px-8">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="flex ml-2 items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
    >
      <IoArrowBackOutline className="w-6 h-6" />
    </button>

    {/* Main Product Area */}
    <div className="flex border border-gray-400 flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl p-8">
      {/* Left: Product Images */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="w-full h-96 rounded-2xl overflow-hidden bg-gray-50 border border-gray-800 shadow-inner flex items-center justify-center">
          {firstImage ? (
            <img
              src={firstImage}
              alt={product.name}
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <span className="text-gray-400 text-lg">No Image</span>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto py-2">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={product.name}
                onClick={() => setSelectedImage(idx)}
                className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                  selectedImage === idx
                    ? "border-blue-500 scale-105"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Details */}
      <div className="flex-1 md:-mt-6 flex flex-col  lg:p-8">
  {/* Stock Status */}
  <span
    className={`font-semibold text-sm uppercase tracking-wide ${
      product.stock > 0 ? "text-green-600" : "text-red-500"
    }`}
  >
    {product.stock > 0 ? "In Stock" : "Out of Stock"}
  </span>

  {/* Name & Brand */}
  <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
    {product.name}
  </h1>
  {product.brand && (
    <p className="text-gray-500 text-sm lg:text-base mt-1">{product.brand}</p>
  )}

  {/* Price */}
  <div className="flex items-baseline gap-3 mt-2">
    {product.discountPrice < product.price ? (
      <>
        <span className="text-3xl lg:text-4xl font-bold text-green-600">
          ${product.discountPrice.toFixed(2)}
        </span>
        <span className="line-through text-lg lg:text-xl text-red-400">
          ${product.price.toFixed(2)}
        </span>
      </>
    ) : (
      <span className="text-3xl lg:text-4xl font-semibold text-gray-900">
        ${product.price.toFixed(2)}
      </span>
    )}
  </div>

  {/* Ratings */}
  {product.ratings && (
    <div className="flex items-center gap-2 mt-1">
      {Array.from({ length: 5 }, (_, i) => (
        <AiFillStar
          key={i}
          className={`w-5 h-5 ${
            i < Math.round(product.ratings.average || 0)
              ? "text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-gray-600 text-sm ml-2">
        {product.ratings.average?.toFixed(1) || "0.0"} ({product.ratings.count || 0})
      </span>
    </div>
  )}

  {/* Description */}
  <p className="text-gray-700 text-sm lg:text-base leading-relaxed mt-4">
    {product.description}
  </p>

  {/* Colors */}
  {product.color?.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-4">
      {product.color.map((c, idx) => (
        <button
          key={idx}
          onClick={() => setSelectedColor(c)}
          className={`w-6 h-6 rounded-full border-2 transition-transform transform ${
            selectedColor === c ? "border-blue-500 scale-110" : "border-gray-300"
          }`}
          style={{ backgroundColor: c }}
          title={c}
        />
      ))}
    </div>
  )}

  {/* Sizes & Likes */}
  <div className="flex justify-between items-center mt-4">
    {product.size?.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {product.size.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSize(s)}
            className={`px-3 py-1 text-xs lg:text-sm rounded-md border transition ${
              selectedSize === s
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    )}
    <div className="flex items-center gap-1 text-red-500 text-lg font-semibold">
      <AiFillHeart />
      <span>{product.like || 0}</span>
    </div>
  </div>

  {/* Add to Cart */}
  <div className="mt-6">
    <AddToCartButton
      product={product}
      selectedColor={selectedColor}
      selectedSize={selectedSize}
    />
  </div>
</div>

    </div>

    {/* Reviews Section */}
    <ProductReviews product={product} setProduct={setProduct} />

    {/* Similar Products */}
    <SimilarProduct product={product} />
  </div>
);

  };
  

export default ProductDetails;
