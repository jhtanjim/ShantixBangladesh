import { useState } from "react";
import SelectField from "../../components/ui/SelectField";

const Enquiry = () => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    steering: "right",
    yearFrom: "",
    yearTo: "",
    country: "",
    port: "",
    email: "",
    mobile: "",
    userType: "individual",
    message: "",
    enquiryFor: "car"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  

  const countryOptions = [
    { value: "", label: "Select Country" },
    { value: "us", label: "United States" },
    { value: "jp", label: "Japan" },
    { value: "uk", label: "United Kingdom" },
    { value: "au", label: "Australia" }
  ];

  const submitInquiry = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
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
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
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
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Steering</label>
              <div className="col-span-2 flex space-x-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "right"}
                    onChange={() => handleRadioChange("steering", "right")}
                    className="mr-1"
                  />
                  <span>Right Hand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "left"}
                    onChange={() => handleRadioChange("steering", "left")}
                    className="mr-1"
                  />
                  <span>Left Hand</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="steering"
                    checked={formData.steering === "any"}
                    onChange={() => handleRadioChange("steering", "any")}
                    className="mr-1"
                  />
                  <span>Any</span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Year</label>
              <div className="col-span-2 grid grid-cols-2 gap-2">
                <input
                  type="text"
                  name="yearFrom"
                  value={formData.yearFrom}
                  onChange={handleChange}
                  placeholder="Year From"
                  className="border border-gray-300 p-2 rounded w-full"
                />
                <input
                  type="text"
                  name="yearTo"
                  value={formData.yearTo}
                  onChange={handleChange}
                  placeholder="Year To"
                  className="border border-gray-300 p-2 rounded w-full"
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
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
              />
            </div>
          </div>
          
          {/* Middle Column */}
          <div className="space-y-4">
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Country</label>
              <div className="col-span-2">
                <SelectField
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  options={countryOptions}
                  placeholder="Select Country"
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
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Please Enter Email"
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">
                Mobile 
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
                className="col-span-2 border border-gray-300 p-2 rounded w-full"
              />
            </div>
            
            <div className="grid grid-cols-3 items-center">
              <label className="font-medium">I am</label>
              <div className="col-span-2 flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    checked={formData.userType === "individual"}
                    onChange={() => handleRadioChange("userType", "individual")}
                    className="mr-1"
                  />
                  <span>Individual</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="userType"
                    checked={formData.userType === "carDealer"}
                    onChange={() => handleRadioChange("userType", "carDealer")}
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
              <label className="font-medium block mb-2">Enquiry For</label>
              <div className="grid grid-cols-2 gap-2">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "car"}
                    onChange={() => handleRadioChange("enquiryFor", "car")}
                    className="mr-1"
                  />
                  <span>Car</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "bus"}
                    onChange={() => handleRadioChange("enquiryFor", "bus")}
                    className="mr-1"
                  />
                  <span>Bus</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "trucks"}
                    onChange={() => handleRadioChange("enquiryFor", "trucks")}
                    className="mr-1"
                  />
                  <span>Trucks</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "bikes"}
                    onChange={() => handleRadioChange("enquiryFor", "bikes")}
                    className="mr-1"
                  />
                  <span>Bikes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "parts"}
                    onChange={() => handleRadioChange("enquiryFor", "parts")}
                    className="mr-1"
                  />
                  <span>Parts</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="enquiryFor"
                    checked={formData.enquiryFor === "others"}
                    onChange={() => handleRadioChange("enquiryFor", "others")}
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
                className="bg-red-600 text-white font-medium rounded px-4 py-2 hover:bg-red-700 transition-colors"
              >
                Submit Inquiry
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
              <h3 className="font-medium mb-2">Why Buy only through JapaneseCarTrade.com?</h3>
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