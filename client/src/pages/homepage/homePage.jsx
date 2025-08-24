import React from "react";
import HeroSection from "../home/heroSection";
import Categories from "../home/categories";
import FeaturedProducts from "../home/featuredProducts";
import Testimonials from "../home/testimonials";
import Newsletter from "../home/newsletter";
import FeaturedStories from "../home/feturedStories";
import Deals from "../home/deals";

const HomePage = () => {
  return (
    <>
      {/* Hero: full-width, premium background */}
      <section id="home" className="relative w-full">
        <HeroSection />
      </section>

      {/* Featured Products */}
      <section
        id="shop"
        className="mx-6 mt-20 p-8 border border-t-8 border-gray-300 shadow-md rounded-2xl bg-gradient-to-l from-gray-100/50 to-gray-200/30 backdrop-blur-sm"
      >
        <FeaturedProducts />
      </section>

      {/* Categories */}
      <section
        id="categories"
        className="mx-6 mt-20 border border-t-8 p-8  border-gray-300 shadow-md rounded-2xl bg-gray-400/30 backdrop-blur-lg"
      >
        <Categories />
      </section>

      {/* Deals */}
      <section
        id="deals"
        className="mx-6 mt-20 p-8 border border-t-4 border-gray-300 
        shadow-md rounded-2xl bg-gradient-to-l from-gray-100/50 to-gray-200/30 backdrop-blur-sm"
      >
        <Deals />
      </section>

      {/* Featured Stories */}
      {/* <section
        id="stories"
        className="mx-6 mt-20 p-8 border border-t-4 border-gray-300 shadow-md rounded-2xl
         bg-gradient-to-l from-gray-100/50 to-gray-200/30 backdrop-blur-sm"
      >
        <FeaturedStories />
      </section> */}

      {/* Testimonials */}
      <section
        id="contact"
        className="mx-6 mt-20 p-8 border border-t-2 border-gray-300 shadow-lg rounded-xl bg-gradient-to-l from-gray-100/50 to-gray-200/30 backdrop-blur-sm backdrop-blur-md"
      >
        <Testimonials />
      </section>

      {/* Newsletter */}
      <section
        id="newsletter"
        className="mx-6 mt-20 p-8 border-t-2 rounded-b-sm border-gray-300 shadow-md rounded-2xl bg-gradient-to-l from-gray-100/50 to-gray-200/30 backdrop-blur-sm"
      >
        <Newsletter />
      </section>
    </>
  );
};

export default HomePage;
