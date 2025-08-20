import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        const normalizedProducts = (res.data.products || []).map((product) => {
          const images =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img) => ({
                  url: img.startsWith("/uploads/")
                    ? `http://localhost:5000${img}`
                    : img,
                  alt: product.name,
                }))
              : [];

          return {
            ...product,
            images,
            discountPrice: product.discountPrice || 0,
            ratings: product.ratings || { average: 0, count: 0 },
          };
        });

        setProducts(normalizedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch products from server");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
    <div className="m-6">
      <h1 className="text-4xl font-bold mb-10 text-center text-gray-800">
        Our Products
      </h1>
      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => {
            const firstImage = product.images[0];

            return (
              <div
                key={product._id}
                className="border border-gray-300 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="w-full h-56 overflow-hidden">
                {firstImage?.url ? (
                <div className="w-full h-56 overflow-hidden">
  <img
    src={firstImage.url}
    alt={firstImage.alt || product.name}
    className="w-full h-full object-cover transform hover:scale-125 transition-transform duration-300"
  />
</div>
                ) : (
                  <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
</div>
                {/* Details */}
                <div className="bg-gray-500/60 p-2 flex flex-col flex-1">
                  {/* Name */}
                  <h2 className="text-5xl font-semibold font-prata text-gray-800 mb-2">
                    {product.name}
                  </h2>

                  {/* Description */}
                  <p className="text-white text-sm mb-3 line-clamp-3">
                    {product.description}
                  </p>

                  {/* Price */}
                  {/* Price */}
{/* Price Section */}
<div className="flex items-center gap-2 mb-3">
  {product.discountPrice > 0 ? (
    <>
      <span className="text-base font-semibold text-green-600">
        ${product.discountPrice}
      </span>
      <span className="text-sm line-through text-gray-400">
        ${product.price}
      </span>
      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full shadow-sm uppercase">
        Sale
      </span>
    </>
  ) : (
    <span className="text-base font-semibold text-gray-800">
      ${product.price}
    </span>
  )}
</div>

{/* Rating */}
<div className="flex items-center gap-2 mb-2">
  <div className="flex gap-1">
    {Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`inline-block w-4 h-4 ${
          i < Math.round(product.ratings.average)
            ? "text-yellow-400"
            : "text-gray-300"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-full h-full"
        >
          <polygon points="10 1 12.6 7.5 19.5 7.5 13.7 11.9 16.3 18.5 10 14.2 3.7 18.5 6.3 11.9 0.5 7.5 7.4 7.5" />
        </svg>
      </span>
    ))}
  </div>
  <span className="text-gray-600 text-sm font-medium">
    {product.ratings.average.toFixed(1)} ({product.ratings.count})
  </span>
</div>

{/* Button */}
<div className="flex flex-col gap-2 mt-auto">
  <button className="w-full border border-white text-gray-800 bg-gray py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition-all duration-300">
    See Details
  </button>
  <button className="w-full border border-black text-gray-800 bg-white py-2 rounded-lg font-semibold shadow hover:bg-gray-100 transition-all duration-300">
    Add to Cart
  </button>
</div>



                </div>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default Product;
