"use client";

import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CarSearchForm({ onSearch, allCars = [] }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    make: "",
    model: "",
    modelCode: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    type: "",
    engineCC: "",
    fuel: "",
    mileageFrom: "",
    mileageTo: "",
    country: "",
    region: "",
    color: "",
    drive: "",
    transmission: "",
    stock: "",
    keywords: "",
  });

  // Extract unique values from allCars for dropdown options
  const getUniqueValues = (field) => {
    if (!allCars || allCars.length === 0) return [];
    const values = allCars
      .map((car) => {
        if (field === "color") return car.exteriorColor;
        return car[field];
      })
      .filter(Boolean)
      .map((value) => value.toString());
    return [...new Set(values)].sort();
  };

  const makes = getUniqueValues("make");
  const models = getUniqueValues("model");
  const modelCodes = getUniqueValues("modelCode");
  const types = getUniqueValues("type");
  const fuels = getUniqueValues("fuel");
  const countries = getUniqueValues("country");
  const regions = getUniqueValues("region");
  const colors = getUniqueValues("color");
  const drives = getUniqueValues("drive");
  const transmissions = getUniqueValues("transmission");

  // Get engine CC options from actual car data
  const engineCCs = allCars
    .map((car) => car.engineCC)
    .filter((cc) => cc && cc > 0);
  const uniqueEngineCCs = [...new Set(engineCCs)].sort((a, b) => a - b);

  // Get year range from actual data
  const years = allCars.map((car) => car.year).filter((year) => year);
  const minYear = years.length > 0 ? Math.min(...years) : 2000;
  const maxYear =
    years.length > 0 ? Math.max(...years) : new Date().getFullYear();
  const yearOptions = [];
  for (let year = maxYear; year >= minYear; year--) {
    yearOptions.push(year);
  }

  // Predefined price ranges
  const priceRanges = [
    { label: "Any Price", value: "" },
    { label: "Under $5,000", from: "", to: "5000" },
    { label: "$5,000 - $10,000", from: "5000", to: "10000" },
    { label: "$10,000 - $15,000", from: "10000", to: "15000" },
    { label: "$15,000 - $20,000", from: "15000", to: "20000" },
    { label: "$20,000 - $30,000", from: "20000", to: "30000" },
    { label: "$30,000 - $50,000", from: "30000", to: "50000" },
    { label: "$50,000 - $75,000", from: "50000", to: "75000" },
    { label: "$75,000 - $100,000", from: "75000", to: "100000" },
    { label: "Above $100,000", from: "100000", to: "" },
  ];

  // Predefined mileage ranges
  const mileageRanges = [
    { label: "Any Mileage", value: "" },
    { label: "Under 10,000 km", from: "", to: "10000" },
    { label: "10,000 - 30,000 km", from: "10000", to: "30000" },
    { label: "30,000 - 50,000 km", from: "30000", to: "50000" },
    { label: "50,000 - 80,000 km", from: "50000", to: "80000" },
    { label: "80,000 - 120,000 km", from: "80000", to: "120000" },
    { label: "120,000 - 200,000 km", from: "120000", to: "200000" },
    { label: "Above 200,000 km", from: "200000", to: "" },
  ];

  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceRangeChange = (value) => {
    if (!value) {
      setSearchParams((prev) => ({ ...prev, priceFrom: "", priceTo: "" }));
    } else {
      const range = priceRanges.find((r) => r.label === value);
      if (range && range.from !== undefined) {
        setSearchParams((prev) => ({
          ...prev,
          priceFrom: range.from,
          priceTo: range.to,
        }));
      }
    }
  };

  const handleMileageRangeChange = (value) => {
    if (!value) {
      setSearchParams((prev) => ({ ...prev, mileageFrom: "", mileageTo: "" }));
    } else {
      const range = mileageRanges.find((r) => r.label === value);
      if (range && range.from !== undefined) {
        setSearchParams((prev) => ({
          ...prev,
          mileageFrom: range.from,
          mileageTo: range.to,
        }));
      }
    }
  };

  const getCurrentPriceRange = () => {
    const current = priceRanges.find(
      (r) => r.from === searchParams.priceFrom && r.to === searchParams.priceTo
    );
    return current ? current.label : "";
  };

  const getCurrentMileageRange = () => {
    const current = mileageRanges.find(
      (r) =>
        r.from === searchParams.mileageFrom && r.to === searchParams.mileageTo
    );
    return current ? current.label : "";
  };

  const handleSearch = () => {
    onSearch(searchParams);
    // Close filter on mobile after search
    if (window.innerWidth < 768) {
      setIsFilterOpen(false);
    }
  };

  const handleReset = () => {
    const resetParams = {
      make: "",
      model: "",
      modelCode: "",
      yearFrom: "",
      yearTo: "",
      priceFrom: "",
      priceTo: "",
      type: "",
      engineCC: "",
      fuel: "",
      mileageFrom: "",
      mileageTo: "",
      country: "",
      region: "",
      color: "",
      drive: "",
      transmission: "",
      stock: "",
      keywords: "",
    };
    setSearchParams(resetParams);
    onSearch(resetParams);
  };

  const hasActiveFilters = Object.values(searchParams).some(
    (value) => value !== ""
  );

  // Close filter when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterOpen && window.innerWidth < 1024) {
        const searchContainer = document.querySelector(
          ".search-form-container"
        );
        const toggleButton = document.querySelector(".filter-toggle-button");

        if (
          searchContainer &&
          !searchContainer.contains(event.target) &&
          toggleButton &&
          !toggleButton.contains(event.target)
        ) {
          setIsFilterOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isFilterOpen]);

  // Auto-open filters on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsFilterOpen(true);
      } else {
        setIsFilterOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white shadow-lg relative w-full overflow-hidden search-form-container">
      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden px-3 sm:px-4 py-3 border-b border-gray-200">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="filter-toggle-button w-full flex items-center justify-between bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
        >
          <div className="flex items-center gap-2">
            <Filter size={18} className="sm:w-5 sm:h-5" />
            <span className="font-medium">Search Filters</span>
          </div>
          {isFilterOpen ? (
            <ChevronUp size={18} className="sm:w-5 sm:h-5" />
          ) : (
            <ChevronDown size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Search Form */}
      <div className={`${isFilterOpen ? "block" : "hidden"} lg:block bg-white`}>
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
          {/* Keywords Search - Always visible and prominent */}
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by keywords, make, model..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                value={searchParams.keywords}
                onChange={(e) => handleInputChange("keywords", e.target.value)}
              />
            </div>
          </div>

          {/* Filter Grid - Responsive layout */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Make */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Make
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.make}
                onChange={(e) => handleInputChange("make", e.target.value)}
              >
                <option value="">All Brand</option>
                {makes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>

            {/* Model */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Model
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
              >
                <option value="">All Models</option>
                {models.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Code - Now a dropdown */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Model Code
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.modelCode}
                onChange={(e) => handleInputChange("modelCode", e.target.value)}
              >
                <option value="">All Model Codes</option>
                {modelCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>

            {/* Type */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Type
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Year From */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Year From
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.yearFrom}
                onChange={(e) => handleInputChange("yearFrom", e.target.value)}
              >
                <option value="">Any Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Year To */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Year To
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.yearTo}
                onChange={(e) => handleInputChange("yearTo", e.target.value)}
              >
                <option value="">Any Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range - Single dropdown */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Price Range
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={getCurrentPriceRange()}
                onChange={(e) => handlePriceRangeChange(e.target.value)}
              >
                {priceRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Engine CC - Now a dropdown */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Engine CC
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.engineCC}
                onChange={(e) => handleInputChange("engineCC", e.target.value)}
              >
                <option value="">Any Engine CC</option>
                {uniqueEngineCCs.map((cc) => (
                  <option key={cc} value={cc}>
                    {cc} CC
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Fuel Type
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.fuel}
                onChange={(e) => handleInputChange("fuel", e.target.value)}
              >
                <option value="">All Fuel Types</option>
                {fuels.map((fuel) => (
                  <option key={fuel} value={fuel}>
                    {fuel}
                  </option>
                ))}
              </select>
            </div>

            {/* Mileage Range - Single dropdown */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Mileage Range
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={getCurrentMileageRange()}
                onChange={(e) => handleMileageRangeChange(e.target.value)}
              >
                {mileageRanges.map((range) => (
                  <option key={range.label} value={range.label}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Country
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.country}
                onChange={(e) => handleInputChange("country", e.target.value)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Region */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Region
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
              >
                <option value="">All Regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Color
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.color}
                onChange={(e) => handleInputChange("color", e.target.value)}
              >
                <option value="">All Colors</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Drive */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Drive
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.drive}
                onChange={(e) => handleInputChange("drive", e.target.value)}
              >
                <option value="">All Drive Types</option>
                {drives.map((drive) => (
                  <option key={drive} value={drive}>
                    {drive}
                  </option>
                ))}
              </select>
            </div>

            {/* Transmission */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Transmission
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.transmission}
                onChange={(e) =>
                  handleInputChange("transmission", e.target.value)
                }
              >
                <option value="">All Transmissions</option>
                {transmissions.map((transmission) => (
                  <option key={transmission} value={transmission}>
                    {transmission}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="min-w-0">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 truncate">
                Stock Status
              </label>
              <select
                className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm bg-white"
                value={searchParams.stock}
                onChange={(e) => handleInputChange("stock", e.target.value)}
              >
                <option value="">All Stock Status</option>
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
                <option value="In Stock">In Stock</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 justify-center mb-4">
            <button
              onClick={handleSearch}
              className="bg-red-600 hover:bg-red-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Search size={16} className="sm:w-5 sm:h-5" />
              Search Cars
            </button>
            <button
              onClick={handleReset}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <X size={16} className="sm:w-5 sm:h-5" />
              Clear Filters
            </button>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Active Filters:</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(searchParams).map(([key, value]) => {
                  if (!value) return null;
                  let displayValue = value;
                  if (key === "priceFrom" || key === "priceTo") {
                    displayValue = getCurrentPriceRange();
                    if (key === "priceTo" && getCurrentPriceRange())
                      return null;
                  }
                  if (key === "mileageFrom" || key === "mileageTo") {
                    displayValue = getCurrentMileageRange();
                    if (key === "mileageTo" && getCurrentMileageRange())
                      return null;
                  }
                  return (
                    <span
                      key={key}
                      className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full"
                    >
                      {key
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())}
                      : {displayValue}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
