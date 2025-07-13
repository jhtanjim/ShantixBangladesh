import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  colorOptions,
  driveOptions,
  seatsOptions,
  transmissionOptions,
} from "../../api/cardata";
import SelectField from "../../components/ui/SelectField";
import { useAuth } from "../../Context/AuthContext";
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
    inquiryType: "CAR",
  });

  const createInquiryMutation = useCreateInquiry();
  const { user, isAuthenticated } = useAuth();
  console.log(user);

  // Auto-populate email if user is logged in
  useEffect(() => {
    if (user && user.email && !formData.email) {
      setFormData((prev) => ({
        ...prev,
        email: user.email,
        mobile: user.mobile || "",
      }));
    }
  }, [user, formData.email]);

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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRadioChange = (name, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
    { value: "SG", label: "Singapore" },
    { value: "KE", label: "Kenya" },
    { value: "TZ", label: "Tanzania" },
    { value: "UG", label: "Uganda" },
    { value: "ZA", label: "South Africa" },
    { value: "NG", label: "Nigeria" },
    { value: "GH", label: "Ghana" },
    { value: "CI", label: "Ivory Coast" },
    { value: "SN", label: "Senegal" },
    { value: "CM", label: "Cameroon" },
    { value: "ZW", label: "Zimbabwe" },
  ];

  const validateForm = () => {
    const requiredFields = [
      "country",
      "email",
      "mobile",
      "inquiryType",
      "customerType",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Missing Required Fields",
        text: `Please fill in: ${missingFields.join(", ")}`,
        confirmButtonColor: "#dc2626",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        confirmButtonColor: "#dc2626",
      });
      return false;
    }

    // Mobile validation (basic check for international format)
    const mobileRegex = /^\+?[\d\s\-\(\)]{7,15}$/;
    if (!mobileRegex.test(formData.mobile)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Mobile Number",
        text: "Please enter a valid mobile number with country code",
        confirmButtonColor: "#dc2626",
      });
      return false;
    }

    // Year validation
    if (formData.yearFrom && formData.yearTo) {
      const yearFrom = parseInt(formData.yearFrom);
      const yearTo = parseInt(formData.yearTo);

      if (yearFrom > yearTo) {
        Swal.fire({
          icon: "error",
          title: "Invalid Year Range",
          text: "Year From cannot be greater than Year To",
          confirmButtonColor: "#dc2626",
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
        title: "Submitting Inquiry...",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare data for API
      const apiData = {
        ...formData,
        yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : undefined,
        yearTo: formData.yearTo ? parseInt(formData.yearTo) : undefined,
      };

      // Remove empty fields
      Object.keys(apiData).forEach((key) => {
        if (apiData[key] === "" || apiData[key] === undefined) {
          delete apiData[key];
        }
      });

      await createInquiryMutation.mutateAsync(apiData);

      // Success message
      Swal.fire({
        icon: "success",
        title: "Inquiry Submitted Successfully!",
        text: "We will get back to you within 24 hours with the best offers.",
        confirmButtonColor: "#059669",
        timer: 3000,
        timerProgressBar: true,
      });

      // Reset form (but keep user data if logged in)
      setFormData({
        make: "",
        model: "",
        steering: "RIGHT_HAND",
        yearFrom: "",
        yearTo: "",
        country: "",
        port: "",
        email: user?.email || "",
        mobile: user?.mobile || "",
        customerType: "INDIVIDUAL",
        message: "",
        inquiryType: "CAR",
      });
    } catch (error) {
      console.error("Inquiry submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="container mx-auto pt-6 pb-4 px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold uppercase">
            <span className="text-blue-600">SEND YOUR</span>{" "}
            <span className="text-black">INQUIRY</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-red-600 uppercase">
            BEST DEAL !!
          </h2>
          <p className="mt-2 text-lg font-semibold">VEHICLE INQUIRY FORM</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 pb-8">
        <form onSubmit={submitInquiry}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Enter Make (Ex: Toyota)"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Enter Model (Ex: Corolla)"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <label className="font-medium">Steering</label>
                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="steering"
                      checked={formData.steering === "RIGHT_HAND"}
                      onChange={() =>
                        handleRadioChange("steering", "RIGHT_HAND")
                      }
                      className="mr-2 text-blue-600"
                    />
                    <span>Right Hand</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="steering"
                      checked={formData.steering === "LEFT_HAND"}
                      onChange={() =>
                        handleRadioChange("steering", "LEFT_HAND")
                      }
                      className="mr-2 text-blue-600"
                    />
                    <span>Left Hand</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="steering"
                      checked={formData.steering === "ANY"}
                      onChange={() => handleRadioChange("steering", "ANY")}
                      className="mr-2 text-blue-600"
                    />
                    <span>Any</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Year</label>
                <div className="md:col-span-2 grid grid-cols-2 gap-2">
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <label className="font-medium pt-2">Message</label>
                <div className="md:col-span-2">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your requirements (max 250 words)"
                    rows={4}
                    maxLength={250}
                    className="border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
                  />
                  <div className="text-sm text-gray-500 mt-1">
                    {formData.message.length}/250 characters
                  </div>
                </div>
              </div>

              {/* Engine CC */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Engine CC</label>
                <input
                  type="text"
                  name="engineCC"
                  value={formData.engineCC}
                  onChange={handleChange}
                  placeholder="Enter Engine CC (Ex: 1500)"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Transmission</label>
                <div className="md:col-span-2">
                  <SelectField
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    options={transmissionOptions}
                    placeholder="Select Transmission"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Drive Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Drive Type</label>
                <div className="md:col-span-2">
                  <SelectField
                    name="drive"
                    value={formData.drive}
                    onChange={handleChange}
                    options={driveOptions}
                    placeholder="Select Drive Type"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Exterior Color */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Exterior Color</label>
                <input
                  type="text"
                  name="exteriorColor"
                  value={formData.exteriorColor}
                  onChange={handleChange}
                  placeholder="Enter Exterior Color"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              {/* Color */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Color</label>
                <div className="md:col-span-2">
                  <SelectField
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    options={colorOptions}
                    placeholder="Select Color"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Seats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Seats</label>
                <div className="md:col-span-2">
                  <SelectField
                    name="seats"
                    value={formData.seats}
                    onChange={handleChange}
                    options={seatsOptions}
                    placeholder="Select Seats"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Mileage</label>
                <input
                  type="number"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="Enter Mileage (km)"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Middle Column */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">
                  Country <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2">
                  <SelectField
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    options={countryOptions}
                    placeholder="Select Country"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">Port</label>
                <input
                  type="text"
                  name="port"
                  value={formData.port}
                  onChange={handleChange}
                  placeholder="Enter Destination Port"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="font-medium">
                  Mobile <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs block">
                    (With Country Code)
                  </span>
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="e.g., +8801234567890"
                  className="md:col-span-2 border border-gray-300 p-2 rounded w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                <label className="font-medium">
                  I am <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={formData.customerType === "INDIVIDUAL"}
                      onChange={() =>
                        handleRadioChange("customerType", "INDIVIDUAL")
                      }
                      className="mr-2 text-blue-600"
                    />
                    <span>Individual</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="customerType"
                      checked={formData.customerType === "CAR_DEALER"}
                      onChange={() =>
                        handleRadioChange("customerType", "CAR_DEALER")
                      }
                      className="mr-2 text-blue-600"
                    />
                    <span>Car Dealer</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="font-medium block mb-3">
                  Enquiry For <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "CAR", label: "Car" },
                    { value: "BUS", label: "Bus" },
                    { value: "TRUCKS", label: "Trucks" },
                    { value: "BIKES", label: "Bikes" },
                    { value: "PARTS", label: "Parts" },
                    { value: "OTHERS", label: "Others" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="inline-flex items-center cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="inquiryType"
                        checked={formData.inquiryType === option.value}
                        onChange={() =>
                          handleRadioChange("inquiryType", option.value)
                        }
                        className="mr-2 text-blue-600"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center mt-8 space-y-4">
                <button
                  type="submit"
                  disabled={createInquiryMutation.isPending}
                  className="bg-red-600 text-white font-medium rounded-lg px-6 py-3 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
                >
                  {createInquiryMutation.isPending ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Inquiry"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Process Section */}
    </div>
  );
};

export default Enquiry;
