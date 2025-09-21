'use client';

import Link from 'next/link';
import { Play, Tv, Calendar, Users, Facebook, Twitter, Instagram, Youtube, Linkedin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ImageCarousel from './components/ImageCarousel';
import VideoTest from './components/Videotest';


interface Category{
  id: string;
  name: string;
  photo: string;
  description: string;
  createdAt: Date;
}

export default function HomePage() {
  const [landing, setLanding] = useState([]);
  const [categorie, setCategorie] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const fetchCategories = () => {
    fetch('https://radah-gamesclub.com/server/api/categorie/')
      .then(response => response.json())
      .then(data => setCategorie(data))
      .catch(error => alert('Impossible de charger'));
  };

  const fetchLanding = () => {
    fetch('https://radah-gamesclub.com/server/api/landing/')
      .then(response => response.json())
      .then(data => setLanding(data))
      .catch(error => alert('Impossible de charger'));
  };

  useEffect(() => {
    fetchCategories();
    fetchLanding();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .animate-fade-in-left {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.6s ease-out forwards;
        }
        
        .animate-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animate-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animate-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animate-delay-800 {
          animation-delay: 0.8s;
        }
        
        .initial-hidden {
          opacity: 0;
        }
        
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }
        
        .scroll-reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(239, 68, 68, 0.3);
        }
        
        .carousel-slide {
          transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .carousel-dot.active {
          background-color: white;
          transform: scale(1.2);
        }
        
        .carousel-slide .text-center {
          transform: translateY(20px);
          opacity: 0;
          transition: all 0.8s ease-out;
        }
        
        .carousel-slide.active .text-center {
          transform: translateY(0);
          opacity: 1;
        }
        
        @keyframes slideInFromRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInFromLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .slide-in-right {
          animation: slideInFromRight 0.8s ease-out forwards;
        }
        
        .slide-in-left {
          animation: slideInFromLeft 0.8s ease-out forwards;
        }
      `}</style>
      {/* Navigation */}
      <nav className="bg-green-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-red-500">LOGO PEAK GIFT</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-8">
                  <Link href="/" className="text-white hover:text-red-500 px-3 py-2 text-sm font-medium">
                    Accueil
                  </Link>
                  <Link href="/la-chaine" className="text-gray-300 hover:text-red-500 px-3 py-2 text-sm font-medium">
                    A Propos
                  </Link>
                  <Link href="/programmes" className="text-gray-300 hover:text-red-500 px-3 py-2 text-sm font-medium">
                    Profils de jeux
                  </Link> 
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Link
                href="/admin/login"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Espace Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section - Live TV with Background Carousel */}
      <div className="relative h-screen overflow-hidden bg-black">
        {/* Background Image Carousel */}
        <div id="hero-carousel-container" className="absolute inset-0">
          <div id="hero-carousel-track" className="flex transition-transform duration-2000 ease-in-out h-full">
            <div className="hero-carousel-slide min-w-full h-full relative" style={{
              backgroundImage: `url('/owl1.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/70 to-black/60"></div>
            </div>
            <div className="hero-carousel-slide min-w-full h-full relative" style={{
              backgroundImage: `url('/hero-bg.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-black/60"></div>
            </div>
            <div className="hero-carousel-slide min-w-full h-full relative" style={{
              backgroundImage: `url('/feakgift-hero.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}>
              <div className="absolute inset-0 bg-gradient-to-r from-green-900/70 to-black/60"></div>
            </div>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <div className="inline-flex items-center bg-yellow-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 initial-hidden animate-fade-in-up">
                <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                ASSAISONNEZ VOTRE VIE
              </div>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 initial-hidden animate-fade-in-up animate-delay-200 text-white drop-shadow-2xl">
                DONNEZ DU GOUT
                <span className="block text-yellow-400">A VOS PROJETS</span>
              </h1>
              <p className="text-xl text-white mb-8 max-w-2xl mx-auto initial-hidden animate-fade-in-up animate-delay-400 drop-shadow-lg">
                Avec Peak Gift passe du rêve à la réalité. En 30s sec tu peux changer de vie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center initial-hidden animate-fade-in-up animate-delay-600">
                <Link
                  href="/live"
                  className="inline-flex max-w-[200px] items-center  hover:bg-red-700 text-white  rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <img src="./images/play.png" alt="telecharger sur playstore" />
                </Link>
                <Link
                  href="/programmes"
                  className="inline-flex items-center max-w-[180px]  text-white hover:bg-white hover:text-black  rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <img src="./images/apple.png" alt="telecharger sur apple store" /> 
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Carousel Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          <button className="hero-carousel-dot w-4 h-4 rounded-full bg-white/50 hover:bg-white transition-all duration-300 active" data-slide="0"></button>
          <button className="hero-carousel-dot w-4 h-4 rounded-full bg-white/50 hover:bg-white transition-all duration-300" data-slide="1"></button>
          <button className="hero-carousel-dot w-4 h-4 rounded-full bg-white/50 hover:bg-white transition-all duration-300" data-slide="2"></button>
        </div>

        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-red-500 rounded-full opacity-10 animate-bounce z-5"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white rounded-full opacity-5 animate-pulse z-5"></div>
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-yellow-400 rounded-full opacity-20 animate-ping z-5"></div>
      </div>

      {/* Image Carousel */}
      <div className="relative h-96 overflow-hidden bg-black">
        <div id="carousel-container" className="relative w-full h-full">
          <div id="carousel-track" className="flex transition-transform duration-1000 ease-in-out h-full">

            <ImageCarousel landing={landing} />

          </div>
        </div>
      </div>

      {/* TNT Info */}
      <div className="bg-red-600 py-4 scroll-reveal" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white font-bold text-lg animate-pulse">
              REJOIGNEZ-NOUS ET GAGNEZ!!!
            </p>
          </div>
        </div>
      </div>

      {/* Programs Section */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-4xl font-bold text-red-500 mb-4">
              TOUT CE QUE VOUS POUVEZ GAGNER
            </h2>
            <p className="text-green-700 text-lg">
              Des lots variés avec Peak Gift
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categorie.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-lg p-4">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-lg text-gray-800 font-semibold mt-2">{item.name}</h3>
                <p className="text-gray-500 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* À la Une Section */}
      <div className="py-16 bg-gradient-to-br from-green-900 to-green-200 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-reveal">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                DECOUVREZ PEAK GIFT
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-red-500 pl-6 transition-all duration-300 hover:border-l-8 hover:pl-8 scroll-reveal">
                  <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 hover:text-red-400">
                    Un jeu pour réaliser vos projets
                  </h3>
                  <p className="text-white mb-4">
                    Vous projetez de meubler votre maison, votre cuisine, faire des achats? Peak Gift est là
                  </p>

                </div>
                <div className="border-l-4 border-red-500 pl-6 transition-all duration-300 hover:border-l-8 hover:pl-8 scroll-reveal">
                  <h3 className="text-xl font-bold text-white mb-2 transition-colors duration-300 hover:text-red-400">
                    Accessible depuis votre smartphone
                  </h3>
                  <p className="text-white mb-4">
                    En famille ou en solo, Peak Gift est là pour vous aider à gagner
                  </p>
                </div>
              </div>
            </div>
            <VideoTest />
          </div>

        </div>
        {/* Floating elements */}
        <div className="absolute top-20 right-20 w-12 h-12 bg-red-500 rounded-full opacity-20 animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-8 h-8 bg-white rounded-full opacity-10 animate-bounce"></div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 scroll-reveal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="scroll-reveal">
              <h3 className="text-lg font-bold text-white mb-4 transition-colors duration-300 hover:text-red-400">La Chaîne</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/la-chaine" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    A propos
                  </Link>
                </li>
                <li>
                  <Link href="/cgu" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    Conditions d'utilisation
                  </Link>
                </li>
              </ul>
            </div>
            <div className="scroll-reveal">
              <h3 className="text-lg font-bold text-white mb-4 transition-colors duration-300 hover:text-red-400">Profils de jeux</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                   DAUPHIN
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    COLIBRI
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    TIGRE
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    AIGLE
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    BELIER
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:translate-x-1">
                    HAPPY DAYS
                  </Link>
                </li>
              </ul>
            </div>
            <div className="scroll-reveal">
              <h3 className="text-lg font-bold text-white mb-4 transition-colors duration-300 hover:text-red-400">Installer Peak Gift</h3>
              <div className="space-y-4">
              <Link
                  href="/live"
                  className="inline-flex max-w-[200px] items-center  hover:bg-red-700 text-white  rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <img src="./images/play.png" alt="telecharger sur playstore" />
                </Link>
                <Link
                  href="/programmes"
                  className="inline-flex items-center max-w-[200px]  text-white hover:bg-white hover:text-black  rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                >
                  <img src="./images/apple.png" alt="telecharger sur apple store" />
                </Link>
              </div>
            </div>
            <div className="scroll-reveal">
              <h3 className="text-lg font-bold text-white mb-4 transition-colors duration-300 hover:text-red-400">Suivez-nous</h3>
              <div className="flex space-x-4">
                <Link href="https://www.facebook.com/share/16gVoPf3jZ/" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <Facebook className="h-6 w-6" />
                </Link>
                {/* {<Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <Twitter className="h-6 w-6" />
                </Link>} */}
                <Link href="https://www.instagram.com/radahgamesclub?igsh=cjJpdGdvNXhvazBv" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <Instagram className="h-6 w-6" />
                </Link>
                {/* 
                <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <Youtube className="h-6 w-6" />
                </Link>
                */}
                {/* <Link href="#" className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-1">
                  <Linkedin className="h-6 w-6" />
                </Link>*/}
                
              </div>
              <div className="mt-4">
                <Link
                  href="#"
                  className="text-red-500 hover:text-red-400 text-sm transition-all duration-300 hover:translate-x-1"
                >
                  +2250172911518
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center scroll-reveal">
            <p className="text-gray-400 transition-colors duration-300 hover:text-white">
              © COPYRIGHTS PEAK GIFT – 2025
            </p>
          </div>
        </div>
      </footer>

      {/* Scroll reveal and carousel script */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            // Scroll reveal functionality
            const observerOptions = {
              threshold: 0.1,
              rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('revealed');
                }
              });
            }, observerOptions);
            
            document.querySelectorAll('.scroll-reveal').forEach(el => {
              observer.observe(el);
            });

            // Hero Carousel functionality
            let currentHeroSlide = 0;
            const heroSlides = document.querySelectorAll('.hero-carousel-slide');
            const heroDots = document.querySelectorAll('.hero-carousel-dot');
            const heroTrack = document.getElementById('hero-carousel-track');
            const totalHeroSlides = heroSlides.length;
            let heroAutoSlideInterval;

            function updateHeroCarousel(slideIndex) {
              // Remove active classes
              heroDots.forEach(dot => dot.classList.remove('active'));
              
              // Add active class to current dot
              heroDots[slideIndex].classList.add('active');
              
              // Move track
              heroTrack.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
              
              currentHeroSlide = slideIndex;
            }

            function nextHeroSlide() {
              const nextIndex = (currentHeroSlide + 1) % totalHeroSlides;
              updateHeroCarousel(nextIndex);
            }

            function goToHeroSlide(index) {
              updateHeroCarousel(index);
            }

            function startHeroAutoSlide() {
              heroAutoSlideInterval = setInterval(nextHeroSlide, 5000);
            }

            function stopHeroAutoSlide() {
              clearInterval(heroAutoSlideInterval);
            }

            // Initialize hero carousel
            updateHeroCarousel(0);
            startHeroAutoSlide();

            // Hero carousel event listeners
            heroDots.forEach((dot, index) => {
              dot.addEventListener('click', () => {
                stopHeroAutoSlide();
                goToHeroSlide(index);
                startHeroAutoSlide();
              });
            });

            // Pause hero carousel on hover
            const heroCarouselContainer = document.getElementById('hero-carousel-container');
            heroCarouselContainer.addEventListener('mouseenter', stopHeroAutoSlide);
            heroCarouselContainer.addEventListener('mouseleave', startHeroAutoSlide);

            // Program Carousel functionality
            let currentSlide = 0;
            const slides = document.querySelectorAll('.carousel-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            const track = document.getElementById('carousel-track');
            const totalSlides = slides.length;
            let autoSlideInterval;

            function updateCarousel(slideIndex, direction = 'next') {
              // Remove active classes
              slides.forEach(slide => slide.classList.remove('active'));
              dots.forEach(dot => dot.classList.remove('active'));
              
              // Add active classes
              slides[slideIndex].classList.add('active');
              dots[slideIndex].classList.add('active');
              
              // Move track
              track.style.transform = 'translateX(-' + (slideIndex * 100) + '%)';
              
              // Add slide animation based on direction
              slides[slideIndex].classList.remove('slide-in-left', 'slide-in-right');
              if (direction === 'next') {
                slides[slideIndex].classList.add('slide-in-right');
              } else {
                slides[slideIndex].classList.add('slide-in-left');
              }
              
              currentSlide = slideIndex;
            }

            function nextSlide() {
              const nextIndex = (currentSlide + 1) % totalSlides;
              updateCarousel(nextIndex, 'next');
            }

            function prevSlide() {
              const prevIndex = (currentSlide - 1 + totalSlides) % totalSlides;
              updateCarousel(prevIndex, 'prev');
            }

            function goToSlide(index) {
              const direction = index > currentSlide ? 'next' : 'prev';
              updateCarousel(index, direction);
            }

            function startAutoSlide() {
              autoSlideInterval = setInterval(nextSlide, 4000);
            }

            function stopAutoSlide() {
              clearInterval(autoSlideInterval);
            }

            // Initialize program carousel
            updateCarousel(0);
            startAutoSlide();

            // Program carousel event listeners
            document.querySelector('.carousel-next').addEventListener('click', () => {
              stopAutoSlide();
              nextSlide();
              startAutoSlide();
            });

            document.querySelector('.carousel-prev').addEventListener('click', () => {
              stopAutoSlide();
              prevSlide();
              startAutoSlide();
            });

            dots.forEach((dot, index) => {
              dot.addEventListener('click', () => {
                stopAutoSlide();
                goToSlide(index);
                startAutoSlide();
              });
            });

            // Pause program carousel on hover
            const carouselContainer = document.getElementById('carousel-container');
            carouselContainer.addEventListener('mouseenter', stopAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);

            // Touch/swipe support for mobile - Hero carousel
            let heroStartX = 0;
            let heroEndX = 0;

            heroCarouselContainer.addEventListener('touchstart', (e) => {
              heroStartX = e.touches[0].clientX;
            });

            heroCarouselContainer.addEventListener('touchend', (e) => {
              heroEndX = e.changedTouches[0].clientX;
              const diff = heroStartX - heroEndX;
              
              if (Math.abs(diff) > 50) {
                stopHeroAutoSlide();
                if (diff > 0) {
                  nextHeroSlide();
                } else {
                  const prevIndex = (currentHeroSlide - 1 + totalHeroSlides) % totalHeroSlides;
                  updateHeroCarousel(prevIndex);
                }
                startHeroAutoSlide();
              }
            });

            // Touch/swipe support for mobile - Program carousel
            let startX = 0;
            let endX = 0;

            carouselContainer.addEventListener('touchstart', (e) => {
              startX = e.touches[0].clientX;
            });

            carouselContainer.addEventListener('touchend', (e) => {
              endX = e.changedTouches[0].clientX;
              const diff = startX - endX;
              
              if (Math.abs(diff) > 50) {
                stopAutoSlide();
                if (diff > 0) {
                  nextSlide();
                } else {
                  prevSlide();
                }
                startAutoSlide();
              }
            });
          });
        `
      }} />
    </div>
  );
}
