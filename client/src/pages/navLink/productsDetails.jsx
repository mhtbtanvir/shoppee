// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart, AiFillStar } from "react-icons/ai";
import ProductReviews from "../productReviews";
import SimilarProduct from "../similarProduct";
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
        const res = await axios.get(`http://localhost:5000/api/products/${id}`, {
          withCredentials: true,
        });

        const normalized = {
          ...res.data.product,
          images: (res.data.product.images || []).map((img) =>
            typeof img === "string"
              ? img.startsWith("/uploads/")
                ? `http://localhost:5000${img}`
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

  const handleLike = async () => {
    try {
      // Optional: Call API to toggle like
      await axios.post(
        `http://localhost:5000/api/products/${id}/like`,
        {},
        { withCredentials: true }
      );

      // Update UI optimistically
      setLiked(!liked);
      setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Failed to update like", err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  const images = product.images || [];
  const firstImage = images[selectedImage] || null;


  return(
    <div className="max-w-7xl mx-auto mt-8 px-4 sm:px-6 lg:px-8">
       <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6"
            >
              <IoArrowBackOutline className="w-6 h-6" />
              <span className="font-medium">Back </span>
            </button>
  <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl shadow-xl p-8">
    
    {/* Left: Product Images */}
    <div className="flex-1  flex flex-col gap-4">
      <div className="w-full  h-96 rounded-2xl overflow-hidden bg-gray-50 shadow-inner flex items-center justify-center">
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
        <div className="flex gap-3 pl-2 overflow-x-auto py-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={product.name}
              onClick={() => setSelectedImage(idx)}
              className={`w-24 h-24 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                selectedImage === idx ? "border-blue-500 scale-105" : "border-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>

    {/* Right: Product Details */}
    <div className="flex-1 flex flex-col gap-6 p-4 lg:p-6">
      {/* Stock Status */}
      <span
        className={`font-semibold ${
          product.stock > 0 ? "text-green-600" : "text-red-500"
        }`}
      >
        {product.stock > 0 ? "In Stock" : "Out of Stock"}
      </span>

      {/* Name & Brand */}
      <h1 className="text-5xl font-bold text-gray-800">{product.name}</h1>
      {product.brand && <p className="text-gray-500 text-sm">{product.brand}</p>}

      {/* Price */}
      <div className="flex items-baseline gap-4">
        {product.discountPrice < product.price ? (
          <>
            <span className="text-4xl font-bold text-green-600">${product.discountPrice.toFixed(2)}</span>
            <span className="line-through text-xl text-red-500">${product.price.toFixed(2)}</span>
          </>
        ) : (
          <span className="text-3xl font-semibold text-gray-800">${product.price.toFixed(2)}</span>
        )}
      </div>

      {/* Ratings */}
      {product.ratings && (
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }, (_, i) => (
            <AiFillStar
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(product.ratings.average || 0) ? "text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-600 text-sm ml-2">
            {product.ratings.average?.toFixed(1) || "0.0"} ({product.ratings.count || 0})
          </span>
        </div>
      )}

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* Colors */}
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
      {/* Sizes & Likes */}
      <div className="flex justify-between items-center">
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
        <div className="flex items-center gap-1 text-red-500 text-lg font-semibold">
          <AiFillHeart />
          <span>{product.like || 0}</span>
        </div>
      </div>

      {/* Add to Cart */}
      

        <AddToCartButton
          product={product}
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />


    </div>
  </div>

  {/* Reviews Section */}
  <ProductReviews product={product} setProduct={setProduct} />

  {/* Similar Products */}
  <SimilarProduct product={product} />
</div>
  )
  };
  
//   return (
//     <div className="container 
//      border-gray-200 rounded-md mx-auto mt-4
//       py-8  ">
//       <div className="flex border pr-4 border-gray-200 rounded-md py-8 flex-col lg:flex-row gap-8">
//         {/* Left: Images */}
//         <div className="flex-1 px-6 flex flex-col gap-4">
//           <div className="w-full border border-gray-400 h-96 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
//             {firstImage ? (
//               <img
//                 src={firstImage}
//                 alt={product.name}
//                 className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
//               />
//             ) : (
//               <span className="text-gray-400">No Image</span>
//             )}
//           </div>

//           {images.length > 1 && (
//             <div className="flex gap-2  overflow-x-auto">
//               {images.map((img, idx) => (
//                 <img
//                   key={idx}
//                   src={img}
//                   alt={product.name}
//                   onClick={() => setSelectedImage(idx)}
//                   className={`w-20 h-20 object-cover rounded cursor-pointer border ${
//                     selectedImage === idx ? "border-blue-500" : "border-gray-300"
//                   }`}
//                 />
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Right: Details */}
//          <div className="flex-1 md:pl-4 pl-8 shadow-sm  pb-2 pt-0  flex flex-col gap-4 bg-white">
      
          
//            {product.stock > 0 ? (
//             <span className="text-green-600 font-medium">In Stock</span>
//           ) : (
//             <span className="text-red-500 font-medium">Out of Stock</span>
//           )}
//           {/* Name & Brand */}
//           <h2 className="text-5xl  font-roboto font-bold text-gray-800/80">
//             {product.name}

//           </h2>
//           {product.brand && (
//             <p className="text-gray-500
//             mb-2 text-sm">{product.brand}</p>
//           )}

//                     <div className="flex items-center gap-3  font-semibold">
//             {product.discountPrice < product.price ? (
//               <>
//                 <span className="text-green-600 text-5xl">${product.discountPrice.toFixed(2)}</span>
//                 <span className="line-through mt-2 text-xl text-red-500">${product.price.toFixed(2)}</span>
//               </>
//             ) : (
//               <span className="text-gray-800">${product.price.toFixed(2)}</span>
//             )}
//           </div>
//              {/* Stock */}
         
         
//           {/* Colors */}
        

//           {/* Rating */}
//           {product.ratings && (
//             <div className=" flex   items-center gap-1">
//               {Array.from({ length: 5 }, (_, i) => (
//                 <AiFillStar
//                   key={i}
//                   className={`w-4 h-4  ${
//                     i < Math.round(product.ratings.average || 0)
//                       ? "text-yellow-400"
//                       : "text-gray-300"
//                   }`}
//                 />
//               ))}
//               <span className="text-gray-600 text-sm ml-2">
//                 {product.ratings.average?.toFixed(1) || "0.0"} (
//                 {product.ratings.count || 0})
//               </span>
//             </div>
//           )}

//           {/* Description */}
//           <p className="text-gray-700 text-sm">{product.description}</p>
          
//           {/* Price */}

//      {product.color?.length > 0 && (
//             <div className="flex items-center gap-2">
//               {product.color.map((c, idx) => (
//                 <span
//                   key={idx}
//                   className="w-6 h-6 rounded-full border border-gray-300"
//                   style={{ backgroundColor: c }}
//                   title={c}
//                 />
//               ))}
//             </div>
//           )}
//           {/* Sizes */}
//           <div className="flex items-center justify-between">
//           {product.size?.length > 0 && (
//             <div className="flex flex-wrap gap-2">
//               {product.size.map((s, idx) => (
//                 <span
//                   key={idx}
//                   className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
//                 >
//                   {s}
//                 </span>
//               ))}
//             </div>
//           )}
//            <div className="flex items-center gap-1 text-red-500 text-lg font-medium mb-2">
//             <AiFillHeart />
//             <span>{product.like || 0}</span>
//           </div>
//           </div>

       

       

//           {/* Add to Cart */}
//           <button className="mt-auto  bg-black/90  text-white py-4 rounded-lg text-xl font-semibold hover:bg-gray-900 transition-all">
//             Add to Cart
//           </button>
//         </div>
//       </div>

//       {/* Reviews Section */}
//       <ProductReviews product={product} setProduct={setProduct} />

//       {/* Similar Products */}
//       <SimilarProduct product={product} />
//     </div>
//   );
// };

export default ProductDetails;
