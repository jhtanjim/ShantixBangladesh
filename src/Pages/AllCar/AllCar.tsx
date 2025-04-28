import  { useState } from 'react';
import SelectField from "../../components/ui/SelectField";
import Button from "../../components/ui/Button";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('default');

  // Sample data for dropdowns
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

  // Sample car listings
  const carListings = [
    {
      id: 1,
      title: "Toyota Alphard",
      imageUrl: "https://i.ibb.co.com/n8Z1cbfC/eb4e98ce47207f48f662d0c29c9532fc191176c6.jpg",
      engineCC: "2,700 CC",
      mileage: "20,000 KM",
      features: ["RHD", "Automatic", "Hybrid/Petrol"],
      originalPrice: "FOB: JP ¥389,000",
      discountedPrice: "(US$2,563.67)",
      availability: "AVAILABLE / UNSOLD"
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
      availability: "AVAILABLE / UNSOLD"
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
      availability: "AVAILABLE / UNSOLD"
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
      availability: "AVAILABLE / UNSOLD"
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
      availability: "AVAILABLE / UNSOLD"
    }
  ];

  // Dummy placeholder text for the sidebar
  const placeholderText = Array(20).fill("Lorem Ipsum");

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle search submission
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

  return (
    <div>
      {/* Filter Section */}
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-4xl font-bold uppercase text-red-600 mb-6 md:text-start text-center">Find Japanese Used Cars</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
              {/* Form Fields */}
              <SelectField id="make" name="make" value={searchParams.make} onChange={handleChange} options={makeOptions} placeholder="Select Make" />
              <SelectField id="model" name="model" value={searchParams.model} onChange={handleChange} options={modelOptions} placeholder="All Model" />
              <SelectField id="modelCode" name="modelCode" value={searchParams.modelCode} onChange={handleChange} options={[]} placeholder="All Model Code" />
              <SelectField id="yearFrom" name="yearFrom" value={searchParams.yearFrom} onChange={handleChange} options={yearOptions} placeholder="Year From" />
              <SelectField id="yearTo" name="yearTo" value={searchParams.yearTo} onChange={handleChange} options={yearOptions} placeholder="Year To" />
              <SelectField id="priceFrom" name="priceFrom" value={searchParams.priceFrom} onChange={handleChange} options={[]} placeholder="Price From" />
              <SelectField id="priceTo" name="priceTo" value={searchParams.priceTo} onChange={handleChange} options={[]} placeholder="Price To" />
              <SelectField id="type" name="type" value={searchParams.type} onChange={handleChange} options={[]} placeholder="Select Type" />
              <SelectField id="engineCC" name="engineCC" value={searchParams.engineCC} onChange={handleChange} options={[]} placeholder="Select Engine CC" />
              <SelectField id="fuel" name="fuel" value={searchParams.fuel} onChange={handleChange} options={[]} placeholder="Select Fuel" />
              <SelectField id="mileageFrom" name="mileageFrom" value={searchParams.mileageFrom} onChange={handleChange} options={[]} placeholder="Mileage From" />
              <SelectField id="mileageTo" name="mileageTo" value={searchParams.mileageTo} onChange={handleChange} options={[]} placeholder="Mileage To" />
              <SelectField id="country" name="country" value={searchParams.country} onChange={handleChange} options={[]} placeholder="By Country" />
              <SelectField id="region" name="region" value={searchParams.region} onChange={handleChange} options={[]} placeholder="Select Region" />
              <SelectField id="color" name="color" value={searchParams.color} onChange={handleChange} options={[]} placeholder="Select Color" />
              <SelectField id="drive" name="drive" value={searchParams.drive} onChange={handleChange} options={[]} placeholder="Select Drive" />
              <SelectField id="transmission" name="transmission" value={searchParams.transmission} onChange={handleChange} options={[]} placeholder="Transmission" />
              <SelectField id="stock" name="stock" value={searchParams.stock} onChange={handleChange} options={[]} placeholder="Stock" />
              
              <input
                type="text"
                name="keywords"
                value={searchParams.keywords}
                onChange={handleChange}
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
              
              <Button >
                Search
              </Button>
              
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
              <span key={page} className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300">
                {page}
              </span>
            ))}
            <span className="px-3 py-1 text-sm">...</span>
            <span className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300">Next</span>
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
                  {/* Car Image */}
                  <div className="w-[30%] p-4">
                    <img src={car.imageUrl} alt={car.title} className="w-[250px] h-full rounded-lg object-cover" />
                  </div>
              
                  {/* Car Details */}
                  <div className="w-full md:w-[70%] p-4 flex flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-800 mb-2">{car.title}</h2>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {car.features.map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">{feature}</span>
                        ))}
                      </div>
                      <div className="text-gray-600 text-sm mb-2">
                        <p>Engine: {car.engineCC}</p>
                        <p>Mileage: {car.mileage}</p>
                      </div>
                    </div>
              
                    {/* Price and Status */}
                    <div className="mt-4">
                      <p className="text-red-600 font-bold">{car.originalPrice}</p>
                      <p className="text-gray-500">{car.discountedPrice}</p>
                      <p className="text-green-600 font-medium">{car.availability}</p>
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
            {[1,2,3,4,5,6,7,8,9].map(page => (
  <span 
    key={page} 
    onClick={() => setCurrentPage(page)}
    className={`px-3 py-1 text-sm cursor-pointer ${currentPage === page ? 'bg-red-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
  >
    {page}
  </span>
))}

            <span className="px-3 py-1 text-sm">...</span>
            <span className="bg-gray-200 px-3 py-1 text-sm cursor-pointer hover:bg-gray-300">Next</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCar;