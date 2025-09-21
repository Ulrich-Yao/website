'use client';

import { useState, useEffect } from 'react';
import { Tv } from 'lucide-react';

export default function ImageCarousel({ landing }: { landing: any }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // défilement auto toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % landing.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [landing]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? landing.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      (prev + 1) % landing.length
    );
  };

  return (
    <div className="relative w-full h-96 overflow-hidden bg-black">
      <div
        id="carousel-track"
        className="flex transition-transform duration-1000 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {landing.map((item: any) => (
          <div
            key={item.id}
            className="carousel-slide min-w-full h-full relative"
            style={{
              backgroundImage: `url(${item.photo})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <div className="absolute inset-0 bg-black/10 w-full"></div>
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center z-20 relative">
                
                <h3 className="text-3xl font-bold text-white mb-2"></h3>
                <p className="text-white/80"></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Flèches de navigation */}

      {/* Navigation arrows */}
        <button onClick={prevSlide} className="carousel-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-30">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

        <button  onClick={nextSlide} className="carousel-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 z-30">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        </button>
    </div>
  );
}
