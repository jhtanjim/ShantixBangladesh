// LoginPage.tsx
"use client"
import { useState } from "react"
import { useAuth } from "../../Context/AuthContext"
import { useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import logoImg from "../../assets/images/logo.png"
import Swal from "sweetalert2"

export default function LoginPage({onForgotPassword}) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await login(formData)
      
      // Success alert with SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome back to Shantix',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#ffffff',
        color: '#374151',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-xl font-bold',
          content: 'text-gray-600'
        }
      })
      
      navigate("/")
    } catch (error) {
      // Error alert with SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'Please check your email and password and try again.',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#0072BC',
        background: '#ffffff',
        color: '#374151',
        customClass: {
          popup: 'rounded-2xl shadow-2xl',
          title: 'text-xl font-bold text-red-600',
          content: 'text-gray-600',
          confirmButton: 'rounded-xl px-6 py-2 font-semibold'
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'Reset Password',
      text: 'Enter your email address to receive a password reset link',
      input: 'email',
      inputPlaceholder: 'Enter your email',
      showCancelButton: true,
      confirmButtonText: 'Send Reset Link',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#0072BC',
      cancelButtonColor: '#6B7280',
      inputValidator: (value) => {
        if (!value) {
          return 'Please enter your email address'
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address'
        }
      },
      customClass: {
        popup: 'rounded-2xl shadow-2xl',
        title: 'text-xl font-bold',
        content: 'text-gray-600',
        input: 'rounded-xl border-2 border-gray-300 focus:border-blue-500',
        confirmButton: 'rounded-xl px-6 py-2 font-semibold',
        cancelButton: 'rounded-xl px-6 py-2 font-semibold'
      }
    })

    if (email) {
      // Show loading
      Swal.fire({
        title: 'Sending...',
        text: 'Please wait while we send the reset link',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      // Simulate API call
      setTimeout(async () => {
        await Swal.fire({
          icon: 'success',
          title: 'Reset Link Sent!',
          text: `A password reset link has been sent to ${email}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#0072BC',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-xl font-bold text-green-600',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2 font-semibold'
          }
        })
      }, 2000)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{
        background: '#003366'
      }}
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 ">
            <span className="text-3xl"><img src={logoImg} alt="" /></span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-blue-200">Sign in to your Shantix account</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-sm transform ">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Sign In</h2>
            <p className="text-gray-600 mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
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
                  placeholder="Enter your password"
                  required
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-gray-400"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
               onClick={onForgotPassword}
                className="text-sm font-medium hover:underline transition-colors"
                style={{ color: '#0072BC' }}
              >
                Forgot your password?
              </button>
            </div>

            {/* Submit Button */}
           <button
  type="submit"
  disabled={loading}
  className="w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg relative overflow-hidden group cursor-pointer"
  style={{
    background: loading 
      ? '#9CA3AF' 
      : 'linear-gradient(135deg, #0072BC 0%, #003366 100%)'
  }}
>

              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              )}
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/register")}
                className="font-semibold hover:underline transition-colors"
                style={{ color: '#0072BC' }}
              >
                Create Account
              </button>
            </p>
          </div>

          {/* Quick Login Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <p className="text-blue-700 text-sm font-medium">
                Secure login with end-to-end encryption
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-200 text-sm">
          <p>© 2025 Shantix. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}