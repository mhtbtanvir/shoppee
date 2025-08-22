// src/pages/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiFillHeart, AiOutlineHeart, AiFillStar } from "react-icons/ai";
import ProductReviews from "../productReviews";
import SimilarProduct from "../similarProduct";
const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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

  return (
    <div className="container 
     border-gray-200 rounded-md mx-auto mt-4
      py-8  ">
      <div className="flex border pr-4 border-gray-200 rounded-md py-8 flex-col lg:flex-row gap-8">
        {/* Left: Images */}
        <div className="flex-1 px-6 flex flex-col gap-4">
          <div className="w-full border border-gray-400 h-96 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
            {firstImage ? (
              <img
                src={firstImage}
                alt={product.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2  overflow-x-auto">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={product.name}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border ${
                    selectedImage === idx ? "border-blue-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: Details */}
         <div className="flex-1 md:pl-4 pl-8 shadow-sm  pb-2 pt-0  flex flex-col gap-4 bg-white">
      
          
           {product.stock > 0 ? (
            <span className="text-green-600 font-medium">In Stock</span>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
          {/* Name & Brand */}
          <h2 className="text-5xl  font-roboto font-bold text-gray-800/80">
            {product.name}

          </h2>
          {product.brand && (
            <p className="text-gray-500
            mb-2 text-sm">{product.brand}</p>
          )}

                    <div className="flex items-center gap-3  font-semibold">
            {product.discountPrice < product.price ? (
              <>
                <span className="text-green-600 text-5xl">${product.discountPrice.toFixed(2)}</span>
                <span className="line-through mt-2 text-xl text-red-500">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-gray-800">${product.price.toFixed(2)}</span>
            )}
          </div>
             {/* Stock */}
         
         
          {/* Colors */}
        

          {/* Rating */}
          {product.ratings && (
            <div className=" flex   items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <AiFillStar
                  key={i}
                  className={`w-4 h-4  ${
                    i < Math.round(product.ratings.average || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-gray-600 text-sm ml-2">
                {product.ratings.average?.toFixed(1) || "0.0"} (
                {product.ratings.count || 0})
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-gray-700 text-sm">{product.description}</p>
          
          {/* Price */}

     {product.color?.length > 0 && (
            <div className="flex items-center gap-2">
              {product.color.map((c, idx) => (
                <span
                  key={idx}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
          {/* Sizes */}
          <div className="flex items-center justify-between">
          {product.size?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.size.map((s, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-sm"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
           <div className="flex items-center gap-1 text-red-500 text-lg font-medium mb-2">
            <AiFillHeart />
            <span>{product.like || 0}</span>
          </div>
          </div>

       

       

          {/* Add to Cart */}
          <button className="mt-auto  bg-black/90  text-white py-4 rounded-lg text-xl font-semibold hover:bg-gray-900 transition-all">
            Add to Cart
          </button>
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
