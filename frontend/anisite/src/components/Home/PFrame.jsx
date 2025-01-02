import React, { useState, useEffect } from "react";
import "./extra.css";

function PFrame({ images}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);


  
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
  );
};


const nextSlide = () => {
  setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
};

useEffect(() => {
    const interval = setInterval(nextSlide, 3500);
    return () => clearInterval(interval);
}, [ currentIndex]);


  return (
    <div className="relative w-full h-[380px] bg-gray-900 shadow-md border-b-gray-800 border-b-[1.5px]"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    >

      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover transition-opacity duration-700 ${
            index%2==0 ? "bg-center" : "bg-top"} ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img.source})` }}
        />
      ))}

      <div className="absolute inset-0 image-gradient" />

      <h1 className="absolute bottom-5 left-20 w-full text-4xl uppercase text-white h1-text-styles">
        {images[currentIndex].content}
      </h1>

      <button
        onClick={prevSlide}
        className="absolute text-5xl top-1/2 h-full left-0 transform -translate-y-1/2 button-gradient-l text-white p-2"
      >
        &lt;
      </button>

      <button
        onClick={nextSlide}
        className="absolute text-5xl top-1/2 h-full right-0 transform -translate-y-1/2 button-gradient-r text-white p-2"
      >
        &gt;
      </button>

      {/* Dots/Indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-1 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400 opacity-75"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PFrame;
