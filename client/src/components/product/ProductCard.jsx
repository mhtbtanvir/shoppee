// src/components/product/ProductCard.jsx
import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const ProductCard = ({ product, onLike }) => {
  // Handle images whether they are objects or strings
  const firstImage =
    product.images && product.images.length > 0
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0].url
      : null;

  return (
    <div
      key={product._id}
      className="relative border border-gray-300 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col rounded-lg overflow-hidden"
    >
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded z-10">
          -{product.discount}%
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={() => onLike(product._id)}
        className={`absolute top-2 right-2 z-20 p-2 rounded-full shadow-lg transition-transform duration-300 hover:scale-110 ${
          product.liked ? "bg-red-200" : "bg-white/80"
        }`}
      >
        {product.liked ? (
          <AiFillHeart className="text-red-500 text-2xl" />
        ) : (
          <AiOutlineHeart className="text-gray-400 text-2xl" />
        )}
      </button>

      {/* Product Image */}
      <div className="relative w-full h-56 overflow-hidden bg-gray-100">
        {firstImage ? (
          <img
            src={firstImage}
            alt={product.name}
            className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {/* Stock Badge */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
            In Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="bg-white p-4 flex flex-col flex-1">
        {/* Name */}
        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          {product.name}
        </h2>

        {/* Brand */}
        {product.brand && (
          <p className="text-gray-600 text-sm mb-2">
            <strong>Brand:</strong> {product.brand}
          </p>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

        {/* Price + Rating (left) | Sizes + Colors (right) */}
        <div className="flex justify-between items-start mb-3">
          {/* Left Column */}
          <div className="flex flex-col gap-2">
            {/* Price */}
            <div className="flex items-center gap-2">
              {product.discountPrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-green-600">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-sm line-through text-red-500">
                    ${product.price.toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-800">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Rating */}
            {product.ratings && (
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 ${
                      i < Math.round(product.ratings.average || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    <polygon points="10 1 12.6 7.5 19.5 7.5 13.7 11.9 16.3 18.5 10 14.2 3.7 18.5 6.3 11.9 0.5 7.5 7.4 7.5" />
                  </svg>
                ))}
                <span className="text-gray-600 text-xs ml-1">
                  {product.ratings.average?.toFixed(1) || "0.0"} (
                  {product.ratings.count || 0})
                </span>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-2">
            {/* Sizes */}
            {product.size?.length > 0 && (
              <div className="flex justify-end flex-wrap gap-1">
                {product.size.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-200 rounded border border-gray-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Colors */}
            {product.color?.length > 0 && (
              <div className="flex justify-end flex-wrap gap-1">
                {product.color.map((c, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 text-xs bg-gray-100 rounded border border-gray-300"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <button className="w-full border border-gray-300 text-gray-800 bg-gray-100 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all duration-300">
            See Details
          </button>
          <button className="w-full border border-black text-gray-800 bg-white py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition-all duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
