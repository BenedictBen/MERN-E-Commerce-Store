import React from "react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

interface SwiperSliderProps<T> {
  data: T[];
  slidesPerView?: number;
  renderSlide: (item: T) => React.ReactNode;
}

const SwiperSlider = <T extends { id: number }>({
  data,
  slidesPerView = 1,
  renderSlide,
}: SwiperSliderProps<T>) => {
  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={20}
        slidesPerView={slidesPerView}
        breakpoints={{
          // When viewport width is >= 640px (mobile), 1 slide per view
          640: { slidesPerView: 1 },
          // When viewport width is >= 768px (tablet), 3 slides per view
          768: { slidesPerView: 3 },
          // When viewport width is >= 1024px (desktop/large), 5 slides per view
          1024: { slidesPerView: 5 },
        }}
        navigation
        className="custom-swiper-different"
        // pagination={{ clickable: true }}
      >
        {data.map((item) => (
          <SwiperSlide key={item.id}>{renderSlide(item)}</SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default SwiperSlider;
