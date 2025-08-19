import React from 'react';

const HeroSection = () => {
  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Background layer */}
      <div
        className="w-full h-full bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80')",
        }}
      >
        {/* Content wrapper */}
        <div className="flex  gap-5 h-full items-center justify-between px-8">
          <div className="flex items-center gap-8">
            {/* Text */}
            <div className="max-w-xl text-white">
              <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
                Explore Within <span className="text-violet-300">YOU</span>
                <br />
                And Find What You Love
              </h1>
            </div>

            {/* Vertical line */}
            <div className="h-[80vh] w-[1px] bg-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;