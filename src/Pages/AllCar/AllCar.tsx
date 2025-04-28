import { useState } from 'react';
import SelectField from "../../components/ui/SelectField";
import Button from "../../components/ui/Button";

// Define the car listing type to avoid property errors
interface CarListing {
  id: number;
  title: string;
  imageUrl: string;
  engineCC: string;
  mileage: string;
  features: string[];
  originalPrice: string;
  discountedPrice: string;
  availability: string;
  price?: string;
  priceYen?: string;
  reference?: string;
}

const AllCar = () => {
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    modelCode: '',
    yearFrom: '',
    yearTo: '',
    priceFrom: '',
    priceTo: '',
    type: '',
    engineCC: '',
    fuel: '',
    mileageFrom: '',
    mileageTo: '',
    country: '',
    region: '',
    color: '',
    drive: '',
    transmission: '',
    stock: '',
    keywords: ''
  });

  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('default');

  const makeOptions = [
    { value: 'toyota', label: 'Toyota' },
    { value: 'honda', label: 'Honda' },
    { value: 'nissan', label: 'Nissan' },
    { value: 'mazda', label: 'Mazda' }
  ];

  const modelOptions = [
    { value: 'alphard', label: 'Alphard' },
    { value: 'corolla', label: 'Corolla' },
    { value: 'camry', label: 'Camry' }
  ];

  const yearOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `${2025 - i}`,
    label: `${2025 - i}`
  }));

  const carListings: CarListing[] = [
    {
      id: 1,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD",
      price: "2,563.67",
      priceYen: "389,000",
      reference: "JP-123456"
    },
    {
      id: 2,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD",
      price: "2,563.67",
      priceYen: "389,000",
      reference: "JP-123457"
    },
    {
      id: 3,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD",
      price: "2,563.67",
      priceYen: "389,000",
      reference: "JP-123458"
    },
    {
      id: 4,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD",
      price: "2,563.67",
      priceYen: "389,000",
      reference: "JP-123459"
    },
    {
      id: 5,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD",
      price: "2,563.67",
      priceYen: "389,000",
      reference: "JP-123460"
    }
  ];

  const placeholderText = Array(20).fill("Lorem Ipsum");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Search params:', searchParams);
  };

  const handleReset = () => {
    setSearchParams({
      make: '',
      model: '',
      modelCode: '',
      yearFrom: '',
      yearTo: '',
      priceFrom: '',
      priceTo: '',
      type: '',
      engineCC: '',
      fuel: '',
      mileageFrom: '',
      mileageTo: '',
      country: '',
      region: '',
      color: '',
      drive: '',
      transmission: '',
      stock: '',
      keywords: ''
    });
  };

  const handlePageChange = (page: number) => {
    // Implementation for page change functionality
    console.log(`Navigating to page ${page}`);
  };

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-red-600 mb-6 md:text-start text-center">
            Find Japanese Used Cars
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              {/* Form Fields */}
              <SelectField id="make" name="make" value={searchParams.make} onChange={handleSelectChange} options={makeOptions} placeholder="Select Make" />
              <SelectField id="model" name="model" value={searchParams.model} onChange={handleSelectChange} options={modelOptions} placeholder="All Model" />
              <SelectField id="modelCode" name="modelCode" value={searchParams.modelCode} onChange={handleSelectChange} options={[]} placeholder="All Model Code" />
              <SelectField id="yearFrom" name="yearFrom" value={searchParams.yearFrom} onChange={handleSelectChange} options={yearOptions} placeholder="Year From" />
              <SelectField id="yearTo" name="yearTo" value={searchParams.yearTo} onChange={handleSelectChange} options={yearOptions} placeholder="Year To" />
              <SelectField id="priceFrom" name="priceFrom" value={searchParams.priceFrom} onChange={handleSelectChange} options={[]} placeholder="Price From" />
              <SelectField id="priceTo" name="priceTo" value={searchParams.priceTo} onChange={handleSelectChange} options={[]} placeholder="Price To" />
              <SelectField id="type" name="type" value={searchParams.type} onChange={handleSelectChange} options={[]} placeholder="Select Type" />
              <SelectField id="engineCC" name="engineCC" value={searchParams.engineCC} onChange={handleSelectChange} options={[]} placeholder="Select Engine CC" />
              <SelectField id="fuel" name="fuel" value={searchParams.fuel} onChange={handleSelectChange} options={[]} placeholder="Select Fuel" />
              <SelectField id="mileageFrom" name="mileageFrom" value={searchParams.mileageFrom} onChange={handleSelectChange} options={[]} placeholder="Mileage From" />
              <SelectField id="mileageTo" name="mileageTo" value={searchParams.mileageTo} onChange={handleSelectChange} options={[]} placeholder="Mileage To" />
              <SelectField id="country" name="country" value={searchParams.country} onChange={handleSelectChange} options={[]} placeholder="By Country" />
              <SelectField id="region" name="region" value={searchParams.region} onChange={handleSelectChange} options={[]} placeholder="Select Region" />
              <SelectField id="color" name="color" value={searchParams.color} onChange={handleSelectChange} options={[]} placeholder="Select Color" />
              <SelectField id="drive" name="drive" value={searchParams.drive} onChange={handleSelectChange} options={[]} placeholder="Select Drive" />
              <SelectField id="transmission" name="transmission" value={searchParams.transmission} onChange={handleSelectChange} options={[]} placeholder="Transmission" />
              <SelectField id="stock" name="stock" value={searchParams.stock} onChange={handleSelectChange} options={[]} placeholder="Stock" />

              {/* Text input */}
              <input
                type="text"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleInputChange}
                placeholder="Search by Keywords"
                className="border p-2 rounded w-full bg-white"
              />

              <button
                type="button"
                className="bg-gray-200 text-black font-medium py-2 px-4 rounded hover:bg-gray-300 w-full"
              >
                Best Offers
              </button>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-wrap gap-4 items-center justify-center mt-6 p-4">
              <div className="bg-gray-300 text-black font-medium py-2 px-10 rounded">
                <h1 className="text-xl font-bold">All</h1>
              </div>

              <div className="text-gray-600 font-medium">Show Results</div>

              <Button>Search</Button>

              <div>or</div>

              <button
                type="button"
                onClick={handleReset}
                className="text-red-600 font-medium hover:text-red-700"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      <div className="container mx-auto px-4 py-6">
        {/* Pagination and View Controls */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center gap-1">
            {/* Page Numbers */}
            <span className="bg-red-600 text-white px-3 py-1 text-sm">1</span>
            {[2, 3, 4, 5, 6, 7, 8, 9].map(page => (
              <span 
                key={page} 
                className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </span>
            ))}
            <span className="px-3 py-1 text-sm">...</span>
            <span 
              className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300"
              onClick={() => handlePageChange(2)}
            >
              Next
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <button 
                className={`border p-1 ${viewType === 'list' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setViewType('list')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M2 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
              <button 
                className={`border p-1 ${viewType === 'grid' ? 'bg-gray-200' : 'bg-white'}`}
                onClick={() => setViewType('grid')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button 
                className="border p-1 bg-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 4zm0 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8zm0 4a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5z"/>
                </svg>
              </button>
            </div>
            <select className="border p-1 text-sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Sort By: Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Main Content Area with Sidebar and Car Listings */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Sidebar */}
          <div className="md:w-1/5">
            <div className="bg-gray-200 py-2 px-4 mb-2 font-semibold text-center">
              All
            </div>
            <div className="border border-gray-300">
              {placeholderText.map((text, index) => (
                <div key={index} className="border-b border-gray-300 py-2 px-4 text-xs text-gray-500">
                  {text}
                </div>
              ))}
            </div>
          </div>
          
          {/* Car Listings */}
          <div className="md:w-4/5">
            <div className="space-y-6">
              {carListings.map((car, index) => (
                <div key={car.id} className={`border bg-white ${index === 1 ? 'ring-2 ring-blue-400' : ''}`}>
                  <div className="flex flex-col md:flex-row">
                    {/* Car Image Section */}
                    <div className="md:w-[30%]">
                      <img 
                        src={car.imageUrl} 
                        alt={car.title} 
                        className="w-full h-full object-cover p-4"
                      />
                    </div>
                    
                    {/* Car Details Section */}
                    <div className="md:w-[70%] p-4">
                      <div className="flex justify-between items-start">
                        {/* Car Title */}
                        <h2 className="text-2xl font-bold">{car.title}</h2>
                        
                        {/* Price Information */}
                        <div className="text-right">
                          <p className="text-red-600 font-bold">FOB: {car.price} USD</p>
                          <p className="text-red-600">{car.priceYen} YEN</p>
                        </div>
                      </div>
                      
                      {/* Specs Grid */}
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-100 p-2">
                          <p className="text-xs text-gray-600">Engine Capacity</p>
                          <p className="font-bold text-lg">{car.engineCC}</p>
                        </div>
                        <div className="bg-gray-100 p-2">
                          <p className="text-xs text-gray-600">Mileage</p>
                          <p className="font-bold text-lg">{car.mileage}</p>
                        </div>
                      </div>
                      
                      {/* Availability and Ref */}
                      <div className="mt-2">
                        <p className="text-green-600 font-medium">Now On Sale</p>
                        <p className="text-gray-600 text-sm">Ref#{car.reference}</p>
                      </div>
                      
                      {/* Features Tags */}
                      <div className="flex flex-wrap gap-3 mt-4">
                        <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-md text-sm">G/hv</span>
                        <span className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-md text-sm">Automatic</span>
                        <span className="bg-green-100 text-green-800 px-4 py-1 rounded-md text-sm">Right Hand</span>
                        
                        <div className="flex items-center gap-2 ml-auto mt-2 md:mt-0">
                          <button className="flex items-center gap-1 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M9 5.5a.5.5 0 0 0-1 0V7H6.5a.5.5 0 0 0 0 1H8v1.5a.5.5 0 0 0 1 0V8h1.5a.5.5 0 0 0 0-1H9V5.5z"/>
                              <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zm3.915 10L3.102 4h10.796l-1.313 7h-8.17zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                            </svg>
                            <span>Compare</span>
                          </button>
                          <button className="flex items-center gap-1 text-sm ml-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                            </svg>
                            <span>Add to Wishlist</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex justify-end gap-3 mt-4">
                        <button className="bg-red-600 text-white px-6 py-2 rounded">More Details</button>
                        <button className="bg-red-600 text-white px-6 py-2 rounded">Contact Us</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-1">
            <span className="bg-red-600 text-white px-3 py-1 text-sm">1</span>
            {[2, 3, 4, 5, 6, 7, 8, 9].map(page => (
              <span 
                key={`bottom-${page}`} 
                className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </span>
            ))}
            <span className="px-3 py-1 text-sm">...</span>
            <span 
              className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300"
              onClick={() => handlePageChange(2)}
            >
              Next
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCar;