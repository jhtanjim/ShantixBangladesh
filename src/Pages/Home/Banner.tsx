

import bannerImg from "../../assets/images/banner.jpg";


const Banner = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[500px] w-full bg-black">
        <img 
          src={bannerImg} 
          alt="Hero Car Image" 
          className="h-full opacity-60 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center">
          <div className="container mx-auto px-4">
            <div className="text-end">
              <h1 className="font-extrabold text-white text-3xl sm:text-4xl md:text-6xl lg:text-8xl mb-2 md:mb-4">
                Fixed Price
              </h1>
              <p className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px white',
                }}>
                Stock
              </p>
              {/* <Button variant="primary" size="lg">
                View Details
              </Button> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Banner;