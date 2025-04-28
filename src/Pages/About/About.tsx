import React from 'react';
import bannerImg from "../../assets/images/aboutBanner.jpg"
  import coverImg from "../../assets/images/aboutcover.jpg"
interface AboutProps {}

const About: React.FC<AboutProps> = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="py-4 bg-white">
        <h1 className="font-extrabold text-center text-red-600 text-3xl sm:text-4xl md:text-6xl lg:text-6xl mb-2 md:mb-4">
          About Us
        </h1>
      </div>

      {/* Banner Image */}
      <div className="w-full">
        <img 
          src={bannerImg}
          alt="Office space with people working" 
          className="w-full h-64 md:h-80 lg:h-[602px] object-cover"
        />
      </div>

      {/* Content Section */}

      <div className="container mx-auto my-12 px-4">
  <div className="flex flex-col-reverse lg:flex-row items-center gap-">
    
    {/* Left Side */}

    <div className="w-full lg:w-[30%] flex justify-center">
      <img src={coverImg} alt="Cover" className="h-[400px] md:h-[500px] lg:h-[570px] w-[400px]" />
    </div>
    {/* ?right */}
    <div className="w-full lg:w-[70%] text-center lg:text-left">
      
      <p className="text-lg font-semibol md:text-3xl mt-4">
      Lorem ipsum dolor sit amet consectetur. Gravida ac elementum consectetur odio. Sagittis viverra orci nibh imperdiet. Cum enim ac est est felis nibh. Volutpat sed aliquam faucibus donec. Volutpat cras at quam consequat neque libero consectetur nullam. Ipsum ultrices justo aliquam augue nunc donec. Tincidunt erat consequat libero cursus volutpat imperdiet. Porttitor id velit cursus volutpat risus aliquam. Egestas mattis nulla lacus quam.
      </p>

     
    </div>

    {/* Right Side */}
    

  </div>
  <p className="text-lg font-semibol md:text-3xl mt-4">
      Lorem ipsum dolor sit amet consectetur. Gravida ac elementum consectetur odio. Sagittis viverra orci nibh imperdiet. Cum enim ac est est felis nibh. Volutpat sed aliquam faucibus donec. Volutpat cras at quam consequat neque libero consectetur nullam. Ipsum ultrices justo aliquam augue nunc donec. Tincidunt erat consequat libero cursus volutpat imperdiet. Porttitor id velit cursus volutpat risus aliquam. Egestas mattis nulla lacus quam.
      </p>
</div>
     
    </div>
  );
};

export default About;