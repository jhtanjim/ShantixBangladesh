// Register.tsx
import { useMutation } from "@tanstack/react-query";
import {
  Building,
  Check,
  Eye,
  EyeOff,
  Globe,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { registerUser } from "../../api/auth";
import logoImg from "../../assets/images/logo.png";

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 8;
};

const validatePhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10;
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    companyName: "",
    confirmCheckbox: false,
  });

  const [countries, setCountries] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [errors, setErrors] = useState({});

  // Enhanced country fetching with dial codes
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,flag,idd,cca2"
        );
        const data = await response.json();

        const processedCountries = data
          .map((country) => {
            const dialCode = country.idd?.root
              ? `${country.idd.root}${country.idd.suffixes?.[0] || ""}`
              : "";

            return {
              name: country.name.common,
              flag: country.flag,
              dialCode,
              code: country.cca2,
            };
          })
          .filter((country) => country.dialCode) // Only include countries with dial codes
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(processedCountries);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
        // Enhanced fallback with dial codes
        setCountries([
          { name: "United States", flag: "🇺🇸", dialCode: "+1", code: "US" },
          { name: "United Kingdom", flag: "🇬🇧", dialCode: "+44", code: "GB" },
          { name: "Canada", flag: "🇨🇦", dialCode: "+1", code: "CA" },
          { name: "Australia", flag: "🇦🇺", dialCode: "+61", code: "AU" },
          { name: "Germany", flag: "🇩🇪", dialCode: "+49", code: "DE" },
          { name: "France", flag: "🇫🇷", dialCode: "+33", code: "FR" },
          { name: "Japan", flag: "🇯🇵", dialCode: "+81", code: "JP" },
          { name: "Bangladesh", flag: "🇧🇩", dialCode: "+880", code: "BD" },
          { name: "India", flag: "🇮🇳", dialCode: "+91", code: "IN" },
          { name: "China", flag: "🇨🇳", dialCode: "+86", code: "CN" },
        ]);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, []);

  // Auto-add country code when country is selected
  useEffect(() => {
    if (form.country) {
      const selectedCountry = countries.find((c) => c.name === form.country);
      if (selectedCountry && selectedCountry.dialCode) {
        // Only add dial code if phone doesn't already start with it
        if (!form.phone.startsWith(selectedCountry.dialCode)) {
          const phoneWithoutCode = form.phone.replace(/^\+\d+\s*/, "");
          setForm((prev) => ({
            ...prev,
            phone: `${selectedCountry.dialCode} ${phoneWithoutCode}`.trim(),
          }));
        }
      }
    }
  }, [form.country, countries]);

  // Real-time validation
  useEffect(() => {
    const newErrors = {};

    if (form.email && !validateEmail(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (form.password && !validatePassword(form.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (form.confirmPassword && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (form.phone && !validatePhone(form.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    setErrors(newErrors);
  }, [form.email, form.password, form.confirmPassword, form.phone]);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Registration successful! Please Check your email for login!",
        icon: "success",
        confirmButtonText: "Continue",
        confirmButtonColor: "#0072BC",
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        navigate("/login");
      });
    },
    onError: (error) => {
      Swal.fire({
        title: "Registration Failed",
        text:
          error?.response?.data?.message ||
          "Registration failed. Please try again.",
        icon: "error",
        confirmButtonText: "Try Again",
        confirmButtonColor: "#0072BC",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields
    if (!form.fullName.trim()) {
      Swal.fire({
        title: "Missing Information",
        text: "Please enter your full name",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (!validateEmail(form.email)) {
      Swal.fire({
        title: "Invalid Email",
        text: "Please enter a valid email address",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (!validatePassword(form.password)) {
      Swal.fire({
        title: "Invalid Password",
        text: "Password must be at least 8 characters long",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (form.password !== form.confirmPassword) {
      Swal.fire({
        title: "Password Mismatch",
        text: "Passwords do not match. Please check and try again.",
        icon: "error",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (!validatePhone(form.phone)) {
      Swal.fire({
        title: "Invalid Phone Number",
        text: "Please enter a valid phone number",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (!form.country) {
      Swal.fire({
        title: "Missing Country",
        text: "Please select your country",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    if (!form.confirmCheckbox) {
      Swal.fire({
        title: "Terms & Conditions",
        text: "Please confirm that you agree to the terms and conditions",
        icon: "warning",
        confirmButtonColor: "#0072BC",
      });
      return;
    }

    // Create the data object to send to API
    const { confirmPassword, confirmCheckbox, ...registrationData } = form;
    mutation.mutate(registrationData);
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return (
      form.fullName.trim() &&
      validateEmail(form.email) &&
      validatePassword(form.password) &&
      form.password === form.confirmPassword &&
      validatePhone(form.phone) &&
      form.country &&
      form.confirmCheckbox &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ background: "#003366" }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          <div className="text-center mb-2">
            <div className="inline-flex items-center justify-center w-40 ">
              <img
                src={logoImg}
                alt="Shantix Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-black">Create your account to get started</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={form.fullName}
                  onChange={(e) =>
                    handleInputChange("fullName", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400 ${
                    errors.email
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Country Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <select
                  value={form.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white hover:border-gray-400 cursor-pointer"
                  required
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries
                      ? "Loading countries..."
                      : "Select your country"}
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country.code || country.name}
                      value={country.name}
                    >
                      {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="tel"
                  placeholder="Phone number will auto-format with country code"
                  value={form.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400 ${
                    errors.phone
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Company Name Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name{" "}
                <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <div className="relative group">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter your company name"
                  value={form.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <span className="text-red-500 text-xs mt-1">
                Password must be at least 8 characters long
              </span>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400 ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="confirmCheckbox"
                  checked={form.confirmCheckbox}
                  onChange={(e) =>
                    handleInputChange("confirmCheckbox", e.target.checked)
                  }
                  className="sr-only"
                  required
                />
                <label
                  htmlFor="confirmCheckbox"
                  className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all transform hover:scale-110 ${
                    form.confirmCheckbox
                      ? "bg-blue-600 border-blue-600 shadow-lg"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  {form.confirmCheckbox && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </label>
              </div>
              <label
                htmlFor="confirmCheckbox"
                className="text-sm text-gray-600 cursor-pointer leading-5"
              >
                I agree to the{" "}
                <Link
                  to="/privacyPolicy"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "#0072BC" }}
                >
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacyPolicy"
                  className="font-semibold hover:underline transition-colors"
                  style={{ color: "#0072BC" }}
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending || !isFormValid()}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden ${
                isFormValid() ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              style={{
                background: isFormValid()
                  ? "linear-gradient(135deg, #0072BC 0%, #003366 100%)"
                  : "#9CA3AF",
              }}
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="relative z-10">Create Account</span>
              )}

              {isFormValid() && !mutation.isPending && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="font-semibold hover:underline transition-colors"
                style={{ color: "#0072BC" }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          {/* <p>© 2025 shantix. All rights reserved.</p> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
