// src/components/Categories.jsx
import React from "react";
import { motion } from "framer-motion";
import { Tag } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Outerwear",
    count: 124,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Footwear",
    count: 86,
    image:
      "https://images.unsplash.com/photo-1528701800484-5f1d7d9a9f3c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Accessories",
    count: 210,
    image:
      "https://images.unsplash.com/photo-1519741492590-94d1f3b0b6b3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 4,
    name: "Watches",
    count: 42,
    image:
      "https://images.unsplash.com/photo-1518544881287-7c9d1f0f0b8f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Bags",
    count: 64,
    image:
      "https://images.unsplash.com/photo-1520975912270-6b6c7f8c6f6a?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 6,
    name: "Essentials",
    count: 180,
    image:
      "https://images.unsplash.com/photo-1495121605193-b116b5b09be0?auto=format&fit=crop&w=1000&q=80",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] },
  },
  hover: {
    scale: 1.04,
    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
    transition: { duration: 0.3 },
  },
};

const Categories = () => {
  return (
    <section
      aria-labelledby="categories-heading"
      className="relative w-full min-h-[70vh] px-6 md:px-12 py-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* floating gradient blobs */}
      <div className="absolute -left-16 -top-12 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -right-12 bottom-16 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl -z-10" />

      {/* header */}
      <motion.header
        className="text-center mb-16"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <div className="inline-flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-sm tracking-wide shadow-lg">
          <Tag className="w-4 h-4 text-yellow-300" />
          Categories
        </div>

        <h2
          id="categories-heading"
          className="mt-6 text-4xl md:text-5xl font-extrabold text-gray-900 font-prata tracking-tight"
        >
          Browse by Category
        </h2>

        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Explore collections handpicked for <span className="font-semibold">style</span> and{" "}
          <span className="font-semibold">quality</span>.  
        </p>
      </motion.header>

      {/* grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        {categories.map((cat) => (
          <motion.article
            key={cat.id}
            className="relative rounded-3xl overflow-hidden border border-white/30 bg-white/30 backdrop-blur-lg shadow-lg transition-all"
            variants={cardVariants}
            whileHover="hover"
            role="group"
          >
            {/* image */}
            <div className="relative w-full h-60 overflow-hidden">
              <motion.img
                src={cat.image}
                alt={`${cat.name} collection`}
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
              />
              {/* gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent mix-blend-multiply" />
              {/* count pill */}
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30 shadow">
                {cat.count} items
              </div>
            </div>

            {/* content */}
            <div className="p-6 text-center">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-black transition-colors">
                {cat.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Elevate your wardrobe with curated {cat.name.toLowerCase()}.
              </p>

              <div className="mt-5 flex items-center justify-center gap-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-black text-white text-sm font-medium shadow-md hover:opacity-90 transition"
                >
                  Explore
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-gray-700 transition"
                >
                  View all
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Categories;
