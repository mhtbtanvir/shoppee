// src/components/Categories.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom"; // ✅ Import Link

const Categories = () => {
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products", {
          withCredentials: true,
        });

        const products = res.data.products || [];

        // Group products by category
        const grouped = products.reduce((acc, product) => {
          const cat = product.category || "Uncategorized";
          if (!acc[cat]) {
            acc[cat] = {
              name: cat,
              items: [],
              image: product.images?.[0] || null,
            };
          }
          acc[cat].items.push(product);
          return acc;
        }, {});

        setCategories(grouped);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to fetch categories from products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-700 font-semibold">Loading...</p>
    );

  if (error)
    return <p className="text-center mt-10 text-red-600 font-bold">{error}</p>;

  return (
    
    <div className="container  mx-auto  px-4 py-5 ">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 font-prata tracking-tight text-center">
    Browse Categories
  </h2>
  <p className="my-3 text-gray-600 text-lg max-w-xl mx-auto text-center">
    Discover our diverse collection of products, carefully curated to suit every taste and need.
  </p>
  

      <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.keys(categories).length > 0 ? (
          Object.values(categories).map((cat) => (
            <div
              key={cat.name}
              className="relative border border-gray-300 shadow hover:shadow-lg transition-shadow duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full h-56 overflow-hidden">
                {cat.image ? (
                  <img
                    src={
                      typeof cat.image === "string"
                        ? cat.image.startsWith("/uploads/")
                          ? `http://localhost:5000${cat.image}`
                          : cat.image
                        : cat.image.url
                    }
                    alt={cat.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                {/* Count Badge */}
                <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 text-xs font-bold rounded z-10">
                  {cat.items.length} items
                </div>
              </div>

              {/* Details */}
              <div className="bg-gray-50 p-4 flex flex-col flex-1">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                  {cat.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  Explore the best {cat.name.toLowerCase()}.
                </p>

                <div className="mt-auto flex justify-end">
                  {/* ✅ Link to filtered products page */}
                  <Link
                    to={`/products?category=${encodeURIComponent(cat.name)}`}
                    className="inline-flex items-center gap-1 px-3 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-800 transition"
                  >
                    Explore <AiOutlineArrowRight />
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No categories found
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;
