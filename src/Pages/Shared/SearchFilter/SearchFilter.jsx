"use client";

import { useState } from "react";

const SearchFilter = ({ cars = [], onFilteredCars }) => {
  const [filters, setFilters] = useState({
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

  // Extract unique values for dropdowns
  const getUniqueValues = (field) => {
    const values = cars
      .map((car) => car[field])
      .filter((value) => value && value !== null && value !== "")
      .filter((value, index, self) => self.indexOf(value) === index);
    return values.sort();
  };

  const uniqueMakes = getUniqueValues("make");
  const uniqueModels = getUniqueValues("model");
  const uniqueModelCodes = getUniqueValues("modelCode");
  const uniqueTypes = getUniqueValues("type");
  const uniqueFuels = getUniqueValues("fuel");
  const uniqueTransmissions = getUniqueValues("transmission");
  const uniqueColors = getUniqueValues("exteriorColor");
  const uniqueCountries = getUniqueValues("country");
  const uniqueRegions = getUniqueValues("region");
  const uniqueDrives = getUniqueValues("drive");
  const uniqueStocks = getUniqueValues("stock");

  // Get year range
  const years = cars.map((car) => car.year).filter((year) => year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const yearOptions = [];
  for (let year = maxYear; year >= minYear; year--) {
    yearOptions.push(year);
  }

  // Get engine CC range
  const engineCCs = cars
    .map((car) => car.engineCC)
    .filter((cc) => cc && cc > 0);
  const uniqueEngineCCs = [...new Set(engineCCs)].sort((a, b) => a - b);

  // Price range options
  const priceRanges = [
    { label: "Under $5,000", value: { from: "", to: "5000" } },
    { label: "$5,000 - $10,000", value: { from: "5000", to: "10000" } },
    { label: "$10,000 - $15,000", value: { from: "10000", to: "15000" } },
    { label: "$15,000 - $20,000", value: { from: "15000", to: "20000" } },
    { label: "$20,000 - $30,000", value: { from: "20000", to: "30000" } },
    { label: "$30,000 - $50,000", value: { from: "30000", to: "50000" } },
    { label: "Above $50,000", value: { from: "50000", to: "" } },
  ];

  // Mileage range options
  const mileageRanges = [
    { label: "Under 30,000 km", value: { from: "", to: "30000" } },
    { label: "30,000 - 50,000 km", value: { from: "30000", to: "50000" } },
    { label: "50,000 - 80,000 km", value: { from: "50000", to: "80000" } },
    { label: "80,000 - 120,000 km", value: { from: "80000", to: "120000" } },
    { label: "120,000 - 200,000 km", value: { from: "120000", to: "200000" } },
    { label: "Above 200,000 km", value: { from: "200000", to: "" } },
  ];

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePriceRangeChange = (value) => {
    if (!value) {
      setFilters((prev) => ({ ...prev, priceFrom: "", priceTo: "" }));
    } else {
      const range = priceRanges.find((r) => JSON.stringify(r.value) === value);
      if (range) {
        setFilters((prev) => ({
          ...prev,
          priceFrom: range.value.from,
          priceTo: range.value.to,
        }));
      }
    }
  };

  const handleMileageRangeChange = (value) => {
    if (!value) {
      setFilters((prev) => ({ ...prev, mileageFrom: "", mileageTo: "" }));
    } else {
      const range = mileageRanges.find(
        (r) => JSON.stringify(r.value) === value
      );
      if (range) {
        setFilters((prev) => ({
          ...prev,
          mileageFrom: range.value.from,
          mileageTo: range.value.to,
        }));
      }
    }
  };

  const getCurrentPriceRange = () => {
    const current = priceRanges.find(
      (r) =>
        r.value.from === filters.priceFrom && r.value.to === filters.priceTo
    );
    return current ? JSON.stringify(current.value) : "";
  };

  const getCurrentMileageRange = () => {
    const current = mileageRanges.find(
      (r) =>
        r.value.from === filters.mileageFrom && r.value.to === filters.mileageTo
    );
    return current ? JSON.stringify(current.value) : "";
  };

  const filterCars = () => {
    const filtered = cars.filter((car) => {
      // Make filter
      if (
        filters.make &&
        car.make &&
        !car.make.toLowerCase().includes(filters.make.toLowerCase())
      ) {
        return false;
      }

      // Model filter
      if (
        filters.model &&
        car.model &&
        !car.model.toLowerCase().includes(filters.model.toLowerCase())
      ) {
        return false;
      }

      // Model Code filter
      if (
        filters.modelCode &&
        car.modelCode &&
        !car.modelCode.toLowerCase().includes(filters.modelCode.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (
        filters.type &&
        car.type &&
        car.type.toLowerCase() !== filters.type.toLowerCase()
      ) {
        return false;
      }

      // Year range filter
      if (filters.yearFrom && car.year < Number.parseInt(filters.yearFrom)) {
        return false;
      }
      if (filters.yearTo && car.year > Number.parseInt(filters.yearTo)) {
        return false;
      }

      // Price range filter
      if (filters.priceFrom && car.price < Number.parseInt(filters.priceFrom)) {
        return false;
      }
      if (filters.priceTo && car.price > Number.parseInt(filters.priceTo)) {
        return false;
      }

      // Engine CC filter
      if (
        filters.engineCC &&
        car.engineCC &&
        car.engineCC !== Number.parseInt(filters.engineCC)
      ) {
        return false;
      }

      // Fuel filter
      if (
        filters.fuel &&
        car.fuel &&
        car.fuel.toLowerCase() !== filters.fuel.toLowerCase()
      ) {
        return false;
      }

      // Mileage range filter
      if (
        filters.mileageFrom &&
        car.mileage &&
        car.mileage < Number.parseInt(filters.mileageFrom)
      ) {
        return false;
      }
      if (
        filters.mileageTo &&
        car.mileage &&
        car.mileage > Number.parseInt(filters.mileageTo)
      ) {
        return false;
      }

      // Country filter
      if (
        filters.country &&
        car.country &&
        car.country.toLowerCase() !== filters.country.toLowerCase()
      ) {
        return false;
      }

      // Region filter
      if (
        filters.region &&
        car.region &&
        car.region.toLowerCase() !== filters.region.toLowerCase()
      ) {
        return false;
      }

      // Color filter
      if (
        filters.color &&
        car.exteriorColor &&
        !car.exteriorColor.toLowerCase().includes(filters.color.toLowerCase())
      ) {
        return false;
      }

      // Drive filter
      if (
        filters.drive &&
        car.drive &&
        car.drive.toLowerCase() !== filters.drive.toLowerCase()
      ) {
        return false;
      }

      // Transmission filter
      if (
        filters.transmission &&
        car.transmission &&
        car.transmission.toLowerCase() !== filters.transmission.toLowerCase()
      ) {
        return false;
      }

      // Stock filter
      if (
        filters.stock &&
        car.stock &&
        car.stock.toLowerCase() !== filters.stock.toLowerCase()
      ) {
        return false;
      }

      // Keywords filter (search in title, make, model, keywords)
      if (filters.keywords) {
        const searchText = filters.keywords.toLowerCase();
        const searchFields = [
          car.title,
          car.make,
          car.model,
          car.keywords,
          car.modelCode,
        ]
          .filter((field) => field)
          .join(" ")
          .toLowerCase();

        if (!searchFields.includes(searchText)) {
          return false;
        }
      }

      return true;
    });

    onFilteredCars(filtered);
  };

  const resetFilters = () => {
    setFilters({
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
    onFilteredCars([]);
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
        <div className="flex items-center justify-center space-x-2">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h2 className="text-xl font-bold text-white">
            Find Japanese Used Cars
          </h2>
        </div>
      </div>

      <div className="p-6">
        {/* Keywords Search */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by keywords, make, model..."
              value={filters.keywords}
              onChange={(e) => handleFilterChange("keywords", e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Compact Filter Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
          {/* Row 1 - Main Vehicle Info */}
          <div>
            <select
              value={filters.make}
              onChange={(e) => handleFilterChange("make", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">All Brand</option>
              {uniqueMakes.map((make) => (
                <option key={make} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.model}
              onChange={(e) => handleFilterChange("model", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">All Models</option>
              {uniqueModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Vehicle Type</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.yearFrom}
              onChange={(e) => handleFilterChange("yearFrom", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Year From</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.yearTo}
              onChange={(e) => handleFilterChange("yearTo", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Year To</option>
              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={getCurrentPriceRange()}
              onChange={(e) => handlePriceRangeChange(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Price Range</option>
              {priceRanges.map((range, index) => (
                <option key={index} value={JSON.stringify(range.value)}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2 - Engine & Performance */}
          <div>
            <select
              value={filters.engineCC}
              onChange={(e) => handleFilterChange("engineCC", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Engine CC</option>
              {uniqueEngineCCs.map((cc) => (
                <option key={cc} value={cc}>
                  {cc} CC
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.fuel}
              onChange={(e) => handleFilterChange("fuel", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Fuel Type</option>
              {uniqueFuels.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.transmission}
              onChange={(e) =>
                handleFilterChange("transmission", e.target.value)
              }
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Transmission</option>
              {uniqueTransmissions.map((transmission) => (
                <option key={transmission} value={transmission}>
                  {transmission}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={getCurrentMileageRange()}
              onChange={(e) => handleMileageRangeChange(e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Mileage Range</option>
              {mileageRanges.map((range, index) => (
                <option key={index} value={JSON.stringify(range.value)}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.drive}
              onChange={(e) => handleFilterChange("drive", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Drive Type</option>
              {uniqueDrives.map((drive) => (
                <option key={drive} value={drive}>
                  {drive}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.color}
              onChange={(e) => handleFilterChange("color", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Color</option>
              {uniqueColors.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Row 3 - Location & Advanced */}
          <div>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Country</option>
              {uniqueCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.region}
              onChange={(e) => handleFilterChange("region", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Region</option>
              {uniqueRegions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.modelCode}
              onChange={(e) => handleFilterChange("modelCode", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Model Code</option>
              {uniqueModelCodes.map((code) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.stock}
              onChange={(e) => handleFilterChange("stock", e.target.value)}
              className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
            >
              <option value="">Stock Status</option>
              {uniqueStocks.map((stock) => (
                <option key={stock} value={stock}>
                  {stock}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
          <button
            onClick={filterCars}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-105 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <span>Search Cars</span>
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full sm:w-auto text-gray-600 hover:text-red-600 px-6 py-3 rounded-lg border border-gray-300 hover:border-red-300 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-500">
          <button
            onClick={filterCars}
            className="hover:text-red-600 transition-colors duration-200"
          >
            Show Results
          </button>
          <span>•</span>
          <button
            onClick={resetFilters}
            className="hover:text-red-600 transition-colors duration-200"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
