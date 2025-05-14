import React, { useEffect, useState, useRef } from "react";
import Button from "../ui/Button"; // Importing the Button component

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const nextSection =
      document.getElementById("services-section") ||
      document.querySelector("section:nth-of-type(2)");
    if (nextSection) {
      window.scrollTo({
        top: nextSection.offsetTop,
        behavior: "smooth",
      });
    }
  };

  // Function to generate an Ethiopian/Habesha pattern SVG
  const habeshaPatternSvg = `data:image/svg+xml;base64,${btoa(`
    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <!-- Habesha Pattern Base -->
      <defs>
        <pattern id="habeshaGrid" width="60" height="60" patternUnits="userSpaceOnUse">
          <!-- Cross Pattern (Meskel/Tile Cross inspired) -->
          <path d="M30,5 L35,30 L55,30 L40,45 L45,60 L30,50 L15,60 L20,45 L5,30 L25,30 Z" 
                fill="none" stroke="white" stroke-opacity="0.08" stroke-width="1.5"/>
          
          <!-- Diamond Pattern -->
          <path d="M0,30 L30,0 L60,30 L30,60 Z" 
                fill="none" stroke="white" stroke-opacity="0.05" stroke-width="1.5"/>
          
          <!-- Inner Cross for detail -->
          <path d="M30,15 L32,30 L45,30 L35,38 L38,45 L30,40 L22,45 L25,38 L15,30 L28,30 Z" 
                fill="none" stroke="white" stroke-opacity="0.07" stroke-width="1"/> 
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#habeshaGrid)"/>
    </svg>
  `)}`;

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex items-center overflow-hidden"
    >
      {/* Background Image with Parallax and Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000"
        style={{
          backgroundImage: 'url("/image/heroImage.jpg")',
          backgroundPosition: "center",
          transform: `scale(1.1) translateY(${scrollPosition * 0.05}px)`,
          filter: "brightness(0.55) blur(6px)",
        }}
      />

      {/* Stronger, Modern Gradient Overlay with more pink tones */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-[#3f1a54]/60 to-[#2d0735]/40"></div>

      {/* Habesha Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImhhYmVzaGFHcmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0zMCw1IEwzNSwzMCBMNTUsMzAgTDQwLDQ1IEw0NSw2MCBMMzAsNTAgTDE1LDYwIEwyMCw0NSBMNSwzMCBMMjUsMzAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDgiIHN0cm9rZS13aWR0aD0iMS41Ii8+PHBhdGggZD0iTTAsMzAgTDMwLDAgTDYwLDMwIEwzMCw2MCBaIiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48cGF0aCBkPSJNMzAsMTUgTDMyLDMwIEw0NSwzMCBMMzUsMzggTDM4LDQ1IEwzMCw0MCBMMjIsNDUgTDI1LDM4IEwxNSwzMCBMMjgsMzAgWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMDciIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNoYWJlc2hhR3JpZCkiLz48L3N2Zz4=')] opacity-80"></div>

      {/* Content Area - Centered */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 h-full">
        {/* Content Wrapper */}
        <div className="w-full max-w-5xl flex flex-col items-center text-center py-12">
          {/* Decorative Habesha Cross Element */}
          <div
            className={`relative w-16 h-16 mb-6
                         transition-all duration-1000 ease-out
                         ${
                           isVisible
                             ? "opacity-70 rotate-0"
                             : "opacity-0 rotate-45"
                         }`}
          >
            <div className="absolute inset-0 bg-[#c27bff]/30 rounded-full"></div>
            <svg
              className="absolute inset-0"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50,5 L60,50 L95,50 L65,75 L75,95 L50,80 L25,95 L35,75 L5,50 L40,50 Z"
                stroke="#fff"
                strokeWidth="3"
                fill="none"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Hero Title - Larger and more elegant */}
          <h1
            className={`text-3xl md:text-2xl lg:text-3xl text-white font-light tracking-tight mb-4 leading-tight
                       transition-all duration-1000 ease-out
                       ${
                         isVisible
                           ? "opacity-100 translate-y-0"
                           : "opacity-0 translate-y-10"
                       }`}
            style={{ textShadow: "0 2px 15px rgba(0, 0, 0, 0.8)" }}
          >
            <span className="text-[#ffccf9]">Celebrate</span>{" "}
            <span className="font-medium "> Your Special Day</span>
          </h1>

          {/* Elegant Habesha-inspired Divider */}
          <div
            className={`relative w-32 h-4 my-8
                         transition-all duration-1000 delay-200 ease-out
                         ${
                           isVisible
                             ? "opacity-90 scale-x-100"
                             : "opacity-0 scale-x-0"
                         }`}
          >
            <div className="absolute inset-y-0 left-0 w-1/3 h-[1px] bg-[#c27bff] top-[50%]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 transform rotate-45 bg-[#c27bff]"></div>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/3 h-[1px] bg-[#c27bff] top-[50%]"></div>
          </div>

          {/* Subtitle - Using light pink theme color */}
          <p
            className={`text-xl md:text-xl lg:text-2xl text-[#ffccf9] font-light leading-relaxed mb-4
                        transition-all duration-1000 delay-300 ease-out 
                        ${
                          isVisible
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-10"
                        }`}
            style={{ textShadow: "0 1px 8px rgba(0, 0, 0, 0.7)" }}
          >
            We craft timeless Ethiopian wedding experiences honoring tradition
            with modern elegance
          </p>

          {/* Key Features - With Habesha-inspired borders and hover effect */}
          <div
            className={`grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-10 
                          transition-all duration-1000 delay-400 ease-out
                          ${
                            isVisible
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-10"
                          }`}
          >
            <div
              className="group flex flex-col items-center text-center p-4 hover:scale-105 transform transition-all duration-300 ease-out 
                          border border-[#c27bff]/20 hover:border-[#c27bff]/70 rounded-lg backdrop-blur-sm bg-black/10"
            >
              <span className="text-4xl mb-3 text-white opacity-90">✨</span>
              <h3 className="text-xl md:text-2xl text-white font-medium mb-2">
                Cultural Venues
              </h3>
              <p className="text-base md:text-lg text-[#ffccf9] opacity-90">
                Authentic locations blending Ethiopian heritage with luxury
              </p>
            </div>
            <div
              className="group flex flex-col items-center text-center p-4 hover:scale-105 transform transition-all duration-300 ease-out
                          border border-[#c27bff]/20 hover:border-[#c27bff]/70 rounded-lg backdrop-blur-sm bg-black/10"
            >
              <span className="text-4xl mb-3 text-white opacity-90">🥂</span>
              <h3 className="text-xl md:text-2xl text-white font-medium mb-2">
                Full Service
              </h3>
              <p className="text-base md:text-lg text-[#ffccf9] opacity-90">
                Traditional ceremonies to modern celebrations, expertly crafted
              </p>
            </div>
            <div
              className="group flex flex-col items-center text-center p-4 hover:scale-105 transform transition-all duration-300 ease-out
                          border border-[#c27bff]/20 hover:border-[#c27bff]/70 rounded-lg backdrop-blur-sm bg-black/10"
            >
              <span className="text-4xl mb-3 text-white opacity-90">📸</span>
              <h3 className="text-xl md:text-2xl text-white font-medium mb-2">
                Timeless Memories
              </h3>
              <p className="text-base md:text-lg text-[#ffccf9] opacity-90">
                Capturing your special moments with artistic vision
              </p>
            </div>
          </div>

          {/* Button - Enhanced with Habesha-inspired accent */}
          <div
            className={`mt-10 flex justify-center transition-all duration-1000 delay-600 ease-out 
                            ${
                              isVisible
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-10"
                            }`}
          >
            <div className="relative group">
              <div
                className="absolute -inset-0.5 bg-gradient-to-r from-[#c27bff] to-[#9c4dff] opacity-70 rounded-full blur-sm
                            group-hover:opacity-90 transition-all duration-300"
              ></div>
              {/* <Button
                text="Book a Consultation"
                onClick={() => {
                  location.href = "/login";
                }}
                className="relative text-lg px-10 py-4 bg-[#c27bff] text-white font-medium rounded-full 
                          hover:bg-[#a964e6] transform hover:scale-105 transition-all duration-300 shadow-lg"
              /> */}
            </div>
          </div>
        </div>

        {/* Scroll Down Button - With Habesha-inspired border */}
        <div
          className={`absolute left-1/2 bottom-10 transform -translate-x-1/2 
                       transition-all duration-1000 delay-1000 ease-out
                       ${
                         isVisible
                           ? "opacity-80 translate-y-0"
                           : "opacity-0 translate-y-10"
                       }`}
        >
          <button
            onClick={scrollToNextSection}
            className="flex flex-col items-center hidden lg:block mt-4 justify-center text-[#ffccf9] hover:text-white transition-colors duration-300"
            aria-label="Scroll to next section"
          >
            {" "}
            <div
              className="w-10 h-10 rounded-full border-2 border-[#ffccf9] hover:border-[#c27bff] 
                         flex items-center justify-center hover:bg-[#c27bff]/30 transition-all duration-300
                         relative overflow-hidden"
            >
              {/* Subtle Habesha pattern in the button */}
              <div
                className="absolute inset-0 opacity-20 "
                style={{ backgroundImage: `url(${habeshaPatternSvg})` }}
              ></div>
              <svg
                className="w-6 h-6 animate-bounce relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
