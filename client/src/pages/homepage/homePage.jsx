// pages/homePage.jsx
import React from "react";
import HeroSection from "../../components/home/heroSection";
import Categories from "../../components/home/categories";
import FeaturedProducts from "../../components/home/featuredProducts";
import Testimonials from "../../components/home/testimonials";
import Newsletter from "../../components/home/newsletter";

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
