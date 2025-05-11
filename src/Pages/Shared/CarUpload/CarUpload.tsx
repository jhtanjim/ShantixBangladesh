import React, { useState } from 'react';

const CarUpload = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    mainImage: null,
    gallery: [],
    features: {
      Safety: [],
      Interior: [],
      Exterior: [],
      Special: []
    },
    specs: {
      year: new Date().getFullYear(),
      fuel: '',
      exteriorColor: '',
      engineCC: '',
      mileage: '',
      seats: 5,
    },
    contact: {
      company: '',
      locations: [''],
      phones: [''],
      email: ''
    },
    price: {
      usd: '',
      priceYen: '',
    },
    reference: '',
    availability: 'AVAILABLE / UNSOLD'
  });

  // Preview state
  const [mainImagePreview, setMainImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  
  // Feature options for checkboxes
  const featureOptions = {
    Safety: ['ABS brakes', 'Safety belts', 'Emergency brake', 'Cruise control', 'Central locking', 'Airbags'],
    Interior: ['Leather seats', 'A/C Dual', 'Bluetooth', 'Cup holders', 'Remote trunk', 'Keyless start', 'TV Navigation', 'Push button'],
    Exterior: ['Fog lights', 'LED headlights', 'Alloy wheels', 'Sun roof', 'Spoiler'],
    Special: ['Park assist', 'Backup camera', 'Push start', 'Keyless doors', 'Lane assist']
  };
  
  // Transmission options
  const transmissionOptions = ['Automatic', 'Manual', 'CVT', 'Semi-automatic'];
  
  // Fuel options
  const fuelOptions = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'Hybrid/Petrol'];
  
  // Color options
  const colorOptions = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray', 'Brown', 'Green', 'Pearl White'];
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested properties
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle checkbox changes for features
  const handleFeatureChange = (category, feature, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [category]: [...formData.features[category], feature]
        }
      });
    } else {
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [category]: formData.features[category].filter(item => item !== feature)
        }
      });
    }
  };
  
  // Handle main thumbnail upload
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setMainImagePreview(reader.result);
        setFormData({
          ...formData,
          mainImage: file
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle gallery images upload
  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      // Preview images
      const newPreviews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          newPreviews.push(reader.result);
          if (newPreviews.length === files.length) {
            setGalleryPreviews([...galleryPreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
      
      // Update form data
      setFormData({
        ...formData,
        gallery: [...formData.gallery, ...files]
      });
    }
  };
  
  // Handle dynamic location fields
  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.contact.locations];
    newLocations[index] = value;
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        locations: newLocations
      }
    });
  };
  
  // Add new location field
  const addLocationField = () => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        locations: [...formData.contact.locations, '']
      }
    });
  };
  
  // Remove location field
  const removeLocationField = (index) => {
    const newLocations = [...formData.contact.locations];
    newLocations.splice(index, 1);
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        locations: newLocations
      }
    });
  };
  
  // Handle dynamic phone fields
  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.contact.phones];
    newPhones[index] = value;
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phones: newPhones
      }
    });
  };
  
  // Add new phone field
  const addPhoneField = () => {
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phones: [...formData.contact.phones, '']
      }
    });
  };
  
  // Remove phone field
  const removePhoneField = (index) => {
    const newPhones = [...formData.contact.phones];
    newPhones.splice(index, 1);
    setFormData({
      ...formData,
      contact: {
        ...formData.contact,
        phones: newPhones
      }
    });
  };
  
  // Remove gallery image
  const removeGalleryImage = (index) => {
    const newGallery = [...formData.gallery];
    newGallery.splice(index, 1);
    
    const newPreviews = [...galleryPreviews];
    newPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      gallery: newGallery
    });
    setGalleryPreviews(newPreviews);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create FormData for file uploads
    const submissionData = new FormData();
    
    // Append text data as JSON
    const jsonData = { ...formData };
    delete jsonData.mainImage;
    delete jsonData.gallery;
    
    submissionData.append('data', JSON.stringify(jsonData));
    
    // Append files
    if (formData.mainImage) {
      submissionData.append('mainImage', formData.mainImage);
    }
    
    formData.gallery.forEach((file, index) => {
      submissionData.append(`gallery[${index}]`, file);
    });
    
    // Here you would typically send submissionData to your backend
    console.log('Form submitted:', submissionData);
    alert('Car listing submitted successfully!');
    
    // Reset form (optional)
    // setFormData({...initial state});
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Car Listing</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number</label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. JP-123456"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="AVAILABLE / UNSOLD">AVAILABLE / UNSOLD</option>
                <option value="SOLD">SOLD</option>
                <option value="RESERVED">RESERVED</option>
                <option value="PENDING">PENDING</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Images Upload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          
          {/* Main Thumbnail */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Main Thumbnail Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />
              {mainImagePreview && (
                <div className="relative w-24 h-24">
                  <img src={mainImagePreview} alt="Main thumbnail preview" className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => {
                      setMainImagePreview('');
                      setFormData({...formData, mainImage: null});
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Multiple)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            
            {galleryPreviews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {galleryPreviews.map((preview, index) => (
                  <div key={index} className="relative w-full h-24">
                    <img src={preview} alt={`Gallery preview ${index + 1}`} className="w-full h-full object-cover rounded" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Specifications */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <input
                type="number"
                name="specs.year"
                value={formData.specs.year}
                onChange={handleInputChange}
                min="1900"
                max="2030"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
              <select
                name="specs.fuel"
                value={formData.specs.fuel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Fuel Type</option>
                {fuelOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exterior Color</label>
              <select
                name="specs.exteriorColor"
                value={formData.specs.exteriorColor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Color</option>
                {colorOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Engine CC</label>
              <input
                type="text"
                name="specs.engineCC"
                value={formData.specs.engineCC}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 2,700 CC"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mileage</label>
              <input
                type="text"
                name="specs.mileage"
                value={formData.specs.mileage}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 20,000 KM"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
              <input
                type="number"
                name="specs.seats"
                value={formData.specs.seats}
                onChange={handleInputChange}
                min="1"
                max="15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Features */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          
          {Object.keys(featureOptions).map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-lg font-medium mb-2">{category} Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {featureOptions[category].map(feature => (
                  <div key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`feature-${category}-${feature}`}
                      checked={formData.features[category].includes(feature)}
                      onChange={(e) => handleFeatureChange(category, feature, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`feature-${category}-${feature}`} className="ml-2 block text-sm text-gray-700">
                      {feature}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Pricing */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  name="price.usd"
                  value={formData.price.usd}
                  onChange={handleInputChange}
                  className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (JPY)</label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">¥</span>
                </div>
                <input
                  type="text"
                  name="priceYen"
                  value={formData.priceYen}
                  onChange={handleInputChange}
                  className="pl-7 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 389,000"
                />
              </div>
            </div>
          </div>
        </div>
        

  
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Submit Car Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default CarUpload;