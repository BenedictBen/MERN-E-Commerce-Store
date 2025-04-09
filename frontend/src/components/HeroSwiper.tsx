import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Link from "next/link";
import Image from "next/image";

const HeroSwiper = () => {
  const slides = [
    {
      id: 1,
      image: "/home/home-slider01.jpg",
      top: "new arrivals",
      title: "Hot Right Now",
      sub: "Retro Remixed for The Future Starting at $110",
      button: "/shop/Fashion",
    }, 
    {
      id: 2,
      image: "/home/home-slider02.jpg",
      top: "editorials",
      title: "Natural Air Purifier",
      sub: "It brings light and happiness to your house, like a sun beam after the rain",
      button: "/shop/Home%20%26%20Garden",
    },
    {
      id: 3,
      image: "/home/home-slider03.jpg",
      top: "featured",
      title: "Bring it Anywhere",
      sub: "The perfect portable speaker for home and away",
      button: "/shop/Electronics",
    },
  ];

  return (
    <Swiper
      modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
      spaceBetween={50}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay config
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative !mt-3">
            <Image
              src={slide.image}
              alt={slide.title}
              width={1200} 
              height={400} 
              className="w-full h-auto object-cover mt-3"
            />
            {/* Overlay Text */}
            <div
              className={`absolute inset-y-0 left-12 flex flex-col justify-center gap-3 bg-opacity-40 p-4`}
            >
              <p
                className={`uppercase !text-sm lg:!text-xl mb-2 ${
                  slide.id === 1 ? "text-white" : "text-black"
                }`}
                
              >
                {slide.top}
              </p>
              <h1
                className={`!text-lg lg:!text-2xl !font-bold  mb-2 ${
                  slide.id === 1 ? "text-white" : "text-black"
                }`}
                
              >
                {slide.title}
              </h1>
              <p
                className={ `text-xs w-3/4 lg:text-lg lg:w-sm  mb-4 ${
                  slide.id === 1 ? "text-white" : "text-black"
                }`}
                style={{ whiteSpace: "pre-line" }} 
              >
                {slide.sub}
              </p>
              <Link href={slide.button}>
                <button
                  style={{
                    backgroundColor: slide.id === 1 ? "#ffffff" : "#000000",
                    color: slide.id === 1 ? "blue" : "#ffffff",
                   
                  }}
                  className="!px-2 !py-2 lg:px-8 lg:py-8 border-2 transition hover:bg-gray-200 cursor-pointer"
                >
                  Shop Now
                </button>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default HeroSwiper;
