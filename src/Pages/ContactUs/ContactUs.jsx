import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useCreateContactInquiry } from "../../hooks/useContact";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    title: "Mr.",
    name: "",
    country: "",
    email: "",
    mobile: "",
    message: "",
    security: "",
  });

  // New states for countries
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [selectedCountryDialCode, setSelectedCountryDialCode] = useState("");

  const [securityQuestion, setSecurityQuestion] = useState({
    question: "",
    answer: "",
  });
  const createContactMutation = useCreateContactInquiry();

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,idd"
        );
        const data = await response.json();

        // Format countries for dropdown
        const formattedCountries = [
          { value: "", label: "Select Country", dialCode: "" },
          ...data
            .map((country) => ({
              value: country.cca2,
              label: country.name.common,
              dialCode: country.idd?.root
                ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
                : "",
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        ];

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        // Fallback to basic country list if API fails
        const fallbackCountries = [
          { value: "", label: "Select Country", dialCode: "" },
          { value: "US", label: "United States", dialCode: "+1" },
          { value: "BD", label: "Bangladesh", dialCode: "+880" },
          { value: "GB", label: "United Kingdom", dialCode: "+44" },
          { value: "JP", label: "Japan", dialCode: "+81" },
          { value: "AU", label: "Australia", dialCode: "+61" },
          { value: "CA", label: "Canada", dialCode: "+1" },
          { value: "IN", label: "India", dialCode: "+91" },
          { value: "CN", label: "China", dialCode: "+86" },
          { value: "DE", label: "Germany", dialCode: "+49" },
          { value: "FR", label: "France", dialCode: "+33" },
          { value: "BR", label: "Brazil", dialCode: "+55" },
        ];
        setCountries(fallbackCountries);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Update dial code when country changes
  useEffect(() => {
    if (formData.country) {
      const selectedCountry = countries.find(
        (c) => c.value === formData.country
      );
      const dialCode = selectedCountry?.dialCode || "";
      setSelectedCountryDialCode(dialCode);

      // Auto-add country code to mobile if it doesn't already have it
      if (
        dialCode &&
        formData.mobile &&
        !formData.mobile.startsWith(dialCode)
      ) {
        // Remove any existing country code first
        const cleanMobile = formData.mobile.replace(/^\+\d{1,4}\s?/, "");
        if (cleanMobile) {
          setFormData((prev) => ({
            ...prev,
            mobile: dialCode + " " + cleanMobile,
          }));
        }
      }
    } else {
      setSelectedCountryDialCode("");
    }
  }, [formData.country, countries]);

  // Generate random security question
  const generateSecurityQuestion = () => {
    const questions = [
      { q: "5 + 3 = ?", a: "8" },
      { q: "10 - 4 = ?", a: "6" },
      { q: "2 × 4 = ?", a: "8" },
      { q: "15 ÷ 3 = ?", a: "5" },
      { q: "7 + 2 = ?", a: "9" },
      { q: "12 - 5 = ?", a: "7" },
      { q: "3 × 3 = ?", a: "9" },
      { q: "20 ÷ 4 = ?", a: "5" },
      { q: "6 + 4 = ?", a: "10" },
      { q: "14 - 6 = ?", a: "8" },
    ];

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];
    setSecurityQuestion({
      question: randomQuestion.q,
      answer: randomQuestion.a,
    });
  };

  useEffect(() => {
    generateSecurityQuestion();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMobileChange = (e) => {
    let value = e.target.value;

    // Remove the country code prefix for display and processing
    if (selectedCountryDialCode && value.startsWith(selectedCountryDialCode)) {
      // Keep the full value as is since user is editing properly
    } else if (
      selectedCountryDialCode &&
      value.length > 0 &&
      !value.startsWith("+")
    ) {
      // User entered a number without country code, add it
      value = selectedCountryDialCode + " " + value;
    }

    setFormData((prevState) => ({
      ...prevState,
      mobile: value,
    }));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.name ||
      !formData.country ||
      !formData.email ||
      !formData.mobile ||
      !formData.message
    ) {
      Swal.fire({
        icon: "warning",
        title: "Missing Information",
        text: "Please fill in all required fields",
        confirmButtonColor: "#C9252B",
        background: "#fff",
        color: "#003366",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        confirmButtonColor: "#C9252B",
        background: "#fff",
        color: "#003366",
      });
      return;
    }

    // Mobile validation
    const mobileRegex = /^\+?[\d\s\-()]{7,15}$/;
    if (!mobileRegex.test(formData.mobile)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Mobile Number",
        text: "Please enter a valid mobile number with country code",
        confirmButtonColor: "#C9252B",
        background: "#fff",
        color: "#003366",
      });
      return;
    }

    // Validate security question
    if (formData.security !== securityQuestion.answer) {
      Swal.fire({
        icon: "error",
        title: "Security Check Failed",
        text: `Please solve the math problem correctly: ${securityQuestion.question}`,
        confirmButtonColor: "#C9252B",
        background: "#fff",
        color: "#003366",
      });
      return;
    }

    try {
      // Show loading
      Swal.fire({
        title: "Sending Message...",
        text: "Please wait while we process your inquiry",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        background: "#fff",
        color: "#003366",
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Prepare data for API (exclude security field and get country name)
      const selectedCountry = countries.find(
        (c) => c.value === formData.country
      );
      const { security, ...submitData } = formData;
      submitData.country = selectedCountry
        ? selectedCountry.label
        : formData.country;

      await createContactMutation.mutateAsync(submitData);

      // Reset form on success
      setFormData({
        title: "Mr.",
        name: "",
        country: "",
        email: "",
        mobile: "",
        message: "",
        security: "",
      });

      setSelectedCountryDialCode("");

      // Generate new security question
      generateSecurityQuestion();

      // Success message
      Swal.fire({
        icon: "success",
        title: "Message Sent Successfully!",
        text: "Thank you for contacting us. We will get back to you soon.",
        confirmButtonColor: "#0072BC",
        background: "#fff",
        color: "#003366",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "There was an error sending your message. Please try again.",
        confirmButtonColor: "#C9252B",
        background: "#fff",
        color: "#003366",
      });
    }
  };

  const refreshSecurityQuestion = () => {
    generateSecurityQuestion();
    setFormData((prev) => ({ ...prev, security: "" }));
  };

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor: "#E5E5E5" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#003366" }}>
            Contact Us
          </h1>
          <p className="text-lg" style={{ color: "#003366" }}>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-10">
            <div className="space-y-6">
              {/* Name with Title */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Full Name *
                </label>
                <div className="flex gap-3">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{ "--tw-border-opacity": 1, borderColor: "#E5E5E5" }}
                    disabled={createContactMutation.isPending}
                  >
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                    <option value="Ms.">Ms.</option>
                    <option value="Dr.">Dr.</option>
                  </select>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    style={{
                      "--tw-border-opacity": 1,
                      borderColor: formData.name ? "#0072BC" : "#E5E5E5",
                      color: "#003366",
                    }}
                    required
                    disabled={createContactMutation.isPending}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{
                    "--tw-border-opacity": 1,
                    borderColor: formData.country ? "#0072BC" : "#E5E5E5",
                    color: "#003366",
                  }}
                  required
                  disabled={createContactMutation.isPending || loadingCountries}
                >
                  <option value="">
                    {loadingCountries
                      ? "Loading countries..."
                      : "Select your country"}
                  </option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.value}>
                      {country.label}{" "}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{
                    "--tw-border-opacity": 1,
                    borderColor: formData.email ? "#0072BC" : "#E5E5E5",
                    color: "#003366",
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
              </div>

              {/* Mobile Number with Country Code */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Mobile Number *
                </label>
                <div
                  className="flex border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-blue-500 transition-colors"
                  style={{
                    "--tw-border-opacity": 1,
                    borderColor: formData.mobile ? "#0072BC" : "#E5E5E5",
                  }}
                >
                  {/* Country Code Display */}
                  {selectedCountryDialCode && (
                    <div
                      className="bg-gray-50 px-3 py-3 border-r border-gray-300 text-gray-600 text-sm font-medium flex items-center min-w-0"
                      style={{ color: "#003366", backgroundColor: "#F8F9FA" }}
                    >
                      <span className="whitespace-nowrap">
                        {selectedCountryDialCode}
                      </span>
                    </div>
                  )}

                  {/* Mobile Number Input */}
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile.replace(
                      selectedCountryDialCode + " ",
                      ""
                    )}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d\s\-()]/g, ""); // Only allow numbers, spaces, hyphens, and parentheses
                      const fullValue = selectedCountryDialCode
                        ? selectedCountryDialCode + " " + value
                        : value;
                      setFormData((prev) => ({ ...prev, mobile: fullValue }));
                    }}
                    placeholder={
                      selectedCountryDialCode
                        ? "1234567890"
                        : "Enter mobile number"
                    }
                    className="flex-1 px-4 py-3 outline-none bg-white min-w-0"
                    style={{ color: "#003366" }}
                    required
                    disabled={createContactMutation.isPending}
                  />
                </div>

                {/* Helper Text */}
                <div className="text-xs mt-1" style={{ color: "#666" }}>
                  {selectedCountryDialCode
                    ? "Enter your mobile number without country code"
                    : "Select a country first to add country code"}
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell us how we can help you..."
                  rows={5}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  style={{
                    "--tw-border-opacity": 1,
                    borderColor: formData.message ? "#0072BC" : "#E5E5E5",
                    color: "#003366",
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs" style={{ color: "#666" }}>
                    {formData.message.length}/500 characters
                  </span>
                </div>
              </div>

              {/* Security Question */}
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: "#003366" }}
                >
                  Security Check *
                </label>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="px-4 py-2 rounded-lg font-bold text-lg"
                    style={{ backgroundColor: "#E5E5E5", color: "#C9252B" }}
                  >
                    {securityQuestion.question}
                  </div>
                  <button
                    type="button"
                    onClick={refreshSecurityQuestion}
                    className="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: "#0072BC", color: "white" }}
                    disabled={createContactMutation.isPending}
                  >
                    🔄 New Question
                  </button>
                </div>
                <input
                  type="text"
                  name="security"
                  value={formData.security}
                  onChange={handleInputChange}
                  placeholder="Enter the answer"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                  style={{
                    "--tw-border-opacity": 1,
                    borderColor: formData.security ? "#0072BC" : "#E5E5E5",
                    color: "#003366",
                  }}
                  required
                  disabled={createContactMutation.isPending}
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createContactMutation.isPending}
                className="w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
                style={{
                  backgroundColor: "#C9252B",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(201, 37, 43, 0.3)",
                }}
              >
                {createContactMutation.isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Message...
                  </div>
                ) : (
                  "✉️ Send Message"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-sm" style={{ color: "#003366" }}>
            Need immediate assistance? Call us or email us directly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
