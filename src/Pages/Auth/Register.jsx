// Register.tsx
import { useState, useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "../../api/auth"
import { useNavigate } from "react-router-dom"
import { Check, Eye, EyeOff, Globe, Mail, Lock, Phone, User } from "lucide-react"
import logoImg from "../../assets/images/logo.png"; 
import { toast } from "react-hot-toast"
const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    phone: "",
    country: "",
    confirmCheckbox: false
  })
  const [countries, setCountries] = useState([])
  const [showPassword, setShowPassword] = useState(false)
  const [loadingCountries, setLoadingCountries] = useState(true)

  // Fetch countries from REST Countries API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,flag')
        const data = await response.json()
        const sortedCountries = data
          .map(country => ({
            name: country.name.common,
            flag: country.flag
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
        setCountries(sortedCountries)
      } catch (error) {
        console.error('Failed to fetch countries:', error)
        // Fallback countries
        setCountries([
          { name: 'United States', flag: '🇺🇸' },
          { name: 'United Kingdom', flag: '🇬🇧' },
          { name: 'Canada', flag: '🇨🇦' },
          { name: 'Australia', flag: '🇦🇺' },
          { name: 'Germany', flag: '🇩🇪' },
          { name: 'France', flag: '🇫🇷' },
          { name: 'Japan', flag: '🇯🇵' },
          { name: 'Bangladesh', flag: '🇧🇩' },
          { name: 'India', flag: '🇮🇳' },
          { name: 'China', flag: '🇨🇳' }
        ])
      } finally {
        setLoadingCountries(false)
      }
    }
    fetchCountries()
  }, [])

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {


      toast.success("Registration successful!")
      navigate("/login")
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Registration failed")
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.confirmCheckbox) {
      toast.error("Please confirm that you agree to the terms and conditions")
      return
      
    }
    mutation.mutate(form)
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
               background: '#003366'

      }}
    >
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 ">
                    <span className="text-3xl"><img src={logoImg} alt="" /></span>
                  </div>
          <h1 className="text-3xl font-bold text-white mb-2">Join CarHub</h1>
          <p className="text-blue-200">Create your account to get started</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                    required
                  />
                </div>
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  required
                />
              </div>
            </div>

            {/* Country Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <div className="relative group">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors z-10" />
                <select
                  value={form.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white hover:border-gray-400 cursor-pointer"
                  required
                  disabled={loadingCountries}
                >
                  <option value="">
                    {loadingCountries ? "Loading countries..." : "Select your country"}
                  </option>
                  {countries.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <div className="flex items-start space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="confirmCheckbox"
                  checked={form.confirmCheckbox}
                  onChange={(e) => handleInputChange('confirmCheckbox', e.target.checked)}
                  className="sr-only"
                  required
                />
                <label
                  htmlFor="confirmCheckbox"
                  className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all transform hover:scale-110 ${
                    form.confirmCheckbox 
                      ? 'bg-blue-600 border-blue-600 shadow-lg' 
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                >
                  {form.confirmCheckbox && (
                    <Check className="w-3 h-3 text-white" />
                  )}
                </label>
              </div>
              <label htmlFor="confirmCheckbox" className="text-sm text-gray-600 cursor-pointer leading-5">
                I agree to the{" "}
                <span 
                  className="font-semibold hover:underline cursor-pointer transition-colors"
                  style={{ color: '#0072BC' }}
                >
                  Terms & Conditions
                </span>{" "}
                and{" "}
                <span 
                  className="font-semibold hover:underline cursor-pointer transition-colors"
                  style={{ color: '#0072BC' }}
                >
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isPending || !form.confirmCheckbox}
              className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden"
              style={{
                background: form.confirmCheckbox 
                  ? 'linear-gradient(135deg, #0072BC 0%, #003366 100%)' 
                  : '#9CA3AF'
              }}
            >
              {mutation.isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <span className="relative z-10">Register</span>
              )}
              {form.confirmCheckbox && !mutation.isPending && (
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
                style={{ color: '#0072BC' }}
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>© 2025 CarHub. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Register