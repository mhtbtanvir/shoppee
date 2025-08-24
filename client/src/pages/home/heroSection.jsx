import React from 'react';
import heroBg from '../../assets/bg-hero.jpg';
const HeroSection = () => {
  return (
    <div className="flex flex-col   m-6 md:flex-row h-screen md:h-[700px] ">
      {/* Left Section */}
<div
  className="relative md:w-1/2 h-96 md:h-full overflow-hidden border-2 border-b-0 md:border-b-2 md:border-r-0 border-gray-500 flex justify-center items-center"
>
  <div className="text-center space-y-4 md:space-y-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
    
    {/* First line with horizontal lines */}
    <div className="flex items-center justify-center space-x-2 md:space-x-4">
      <span className="w-8 md:w-12 h-[1px] md:h-[2px] bg-[#414141]"></span>
      <h1 className="text-sm md:text-[24px] font-bold font-prata leading-tight tracking-wide">
        True Fashion
      </h1>
      <span className="w-8 md:w-12 h-[1px] md:h-[2px] bg-[#414141]"></span>
    </div>

    {/* Second line */}
    <h2 className="text-xs md:text-[18px] font-prata leading-tight">
      Begins
    </h2>

    {/* Third line with horizontal lines */}
    <div className="flex items-center justify-center space-x-2 md:space-x-4 whitespace-nowrap">
      <h2 className="text-xl mb-10 md:text-[36px] font-prata font-bold leading-tight tracking-wide flex-shrink-0">
        With How You Feel
      </h2>
    </div>

    {/* Call to Action */}
    <a
      href="/auth/register"
      className=" py-2.5 ml-4 px-5 me-2 mb-2 text-sm 
      font-medium
       text-gray-600 focus:outline-none
        bg-gray-500/10 rounded-lg border-2
         border-gray-700/30 hover:bg-gray-300/80
          hover:text-black-
          focus:z-10 focus:ring-4
       focus:ring-gray-100
       "
    >
      Shop Now
    </a>
  </div>
</div>


      {/* Right Section (Image) */}
   <div className="md:w-1/2 md:h-full h-96 relative overflow-hidden">
  {/* Image */}
  <img
    src={heroBg}
    alt="Fashion"
    className="w-full h-full object-cover object-top transform scale-105"
  />

  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-indigo-700 opacity-20 z-20"></div>
</div>




    </div>
  );
};

export default HeroSection;
