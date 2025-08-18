// pages/homePage.jsx
import React from "react";
import HeroSection from "../components/herosection";
import Categories from "../components/categories";
import FeaturedProducts from "../components/featuredProducts";
import Testimonials from "../components/testimonials";
import Newsletter from "../components/newsletter";

const HomePage = () => {
  return (
    <>
      <section id="home">
        <HeroSection />
      </section>

      <section id="shop">
        <FeaturedProducts />
      </section>

      <section id="categories">
        <Categories />
      </section>

      <section id="deals">
        {/* Optional Deals component */}
      </section>

      <section id="contact">
        <Testimonials />
      </section>

      <section id="newsletter">
        <Newsletter />
      </section>
    </>
  );
};

export default HomePage;
