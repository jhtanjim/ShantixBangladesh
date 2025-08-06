// Banner.tsx
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  default as bannerImg1,
  default as bannerImg2,
  default as bannerImg3,
} from "../../assets/images/banner.jpg";

const banners = [bannerImg1, bannerImg2, bannerImg3];

const Banner = () => {
  return (
    <section className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full bg-black">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation
        className="h-full"
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center">
                <div className="container mx-auto px-4">
                  <div className="text-end">
                    <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-2 md:mb-4">
                      Fixed Price
                    </h1>
                    <p
                      className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6"
                      style={{
                        color: "transparent",
                        WebkitTextStroke: "1px white",
                      }}
                    >
                      Stock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Banner;
