// src/components/FeaturedStories.jsx
import React from "react";
import { motion } from "framer-motion";

const stories = [
  {
    id: 1,
    title: "Behind the Scenes: Summer Collection",
    description: "Discover the process and inspiration behind our latest summer outfits.",
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1000&q=80",
    category: "Inspiration",
  },
  {
    id: 2,
    title: "Style Guide: How to Layer Like a Pro",
    description: "Tips and tricks for layering outfits without losing style.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80",
    category: "Style Guide",
  },
  {
    id: 3,
    title: "Seasonal Trends: Winter Must-Haves",
    description: "Stay ahead with the must-have items for this winter season.",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80",
    category: "Trends",
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

const FeaturedStories = () => {
  return (
    <section
      aria-labelledby="featured-stories-heading"
      className="relative w-full px-6 md:px-12 py-10 bg-gradient-to-b from-gray-50 via-white to-gray-100 overflow-hidden"
    >
      {/* Decorative blurred shapes */}
      <div className="absolute -left-14 -top-10 w-56 h-56 bg-pink-500/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -right-10 bottom-10 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl -z-10" />

      {/* Heading */}
      <motion.header
        className="text-center mb-12"
        initial={{ opacity: 0, y: -28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <h2
          id="featured-stories-heading"
          className="text-3xl md:text-4xl font-extrabold text-gray-900 font-prata tracking-tight"
        >
          Featured Stories
        </h2>
        <p className="mt-3 text-gray-600 text-lg max-w-2xl mx-auto">
          Insights, tips, and inspiration — curated for our fashion-forward community.
        </p>
      </motion.header>

      {/* Grid of stories */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {stories.map((story) => (
          <motion.article
            key={story.id}
            className="relative rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md shadow-lg transition"
            variants={cardVariants}
            whileHover="hover"
            role="group"
            aria-labelledby={`story-${story.id}-title`}
          >
            {/* Image */}
            <div className="relative w-full h-52 overflow-hidden">
              <motion.img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover transform transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105"
                loading="lazy"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
              {/* Category badge */}
              <div className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20 shadow-sm">
                {story.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-5 text-center">
              <h3
                id={`story-${story.id}-title`}
                className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-black transition-colors duration-300"
              >
                {story.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{story.description}</p>
              <div className="mt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-sm font-medium shadow-sm hover:opacity-95 transition"
                  aria-label={`Read story: ${story.title}`}
                >
                  Read More
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default FeaturedStories;
