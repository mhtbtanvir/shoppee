import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use full backend URL for development
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        console.log("Products fetched from API:", res.data);

        const normalizedProducts = (res.data.products || []).map((product) => {
          const images =
            Array.isArray(product.images) && product.images.length > 0
              ? product.images.map((img) =>
                  typeof img === "string" ? { url: img, alt: product.name } : img
                )
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
    return <div className="text-center mt-10 text-gray-700">Loading...</div>;

  if (error)
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">{error}</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.length > 0 ? (
          products.map((product) => {
            const firstImage = product.images[0];

            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Product Image */}
                {firstImage?.url ? (
                  <img
                    src={firstImage.url}
                    alt={firstImage.alt || product.name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Product Details */}
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2">{product.name}</h2>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    {product.discountPrice > 0 ? (
                      <>
                        <span className="text-lg font-bold text-green-600">
                          ${product.discountPrice}
                        </span>
                        <span className="text-sm line-through text-gray-500">
                          ${product.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">
                        ${product.price}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3 text-sm text-gray-700">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">
                      {product.ratings.average.toFixed(1)} (
                      {product.ratings.count} reviews)
                    </span>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
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
