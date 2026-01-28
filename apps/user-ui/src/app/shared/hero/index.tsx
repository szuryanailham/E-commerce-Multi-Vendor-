'use client';

import { MoveRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Hero = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Data slides
  const slides = [
    {
      id: 1,
      price: '$40',
      title: 'The Best Watch',
      subtitle: 'Collection 2025',
      discount: '10%',
      image: 'https://ik.imagekit.io/jmd8s4bvf/products/smart-watch-1.png',
      bgColor: 'bg-[#115061]',
    },
    {
      id: 2,
      price: '$55',
      title: 'Premium Watches',
      subtitle: 'Luxury Series',
      discount: '15%',
      image: 'https://ik.imagekit.io/jmd8s4bvf/products/Apple-watch.png',
      bgColor: 'bg-[#2C3E50]',
    },
    {
      id: 3,
      price: '$35',
      title: 'Sports Collection',
      subtitle: 'Active Lifestyle',
      discount: '20%',
      image: 'https://ik.imagekit.io/jmd8s4bvf/products/shoesSport.png',
      bgColor: 'bg-[#34495E]',
    },
  ];

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentData = slides[currentSlide];

  return (
    <div
      className={`${currentData.bgColor} min-h-[85vh] flex flex-col justify-center transition-colors duration-500 relative overflow-hidden`}
    >
      <div className="md:w-[80%] w-[90%] m-auto md:flex h-full items-center py-10 relative z-10">
        {/* Text Content */}
        <div className="md:w-1/2 space-y-6 animate-fadeIn">
          <p className="font-Roboto font-normal text-white/80 text-sm md:text-base">
            Starting from {currentData.price}
          </p>

          <h1 className="text-white text-4xl md:text-6xl font-extrabold font-Roboto leading-tight">
            {currentData.title} <br />
            {currentData.subtitle}
          </h1>

          <p className="font-Oregano text-2xl md:text-3xl text-white">
            Exclusive offer{' '}
            <span className="text-yellow-400 font-bold">
              -{currentData.discount}
            </span>{' '}
            this week
          </p>

          <button
            onClick={() => router.push('/products')}
            className="flex items-center gap-2 bg-white text-[#115061] px-6 py-3 rounded-md font-semibold hover:bg-yellow-400 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Shop Now <MoveRight className="w-5 h-5" />
          </button>
        </div>

        {/* Image Content */}
        <div className="md:w-1/2 flex justify-center items-center mt-10 md:mt-0">
          <div className="relative animate-fadeIn">
            <Image
              src={currentData.image}
              alt={`${currentData.title} - ${currentData.subtitle}`}
              width={650}
              height={650}
              className="object-contain drop-shadow-2xl"
              priority
            />
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-1/2 -translate-y-1/2 w-full px-4 md:px-10 flex justify-between z-20">
        <button
          onClick={prevSlide}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-yellow-400'
                : 'w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
