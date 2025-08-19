// src/components/Newsletter.jsx
import React from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

const newsletterVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.8, 0.25, 1] } },
};

const Newsletter = () => {
  return (
    <section
      className="relative w-full min-h-[50vh] px-6 md:px-12 py-20 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
      aria-labelledby="newsletter-heading"
    >
      {/* Decorative blurred shapes */}
      <div className="absolute -left-20 -top-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -right-16 bottom-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl -z-10" />

      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={newsletterVariants}
      >
        <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm tracking-wide shadow-lg">
          <Mail className="w-4 h-4 text-yellow-300" />
          Newsletter
        </div>

        <h2
          id="newsletter-heading"
          className="mt-6 text-3xl md:text-4xl font-extrabold text-gray-900 font-prata tracking-tight"
        >
          Stay in the Loop
        </h2>

        <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
          Subscribe to receive the latest trends, offers, and exclusive updates from our collections.
        </p>
      </motion.header>

      {/* Form */}
      <motion.div
        className="max-w-xl mx-auto mt-8 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={newsletterVariants}
      >
        <form className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-gray-900 placeholder-gray-500 font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition-all"
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:scale-105 hover:opacity-95 transition-transform"
          >
            Subscribe
          </button>
        </form>

        <p className="mt-4 text-center text-gray-500 text-sm">
          No spam. Unsubscribe anytime.
        </p>
      </motion.div>
    </section>
  );
};

export default Newsletter;
