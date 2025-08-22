// src/components/Testimonials.jsx
import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sophia Martinez",
    role: "Fashion Blogger",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    text: "The craftsmanship is unmatched. Each piece feels like it was made just for me. I receive compliments every time I wear them.",
    rating: 5,
  },
  {
    id: 2,
    name: "James Carter",
    role: "Creative Director",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    text: "Sleek, modern, and effortless. This brand knows how to combine luxury with comfort in a way that's truly unique.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ava Chen",
    role: "Entrepreneur",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    text: "It’s more than fashion — it’s confidence. I feel empowered and stylish every time I wear their pieces.",
    rating: 4,
  },
  {
    id: 4,
    name: "Liam O’Connor",
    role: "Photographer",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    text: "The attention to detail is remarkable. From packaging to design, everything screams premium.",
    rating: 5,
  },
  {
    id: 5,
    name: "Isabella Rossi",
    role: "Art Curator",
    image: "https://randomuser.me/api/portraits/women/41.jpg",
    text: "Timeless elegance. Every product feels like an investment in my personal style.",
    rating: 5,
  },
  {
    id: 6,
    name: "Noah Patel",
    role: "Designer",
    image: "https://randomuser.me/api/portraits/men/52.jpg",
    text: "A perfect balance of minimalism and boldness. These designs inspire my own creative work.",
    rating: 4,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.8, 0.25, 1] },
  },
};

const Testimonials = () => {
  return (
    <section
      aria-labelledby="testimonials-heading"
      className="relative w-full min-h-[80vh] px-6 md:px-12 py-8 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden"
    >
      {/* blurred background accents */}
      <div className="absolute -top-32 -left-24 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] bg-pink-400/10 rounded-full blur-3xl -z-10" />

      {/* heading */}
      <motion.header
        className="text-center mb-16"
        initial={{ opacity: 0, y: -25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
      >
        <h2
          id="testimonials-heading"
          className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight"
        >
          Loved by Thousands
        </h2>
        <p className="mt-8 text-gray-600 text-lg max-w-2xl mx-auto">
          Discover why style icons, creators, and professionals trust us to elevate their look.
        </p>
      </motion.header>

      {/* testimonial grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {testimonials.map((t, i) => (
          <motion.article
            key={t.id}
            className={`relative rounded-2xl border border-white/40 bg-white/50 backdrop-blur-xl shadow-md p-8 flex flex-col items-center text-center transition-transform duration-500 hover:-translate-y-3 hover:shadow-2xl ${
              i % 2 === 0
                ? "hover:bg-gradient-to-tr hover:from-gray-50 hover:to-white"
                : "hover:bg-gradient-to-tr hover:from-white hover:to-gray-50"
            }`}
            variants={cardVariants}
          >
            {/* avatar */}
            <img
              src={t.image}
              alt={`${t.name} profile`}
              className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg -mt-14 mb-5"
              loading="lazy"
            />

            {/* name & role */}
            <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
            <p className="text-sm text-gray-500">{t.role}</p>

            {/* stars */}
            <div className="flex items-center justify-center gap-1 mt-3">
              {[...Array(5)].map((_, index) => (
                <Star
                  key={index}
                  className={`w-4 h-4 ${
                    index < t.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>

            {/* text */}
            <p className="mt-5 text-gray-700 leading-relaxed text-sm md:text-base italic">
              “{t.text}”
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
};

export default Testimonials;
