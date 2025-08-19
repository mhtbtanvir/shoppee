import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    price: "$249",
    discount: "$199",
    image:
      "https://images.unsplash.com/photo-1520975698519-59c6b2d86d3d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Vintage Sneakers",
    price: "$179",
    discount: "$149",
    image:
      "https://images.unsplash.com/photo-1606813902779-0b41e04853a6?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Minimalist Watch",
    price: "$229",
    discount: "$199",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    name: "Designer Handbag",
    price: "$349",
    discount: "$299",
    image:
      "https://images.unsplash.com/photo-1590874103328-9a0a4b2410da?auto=format&fit=crop&w=800&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.8, 0.25, 1], // smooth cubic easing
    },
  },
};

const innerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const FeaturedProducts = () => {
  return (
    <section className="relative min-h-[80vh] w-full px-6 md:px-12 py-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Decorative blur background */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl -z-10"></div>

      {/* Heading */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm tracking-wide shadow-lg">
          <Star className="w-4 h-4 text-yellow-400" />
          Featured Products
        </div>
        <h2 className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight">
          Curated Just for You
        </h2>
        <p className="mt-4 text-gray-600 text-lg max-w-xl mx-auto">
          Discover timeless essentials with a modern edge, crafted with elegance
          and precision.
        </p>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="group relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/40 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            variants={cardVariants}
          >
            {/* Product Image */}
            <motion.div
              className="relative w-full h-72 overflow-hidden"
              variants={innerVariants}
            >
              <motion.img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              />
              <span className="absolute top-3 left-3 bg-red-600/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full shadow-md font-semibold">
                -20%
              </span>
            </motion.div>

            {/* Card Content */}
            <motion.div
              className="p-6 text-center"
              variants={innerVariants}
            >
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-black transition-colors duration-300">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mt-2 flex justify-center items-center gap-2">
                <span className="text-gray-400 line-through text-sm">
                  {product.price}
                </span>
                <span className="text-lg font-bold text-green-600">
                  {product.discount}
                </span>
              </div>

              {/* CTA Button */}
              <motion.button
                className="mt-5 px-6 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition transform hover:scale-105 shadow-md"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedProducts;
