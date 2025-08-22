import React from "react";
import { AiOutlineHeart, AiFillHeart, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, onLike }) => {
  const liked = product.likedByCurrentUser || false;
  const likeCount = product.like || 0;
 const navigate = useNavigate();
  const firstImage =
    product.images?.[0]
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0].url
      : null;

  return (
    <div className="relative border-2 border-gray-400/50 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col rounded-lg overflow-hidden bg-white">
      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded z-10">
          -{product.discount}%
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={() => onLike && onLike(product._id)}
        className={`absolute top-3 right-3 z-20 flex items-center gap-1 px-3 py-1 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg ${
          liked ? "bg-red-100" : "bg-white/90"
        }`}
      >
        {liked ? (
          <AiFillHeart className="text-red-500 text-xl" />
        ) : (
          <AiOutlineHeart className="text-gray-500 text-xl" />
        )}
        <span
          className={`text-sm font-medium ${
            liked ? "text-red-600" : "text-gray-700"
          }`}
        >
          {likeCount}
        </span>
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
        {product.stock > 0 ? (
          <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
            In Stock
          </div>
        ) : (
          <div className="absolute bottom-2 left-2 bg-gray-400 text-white px-2 py-1 text-xs font-bold rounded">
            Out of Stock
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1">
        <div className="">
        <h2 className="text-lg  font-semibold text-gray-800  line-clamp-2">
          {product.name}
        </h2>
        {product.brand && (
          <p className="text-gray-500 text-sm mb-4">
             {product.brand}
          </p>
          
        )}</div>
          {product.color?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.color.map((c, idx) => (
              <span
                key={idx}
                className="w-5 h-5 rounded-full border border-gray-300"
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>
        )}



        

        {/* Rating */}
        {product.ratings && (
          <div className="flex items-center gap-1 mb-2">
            {Array.from({ length: 5 }, (_, i) => (
              <AiFillStar
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.ratings.average || 0)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-gray-600 text-xs ml-1">
              {product.ratings.average?.toFixed(1) || "0.0"} (
              {product.ratings.count || 0})
            </span>
          </div>
        )}

{product.review && product.review.length > 0 && (
  <div className="flex items-center gap-1 mb-3">
    <AiFillStar className="text-yellow-400" />

    {/* Calculate average rating */}
    <span className="text-gray-700 text-sm font-medium">
      {(
        product.review.reduce((sum, r) => sum + (r.rating || 0), 0) /
        product.review.length
      ).toFixed(1)}
    </span>

    <span className="text-gray-400 text-xs">
      ({product.review.length} reviews)
    </span>
  </div>
)}

         <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {product.description}
        </p>

       

        <div className="flex items-center gap-2 mb-4">
          {product.discountPrice > 0 ? (
            <>
              <span className="text-xl font-bold text-green-600">
                ${product.discountPrice.toFixed(2)}
              </span>
              <span className="text-xs line-through text-red-500">
                ${product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-800">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
                {/* Sizes */}
        {product.size?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
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

      
      
        <div className="flex  flex-col gap-2 mt-auto">
               <button
        onClick={() => navigate(`/productsDetails/${product._id}`)}
        className="w-full border border-gray-300 text-gray-800 bg-gray-100 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all duration-300"
      >
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
