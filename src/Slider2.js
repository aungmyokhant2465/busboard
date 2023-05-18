import React from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cube";
import "swiper/css/autoplay";

import "./slider2.css";
import Image1 from "./images/image1.jpg";
import Image2 from "./images/image2.jpg";
import Image3 from "./images/image3.jpg";
import Image4 from "./images/image4.jpg";
import Image5 from "./images/image5.jpg";
import Image6 from "./images/image6.jpg";
import Image7 from "./images/image7.jpg";

// import required modules
import { EffectCube, Autoplay } from "swiper";

export default function App() {
  return (
    <>
      <Swiper
        effect={"cube"}
        grabCursor={true}
        cubeEffect={{
          shadow: true,
          slideShadows: true,
          shadowOffset: 20,
          shadowScale: 0.94,
        }}
        loop={true}
        autoplay={true}
        modules={[EffectCube, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src={Image1} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image2} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image3} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image4} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image5} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image7} />
        </SwiperSlide>
        <SwiperSlide>
          <img src={Image6} />
        </SwiperSlide>
      </Swiper>
    </>
  );
}
