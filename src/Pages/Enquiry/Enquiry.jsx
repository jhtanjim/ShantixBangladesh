import React, { useState } from "react";
import SelectField from "../../components/ui/SelectField";
import Swal from "sweetalert2";
import { useCreateInquiry } from "../../hooks/useInquiry";

const Enquiry = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    steering: "RIGHT_HAND",
    yearFrom: "",
    yearTo: "",
    country: "",
    port: "",
    email: "",
    mobile: "",
    customerType: "INDIVIDUAL",
    message: "",
    inquiryType: "CAR"
  });

  const createInquiryMutation = useCreateInquiry();

  // Generate year options (from 1990 to current year + 2)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1990;
    const endYear = currentYear + 2;
    
    const options = [{ value: "", label: "Select Year" }];
    
    for (let year = endYear; year >= startYear; year--) {
      options.push({ value: year.toString(), label: year.toString() });
    }
    
    return options;
  };

  const yearOptions = generateYearOptions();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "US", label: "United States" },
    { value: "JP", label: "Japan" },
    { value: "UK", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
    { value: "BD", label: "Bangladesh" },
    { value: "IN", label: "India" },
    { value: "MY", label: "Malaysia" },
    { value: "TH", label: "Thailand" },
    { value: "SG", label: "Singapore" }
  ];

  const validateForm = () => {
    const requiredFields = ['country', 'email', 'mobile', 'inquiryType', 'customerType'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: `Please fill in: ${missingFields.join(', ')}`,
        confirmButtonColor: '#dc2626'
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#dc2626'
      });
      return false;
    }

    // Year validation
    if (formData.yearFrom && formData.yearTo) {
      const yearFrom = parseInt(formData.yearFrom);
      const yearTo = parseInt(formData.yearTo);
      
      if (yearFrom > yearTo) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Year Range',
          text: 'Year From cannot be greater than Year To',
          confirmButtonColor: '#dc2626'
        });
        return false;
      }
    }

    return true;
  };

  const submitInquiry = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      // Show loading
      Swal.fire({
        title: 'Submitting Inquiry...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      // Prepare data for API
      const apiData = {
        ...formData,
        yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : undefined,
        yearTo: formData.yearTo ? parseInt(formData.yearTo) : undefined,
      };

      // Remove empty fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === "" || apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      await createInquiryMutation.mutateAsync(apiData);

      // Success message
      Swal.fire({
        icon: 'success',
        title: 'Inquiry Submitted Successfully!',
        text: 'We will get back to you within 24 hours with the best offers.',
        confirmButtonColor: '#059669',
        timer: 3000,
        timerProgressBar: true
      });

      // Reset form
      setFormData({
        make: "",
        model: "",
        steering: "RIGHT_HAND",
        yearFrom: "",
        yearTo: "",
        country: "",
        port: "",
        email: "",
        mobile: "",
        customerType: "INDIVIDUAL",
        message: "",
        inquiryType: "CAR"
      });

    } catch (error) {
      console.error('Inquiry submission error:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: error.response?.data?.message || 'Something went wrong. Please try again.',
        confirmButtonColor: '#dc2626'
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <div className="container mx-auto pt-6 pb-4 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold uppercase">
            <span className="text-blue-600">SEND YOUR</span> <span className="text-black">INQUIRY</span>
          </h1>
          <h2 className="text-3xl font-bold text-red-600 uppercase">BEST DEAL !!</h2>
          <p className="mt-2 text-lg font-semibold">VEHICLE INQUIRY FORM</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Enter Make (Ex: Toyota)"
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Model</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Enter Model (Ex: Corolla)"
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Steering</label>
              <div className="col-span-2 flex flex-wrap gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "RIGHT_HAND"}
                    onChange={() => handleRadioChange("steering", "RIGHT_HAND")}
                    className="mr-1"
                  />
                  <span>Right Hand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "LEFT_HAND"}
                    onChange={() => handleRadioChange("steering", "LEFT_HAND")}
                    className="mr-1"
                  />
                  <span>Left Hand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "ANY"}
                    onChange={() => handleRadioChange("steering", "ANY")}
                    className="mr-1"
                  />
                  <span>Any</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Year</label>
              <div className="col-span-2 grid grid-cols-2 gap-2">
                <SelectField
                  name="yearFrom"
                  value={formData.yearFrom}
                  onChange={handleChange}
                  options={yearOptions}
                  placeholder="Year From"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <SelectField
                  name="yearTo"
                  value={formData.yearTo}
                  onChange={handleChange}
                  options={yearOptions}
                  placeholder="Year To"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-start">
              <label className="font-medium pt-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write 0-250 words"
                rows={4}
                maxLength={250}
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Country <span className="text-red-500">*</span></label>
              <div className="col-span-2">
                <SelectField
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={countryOptions}
                  placeholder="Select Country"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Port</label>
              <input
                type="text"
                name="port"
                value={formData.port}
                onChange={handleChange}
                placeholder="Please Enter Destination Port"
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Please Enter Email"
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">
                Mobile <span className="text-red-500">*</span>
                <span className="text-gray-500 text-xs block">
                  (With Country Code)
                </span>
              </label>
              <input
                type="text"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Please Enter Phone/Mobile"
                className="col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">I am</label>
              <div className="col-span-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    checked={formData.customerType === "INDIVIDUAL"}
                    onChange={() => handleRadioChange("customerType", "INDIVIDUAL")}
                    className="mr-1"
                  />
                  <span>Individual</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="customerType"
                    checked={formData.customerType === "CAR_DEALER"}
                    onChange={() => handleRadioChange("customerType", "CAR_DEALER")}
                    className="mr-1"
                  />
                  <span>Car Dealer</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Right Column */}
          <div>
            <div className="mb-4">
              <label className="font-medium block mb-2">Enquiry For <span className="text-red-500">*</span></label>
              <div className="grid grid-cols-2 gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "CAR"}
                    onChange={() => handleRadioChange("inquiryType", "CAR")}
                    className="mr-1"
                  />
                  <span>Car</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "BUS"}
                    onChange={() => handleRadioChange("inquiryType", "BUS")}
                    className="mr-1"
                  />
                  <span>Bus</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "TRUCKS"}
                    onChange={() => handleRadioChange("inquiryType", "TRUCKS")}
                    className="mr-1"
                  />
                  <span>Trucks</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "BIKES"}
                    onChange={() => handleRadioChange("inquiryType", "BIKES")}
                    className="mr-1"
                  />
                  <span>Bikes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "PARTS"}
                    onChange={() => handleRadioChange("inquiryType", "PARTS")}
                    className="mr-1"
                  />
                  <span>Parts</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="inquiryType"
                    checked={formData.inquiryType === "OTHERS"}
                    onChange={() => handleRadioChange("inquiryType", "OTHERS")}
                    className="mr-1"
                  />
                  <span>Others</span>
                </label>
              </div>
            </div>
            
            <div className="flex flex-col items-center mt-6">
              <p className="text-xs mb-2">You can submit max <span className="text-blue-500">5 enquiries</span></p>
              <button 
                type="button"
                onClick={submitInquiry}
                disabled={createInquiryMutation.isPending}
                className="bg-red-600 text-white font-medium rounded px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createInquiryMutation.isPending ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-xl font-bold uppercase mb-6">
            CUSTOMERS REVIEWS & TESTIMONIALS
            <div className="w-48 h-1 bg-blue-500 mx-auto mt-2"></div>
          </h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <span className="text-5xl font-bold text-blue-600">99%</span>
              <p className="text-sm uppercase font-medium">SATISFIED CUSTOMERS ON JCT</p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Why Buy only through shantix-corp.com?</h3>
              <div className="flex items-center">
                <div className="w-24 h-24 relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"></div>
                </div>
                <div className="ml-4">
                  <ul className="text-sm">
                    <li className="flex items-center mb-1">
                      <span className="w-3 h-3 bg-green-500 inline-block mr-2"></span>
                      Direct Sale & Transactions
                    </li>
                    <li className="flex items-center mb-1">
                      <span className="w-3 h-3 bg-blue-500 inline-block mr-2"></span>
                      Trusted & Reliable Dealers
                    </li>
                    <li className="flex items-center mb-1">
                      <span className="w-3 h-3 bg-red-500 inline-block mr-2"></span>
                      Large Stock Inventory
                    </li>
                    <li className="flex items-center">
                      <span className="w-3 h-3 bg-yellow-500 inline-block mr-2"></span>
                      24/7 Customer Support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 mr-3"></div>
                <div>
                  <p className="text-sm">"I would like to thank you for your transparency in the way you deal. I had a very good experience. Super happy with my purchase!"</p>
                  <div className="mt-2">
                    <p className="font-medium">Nasir, Malaysia</p>
                    <button className="mt-2 bg-green-600 text-white text-xs rounded px-3 py-1">View Full Story</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 mr-3"></div>
                <div>
                  <p className="text-sm">"I'M VERY HAPPY! AFTER RECEIVING TOYOTA ALPHARD 2017 MODEL FROM VEHICLE JAPAN. MANY THANKS!"</p>
                  <div className="mt-2">
                    <p className="font-medium">Arnos, Mozambique</p>
                    <button className="mt-2 bg-green-600 text-white text-xs rounded px-3 py-1">View Full Story</button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-4 rounded shadow-sm">
              <div className="flex">
                <div className="w-20 h-20 bg-gray-200 mr-3"></div>
                <div>
                  <p className="text-sm">"I have received the car and am very happy its condition is very good and as represented in the ad."</p>
                  <div className="mt-2">
                    <p className="font-medium">Smith, Tanzania</p>
                    <button className="mt-2 bg-green-600 text-white text-xs rounded px-3 py-1">View Full Story</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button className="bg-gray-700 text-white px-4 py-2 rounded text-sm uppercase">View All Happy Customers</button>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-gray-100 h-full w-full">
              <img src="/api/placeholder/400/500" alt="Support agent" className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <h3 className="text-blue-600 font-bold mb-4">SUBMIT INQUIRY FORM</h3>
            <div className="space-y-6">
              {[
                {
                  icon: "📝",
                  title: "SUBMIT INQUIRY FORM",
                  desc: "Fill in the inquiry form with your vehicle requirements and submit it to us. We'll process your inquiry and match it with the most suitable options available in our inventory."
                },
                {
                  icon: "🔍",
                  title: "GET BEST OFFERS",
                  desc: "Our team will send you the best vehicle matches within 24 hours. You'll receive competitive offers from our trusted dealer network."
                },
                {
                  icon: "🚗",
                  title: "CHOOSE VEHICLE & GET PROFORMA",
                  desc: "Select your preferred vehicle and receive a detailed proforma invoice with full pricing breakdown including shipping and other costs."
                },
                {
                  icon: "💰",
                  title: "NEGOTIATE & MAKE PAYMENT",
                  desc: "Discuss pricing details if needed and complete the payment securely. We offer various payment methods for your convenience."
                },
                {
                  icon: "🚢",
                  title: "SHIPPING & DOCUMENTS",
                  desc: "Once payment is received, we'll arrange shipping and prepare all necessary export documents for smooth customs clearance at destination."
                },
                {
                  icon: "✅",
                  title: "RECEIVE YOUR VEHICLE",
                  desc: "Track your shipment online and receive your vehicle at your local port. Our team will assist with any post-delivery support you might need."
                }
              ].map((step, index) => (
                <div key={index} className="flex">
                  <div className="text-blue-600 text-2xl mr-4">{step.icon}</div>
                  <div>
                    <h4 className="font-bold">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Enquiry;