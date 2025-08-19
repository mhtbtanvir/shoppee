// src/components/Deals.jsx
import React from "react";
import { motion } from "framer-motion";

const deals = [
  {
    id: 1,
    name: "Leather Jacket",
    image:
      "https://images.unsplash.com/photo-1580716480048-6b14b1659e08?auto=format&fit=crop&w=1000&q=80",
    originalPrice: 299,
    discountedPrice: 199,
  },
  {
    id: 2,
    name: "Running Sneakers",
    image:
      "https://images.unsplash.com/photo-1600180758893-7c18b121e7b1?auto=format&fit=crop&w=1000&q=80",
    originalPrice: 150,
    discountedPrice: 99,
  },
  {
    id: 3,
    name: "Classic Watch",
    image:
      "https://images.unsplash.com/photo-1600180758893-7c18b121e7b1?auto=format&fit=crop&w=1000&q=80",
    originalPrice: 249,
    discountedPrice: 179,
  },
  {
    id: 4,
    name: "Designer Bag",
    image:
      "https://images.unsplash.com/photo-1520975912270-6b6c7f8c6f6a?auto=format&fit=crop&w=1000&q=80",
    originalPrice: 199,
    discountedPrice: 149,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { staggerChildren: 0.15, delayChildren: 0.1 } 
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.6, ease: [0.25, 0.8, 0.25, 1] } 
  },
  hover: { scale: 1.03, transition: { duration: 0.25 } },
};

const Deals = () => {
  return (
    <section
      aria-labelledby="deals-heading"
      className="relative w-full px-6 md:px-12 py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Decorative shapes */}
      <div className="absolute -left-10 -top-10 w-56 h-56 bg-red-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -right-10 bottom-10 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl -z-10" />

      {/* Heading */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <h2
          id="deals-heading"
          className="text-3xl md:text-4xl font-extrabold text-gray-900 font-prata tracking-tight"
        >
          Deals of the Week
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Grab our limited-time offers — top products at irresistible prices.
        </p>
      </motion.header>

      {/* Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {deals.map((deal) => (
          <motion.article
            key={deal.id}
            className="relative rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition"
            variants={cardVariants}
            whileHover="hover"
            role="group"
            aria-labelledby={`deal-${deal.id}-title`}
          >
            {/* Image */}
            <div className="relative w-full h-52 overflow-hidden">
              <motion.img
                src={deal.image}
                alt={deal.name}
                className="w-full h-full object-cover transform transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
              {/* Discount badge */}
              <div className="absolute top-3 left-3 bg-red-500/70 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                {Math.round(
                  ((deal.originalPrice - deal.discountedPrice) /
                    deal.originalPrice) *
                    100
                )}
                % OFF
              </div>
            </div>

            {/* Content */}
            <div className="p-5 text-center">
              <h3
                id={`deal-${deal.id}-title`}
                className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-black transition-colors duration-300"
              >
                {deal.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 line-through">
                ${deal.originalPrice.toFixed(2)}
              </p>
              <p className="mt-1 text-lg font-bold text-black">
                ${deal.discountedPrice.toFixed(2)}
              </p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:opacity-95 transition"
                  aria-label={`Buy ${deal.name} now`}
                >
                  Shop Now
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Deals;
