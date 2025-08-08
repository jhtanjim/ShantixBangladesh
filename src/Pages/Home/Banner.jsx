// Banner.tsx
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import banner1 from "../../assets/images/banner/1 Banner.jpg";
import banner2 from "../../assets/images/banner/2 Banner.jpg";
import banner3 from "../../assets/images/banner/3 Banner.jpg";
import banner4 from "../../assets/images/banner/4 Banner.jpg";
import banner5 from "../../assets/images/banner/5 Banner.jpg";
import banner6 from "../../assets/images/banner/6Banner.jpg";
// import {
//   default as bannerImg1,
//   default as bannerImg2,
//   default as bannerImg3,
// } from "../../assets/images/banner.jpg";

const banners = [banner1, banner2, banner3, banner4, banner5, banner6];

const Banner = () => {
  return (
    <section className="h-full w-full">
      {" "}
      {/* Set specific height */}
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        navigation
        className="w-full h-full"
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover" // Use object-cover with fixed height
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
export default Banner;
