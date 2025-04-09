import React, { useEffect, useRef } from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from 'swiper';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface SwiperImageProps<T> {
  data: T[];
  slidesPerView?: number;
  renderSlide: (item: T) => React.ReactNode;
  activeIndex?: number;
  onSlideChange?: (index: number) => void;
}

const SwiperImage = <T extends { id: number }>({
  data,
  slidesPerView = 1,
  renderSlide,
  activeIndex = 0,
  onSlideChange,
}: SwiperImageProps<T>) => {
  const swiperRef = useRef<SwiperType | null>(null);

  // Handle external activeIndex changes
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.activeIndex !== activeIndex) {
      swiperRef.current.slideTo(activeIndex);
    }
  }, [activeIndex]);

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={slidesPerView}
        navigation
        className="customImage-swiper"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          // Initialize to the correct activeIndex
          if (activeIndex !== 0) {
            swiper.slideTo(activeIndex);
          }
        }}
        onSlideChange={(swiper) => {
          if (onSlideChange && swiperRef.current) {
            onSlideChange(swiper.activeIndex);
          }
        }}
        initialSlide={activeIndex}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>{renderSlide(item)}</SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .customImage-swiper .swiper-button-prev,
        .customImage-swiper .swiper-button-next {
          width: 80px !important;
          height: 80px !important;
        }
        .customImage-swiper .swiper-button-prev::after,
        .customImage-swiper .swiper-button-next::after {
          font-size: 21px !important;
          color: #4379f2;
          font-weight: bold;
        }
      `}</style>
    </>
  );
};

export default SwiperImage;