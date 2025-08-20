// pages/homePage.jsx
import React from "react";
import HeroSection from "../../components/home/heroSection";
import Categories from "../../components/home/categories";
import FeaturedProducts from "../Products/featuredProducts";
import Testimonials from "../../components/home/testimonials";
import Newsletter from "../../components/home/newsletter";
import FeaturedStories from "../../components/home/feturedStories";
import Deals from "../../components/home/deals";

const HomePage = () => {
  return (
    <>
      {/* Hero stays full width without border */}
      <section id="home">
        <HeroSection />
      </section>

      {/* Each section wrapped individually with border (no rounding) */}
      <section id="shop" className="m-6 border-2 border-gray-500 p-6">
        <FeaturedProducts />
      </section>

      <section id="categories" className="m-6 border-2 border-gray-500 p-6">
        <Categories />
      </section>

      <section id="deals" className="m-6 border-2 border-gray-500 p-6">
        <Deals />
      </section>

      <section id="stories" className="m-6 border-2 border-gray-500 p-6">
        <FeaturedStories />
      </section>

      <section id="contact" className="m-6 border-2 border-gray-500 p-6">
        <Testimonials />
      </section>

      <section id="newsletter" className="m-6 border-2 border-gray-500 p-6">
        <Newsletter />
      </section>
    </>
  );
};

export default HomePage;
