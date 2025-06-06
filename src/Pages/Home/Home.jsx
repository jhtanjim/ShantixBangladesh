"use client";

import { useState } from "react";
import Banner from "./Banner";
import FixedPriceStock from "./FixedPriceStock/FixedPriceStock";
import LowCostStock from "./LowCostStock/LowCostStock";
import NewArrival from "./NewArrival/NewArrival";
import Services from "./Services";
import Partner from "./Partner";

import { useAllCars } from "../../hooks/useCars";

// Import your assets
import banner2 from "../../assets/images/Banner2.jpg";
import logoImg from "../../assets/images/logo.png";
import coverImg from "../../assets/images/cover.jpg";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import SearchFilter from "../Shared/SearchFilter/SearchFilter";

const Home = () => {
  const [filteredCars, setFilteredCars] = useState([]);

  const {
    data: carsResponse,
    isLoading,
    error,
  } = useAllCars({
    page: 1,
    limit: 20,
  });

  // Handle filtered results from SearchFilter
  const handleFilteredResults = (results) => {
    setFilteredCars(results);
  };

  return (
    <div>
      <Banner />

      {/* Search Filter Section */}
      <div className="container mx-auto px-4 my-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center mb-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading cars...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">Error loading cars: {error.message}</p>
          </div>
        )}

        {/* Search Filter Component */}
        {!isLoading && !error && (
          <SearchFilter
            carsResponse={carsResponse || []}
            onFilteredResults={handleFilteredResults}
          />
        )}

        {/* No Cars Available State */}
        {!isLoading && !error && carsResponse && carsResponse.length === 0 && (
          <div className="text-center bg-gray-50 rounded-lg p-8 mb-8">
            <p className="text-gray-600 text-lg">
              No cars available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* Other Sections - Only show when no search results are being displayed */}
      {filteredCars.length === 0 && (
        <>
          <FixedPriceStock />
          <LowCostStock />
          <NewArrival />

          {/* Banner Section */}
          <div className="relative w-full min-h-[620px] bg-black overflow-hidden my-40">
            <img
              src={banner2 || "/placeholder.svg"}
              alt="Background"
              className="w-full h-[700px] opacity-30 absolute top-0 left-0"
            />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center h-full px-6 md:px-30 py-10">
              {/* Left Side */}
              <div className="flex flex-col md:mt-80 md:flex-row items-center text-white space-y-4 md:space-y-0 md:space-x-4">
                <div className="p-4 rounded-md">
                  <IoShieldCheckmarkOutline className="text-white text-8xl md:text-[150px]" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-2xl md:text-4xl font-semibold">
                    Your Trusted Partner
                  </p>
                  <h1
                    className="text-4xl md:text-7xl font-bold"
                    style={{ letterSpacing: "2px" }}
                  >
                    20 YEARS
                  </h1>
                </div>
              </div>

              {/* Right Side */}
              <div className="text-center mt-10 md:mt-0 mb-10 md:mb-30">
                <h1 className="text-3xl md:text-7xl font-bold text-white">
                  I Want To Explore
                </h1>
                <h1 className="text-2xl md:text-6xl font-bold text-blue-400 mt-2">
                  Trusted Exported
                </h1>
                <img
                  src={logoImg || "/placeholder.svg"}
                  alt="Shantix Logo"
                  className="w-40 md:w-90 mx-auto mt-4"
                />
              </div>
            </div>
          </div>

          {/* Welcome Section */}
          <div className="container mx-auto my-12 px-4">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
              {/* Left Side */}
              <div className="w-full lg:w-[60%] text-center lg:text-left">
                <h1 className="text-4xl md:text-6xl lg:text-7xl">Welcome to</h1>
                <h1 className="text-red uppercase font-extrabold text-5xl md:text-7xl lg:text-8xl my-2">
                  SHANTIX
                </h1>
                <p className="text-lg md:text-2xl mt-4">
                  Lorem ipsum dolor sit amet consectetur. Lectus nibh morbi non
                  proin dui ut. Vel vestibulum dolor sagittis pulvinar felis ac.
                  Ullamcorper non dictum in ullamcorper eros vel viverra.
                  Venenatis magna lacus malesuada proin quam parturient viverra
                  tellus.
                </p>

                <button className="mt-6 bg-dark-blue text-white px-6 py-3 rounded-md hover:bg-red-700 text-xl font-semibold">
                  Read More
                </button>
              </div>

              {/* Right Side */}
              <div className="w-full lg:w-[40%] flex justify-center">
                <img
                  src={coverImg || "/placeholder.svg"}
                  alt="Cover"
                  className="h-[400px] md:h-[500px] lg:h-[570px] w-auto"
                />
              </div>
            </div>
          </div>

          <Services />
          <Partner />
        </>
      )}
    </div>
  );
};

export default Home;
