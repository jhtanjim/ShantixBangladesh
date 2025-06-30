"use client";

import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "./Banner";
import FixedPriceStock from "./FixedPriceStock/FixedPriceStock";
import LowCostStock from "./LowCostStock/LowCostStock";
import NewArrival from "./NewArrival/NewArrival";
import Partner from "./Partner";
import Services from "./Services";

import { useAllCars } from "../../hooks/useCars";

// Import your assets
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import banner2 from "../../assets/images/Banner2.jpg";
import coverImg from "../../assets/images/cover.jpg";
import logoImg from "../../assets/images/logo.png";
import Card from "../../components/card/Card";
import SearchFilter from "../Shared/SearchFilter/SearchFilter";

const Home = () => {
  const [filteredCars, setFilteredCars] = useState([]);
  const [searchKey, setSearchKey] = useState(0);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const location = useLocation();

  // Get cars data from the hook
  const { data: allCars = [], isLoading, error } = useAllCars();

  const handleFilteredCars = (filtered) => {
    setFilteredCars(filtered);
    setShowSearchResults(filtered.length > 0);
    setSearchKey((prev) => prev + 1); // Force re-render
  };

  const handleAddToCart = (car) => {
    // Implement add to cart functionality
    console.log("Added to cart:", car);
  };

  const handleAddToWishlist = (car) => {
    // Implement add to wishlist functionality
    console.log("Added to wishlist:", car);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">
          Error loading cars: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Banner />

      {/* Search Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <SearchFilter cars={allCars} onFilteredCars={handleFilteredCars} />
      </div>

      {/* Search Results Section */}
      {showSearchResults && (
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Search Results
            </h2>
            <p className="text-gray-600">
              Found {filteredCars.length} car
              {filteredCars.length !== 1 ? "s" : ""} matching your criteria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCars.map((car) => (
              <Card
                key={`${car.id}-${searchKey}`}
                id={car.id}
                imageUrl={car.mainImage}
                imageAlt={car.title}
                year={car.year}
                title={car.title}
                price={car.price}
                status={car.status}
                priceLabel="USD"
                fuel={car.fuel || "N/A"}
                exteriorColor={car.exteriorColor || "N/A"}
                seats={car.seats || 4}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                isInCart={false}
                isInWishlist={false}
              />
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-xl mb-4">
                No cars found matching your search criteria
              </div>
              <p className="text-gray-400">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>
      )}

      {/* Other Sections - Only show when no search results are being displayed */}
      {!showSearchResults && (
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
                  Shantix Corporation Japan is a leading exporter of premium
                  Japanese used vehicles and auto parts, delivering excellence
                  to customers around the world. Headquartered in Japan, we
                  specialize in the export of high-quality Right-Hand Drive
                  (RHD) and Left-Hand Drive (LHD) vehicles to a wide range of
                  international markets.
                </p>
                <Link to={"/about"}>
                  <button className=" cursor-pointer mt-6 bg-dark-blue text-white px-6 py-3 rounded-md hover:bg-red-700 text-xl font-semibold">
                    Read More
                  </button>
                </Link>
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
