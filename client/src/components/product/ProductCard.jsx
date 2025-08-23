import React from "react";
import { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiFillStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "../addToCartButton";

const ProductCard = ({ product, onLike }) => {
  const liked = product.likedByCurrentUser || false;
  const likeCount = product.like || 0;
 const navigate = useNavigate();
 const [selectedColor, setSelectedColor] = useState(product.color?.[0] || "");
const [selectedSize, setSelectedSize] = useState(product.size?.[0] || "");

  const firstImage =
    product.images?.[0]
      ? typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0].url
      : null;

//   return (
//     <div className="relative border-2 border-gray-400/50 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col rounded-lg overflow-hidden bg-white">
//       {/* Discount Badge */}
//       {product.discount > 0 && (
//         <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded z-10">
//           -{product.discount}%
//         </div>
//       )}

//       {/* Like Button */}
//       <button
//         onClick={() => onLike && onLike(product._id)}
//         className={`absolute top-3 right-3 z-20 flex items-center gap-1 px-3 py-1 rounded-full shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg ${
//           liked ? "bg-red-100" : "bg-white/90"
//         }`}
//       >
//         {liked ? (
//           <AiFillHeart className="text-red-500 text-xl" />
//         ) : (
//           <AiOutlineHeart className="text-gray-500 text-xl" />
//         )}
//         <span
//           className={`text-sm font-medium ${
//             liked ? "text-red-600" : "text-gray-700"
//           }`}
//         >
//           {likeCount}
//         </span>
//       </button>

//       {/* Product Image */}
//       <div className="relative w-full h-56 overflow-hidden bg-gray-100">
//         {firstImage ? (
//           <img
//             src={firstImage}
//             alt={product.name}
//             className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             No Image
//           </div>
//         )}

//         {/* Stock Badge */}
//         {product.stock > 0 ? (
//           <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
//             In Stock
//           </div>
//         ) : (
//           <div className="absolute bottom-2 left-2 bg-gray-400 text-white px-2 py-1 text-xs font-bold rounded">
//             Out of Stock
//           </div>
//         )}
//       </div>

//       {/* Product Details */}
//       <div className="p-4 flex flex-col flex-1">
//         <div className="">
//         <h2 className="text-lg  font-semibold text-gray-800  line-clamp-2">
//           {product.name}
//         </h2>
//         {product.brand && (
//           <p className="text-gray-500 text-sm mb-4">
//              {product.brand}
//           </p>
          
//         )}</div>
//           {product.color?.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-3">
//             {product.color.map((c, idx) => (
//               <span
//                 key={idx}
//                 className="w-5 h-5 rounded-full border border-gray-300"
//                 style={{ backgroundColor: c }}
//                 title={c}
//               />
//             ))}
//           </div>
//         )}



        

//         {/* Rating */}
//         {product.ratings && (
//           <div className="flex items-center gap-1 mb-2">
//             {Array.from({ length: 5 }, (_, i) => (
//               <AiFillStar
//                 key={i}
//                 className={`w-4 h-4 ${
//                   i < Math.round(product.ratings.average || 0)
//                     ? "text-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//             <span className="text-gray-600 text-xs ml-1">
//               {product.ratings.average?.toFixed(1) || "0.0"} (
//               {product.ratings.count || 0})
//             </span>
//           </div>
//         )}

// {product.review && product.review.length > 0 && (
//   <div className="flex items-center gap-1 mb-3">
//     <AiFillStar className="text-yellow-400" />

//     {/* Calculate average rating */}
//     <span className="text-gray-700 text-sm font-medium">
//       {(
//         product.review.reduce((sum, r) => sum + (r.rating || 0), 0) /
//         product.review.length
//       ).toFixed(1)}
//     </span>

//     <span className="text-gray-400 text-xs">
//       ({product.review.length} reviews)
//     </span>
//   </div>
// )}

//          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
//           {product.description}
//         </p>

       

//         <div className="flex items-center gap-2 mb-4">
//           {product.discountPrice > 0 ? (
//             <>
//               <span className="text-xl font-bold text-green-600">
//                 ${product.discountPrice.toFixed(2)}
//               </span>
//               <span className="text-xs line-through text-red-500">
//                 ${product.price.toFixed(2)}
//               </span>
//             </>
//           ) : (
//             <span className="text-lg font-semibold text-gray-800">
//               ${product.price.toFixed(2)}
//             </span>
//           )}
//         </div>
//                 {/* Sizes */}
//         {product.size?.length > 0 && (
//           <div className="flex flex-wrap gap-1 mb-2">
//             {product.size.map((s, idx) => (
//               <span
//                 key={idx}
//                 className="px-2 py-1 text-xs bg-gray-200 rounded border border-gray-300"
//               >
//                 {s}
//               </span>
//             ))}
//           </div>
//         )}

      
      
//         <div className="flex  flex-col gap-2 mt-auto">
//                <button
//         onClick={() => navigate(`/productsDetails/${product._id}`)}
//         className="w-full border border-gray-300 text-gray-800 bg-gray-100 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all duration-300"
//       >
//         See Details
//       </button>

//           <AddToCartButton className="" product={product} />
//         </div>
//       </div>
//     </div>
//   );

return (
  <div className="group relative bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden">
    {/* Discount Badge */}
    {product.discount > 0 && (
      <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-400 text-white px-2 py-1 text-xs font-semibold rounded-full shadow-md z-10">
        -{product.discount}%
      </div>
    )}

    {/* Like Button */}
    <button
      onClick={() => onLike && onLike(product._id)}
      className={`absolute top-3 right-3 z-20 flex items-center gap-1 px-2.5 py-1.5 rounded-full shadow-md transition-all duration-300 hover:scale-110 ${
        liked ? "bg-red-100" : "bg-white/90"
      }`}
    >
      {liked ? (
        <AiFillHeart className="text-red-500 text-lg" />
      ) : (
        <AiOutlineHeart className="text-gray-500 text-lg" />
      )}
      <span
        className={`text-xs font-medium ${
          liked ? "text-red-600" : "text-gray-700"
        }`}
      >
        {likeCount}
      </span>
    </button>

    {/* Product Image */}
    <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
      {firstImage ? (
        <img
          src={firstImage}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 ease-out"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      {/* Stock Badge */}
      <div
        className={`absolute bottom-3 left-3 px-2 py-0.5 text-xs font-medium rounded-full shadow-md ${
          product.stock > 0 ? "bg-green-500 text-white" : "bg-gray-400 text-white"
        }`}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </div>
    </div>

    {/* Product Details */}
    <div className="p-4 flex flex-col flex-1">
      <h2 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors line-clamp-2">
        {product.name}
      </h2>
      {product.brand && (
        <p className="text-gray-500 text-sm mb-2">{product.brand}</p>
      )}

      {/* Colors as radio buttons */}
      {product.color?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {product.color.map((c, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedColor(c)}
              className={`w-6 h-6 rounded-full border-2 transition ${
                selectedColor === c ? "border-blue-500 scale-115" : "border-white"
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
      )}

      {/* Sizes as pill buttons */}
      {product.size?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {product.size.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedSize(s)}
              className={`px-2 py-0.5 text-xs rounded-md border transition ${
                selectedSize === s
                  ? "bg-blue-500 text-white border-white"
                  : "bg-gray-100 text-gray-700 border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Rating */}
      {product.ratings && (
        <div className="flex items-center gap-1 mb-3">
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
          <span className="text-gray-500 text-xs ml-1">
            {product.ratings.average?.toFixed(1) || "0.0"} (
            {product.ratings.count || 0})
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {product.description}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mb-4">
        {product.discountPrice > 0 ? (
          <>
            <span className="text-xl font-bold text-green-600">
              ${product.discountPrice.toFixed(2)}
            </span>
            <span className="text-sm line-through text-red-400">
              ${product.price.toFixed(2)}
            </span>
          </>
        ) : (
          <span className="text-lg font-semibold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-auto">
        <button
          onClick={() => navigate(`/productsDetails/${product._id}`)}
          className="w-full border border-gray-300 text-gray-800 bg-gray-100 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
        >
          See Details
        </button>

        <AddToCartButton
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
      </div>
    </div>
  </div>
);

};

export default ProductCard;
