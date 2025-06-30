// LoginPage.tsx
"use client"
import { useState } from "react"
import { useAuth } from "../../Context/AuthContext"
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import logoImg from "../../assets/images/logo.png"
import Swal from "sweetalert2"
export default function LoginPage({onForgotPassword}) {
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login, getAndClearRedirectUrl } = useAuth() // Add getAndClearRedirectUrl
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

      // Get the redirect URL and navigate there
      const redirectUrl = getAndClearRedirectUrl()
      navigate(redirectUrl)
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
      confirmButtonColor: '0072BC',
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
        text: 'Please wait while we send you the reset link',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        }
      })

      try {
        // Call your forgot password function here
        if (onForgotPassword) {
          await onForgotPassword(email)
        }
        
        // Success
        await Swal.fire({
          icon: 'success',
          title: 'Reset Link Sent!',
          text: `We've sent a password reset link to ${email}`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#0072BC',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-xl font-bold',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2 font-semibold'
          }
        })
      } catch (error) {
        // Error
        await Swal.fire({
          icon: 'error',
          title: 'Failed to Send',
          text: 'There was an error sending the reset link. Please try again.',
          confirmButtonText: 'OK',
          confirmButtonColor: '#0072BC',
          customClass: {
            popup: 'rounded-2xl shadow-2xl',
            title: 'text-xl font-bold text-red-600',
            content: 'text-gray-600',
            confirmButton: 'rounded-xl px-6 py-2 font-semibold'
          }
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#003366] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="text-center">
          <img
            src={logoImg}
            alt="Shantix Logo"
            className="mx-auto h-16 w-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Forgot your password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center">
                Sign in
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
            )}
          </button>
          
        </form>
        <div>
                  {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to={"/register"}>           
                 <button
                
                className="cursor-pointer font-semibold hover:underline transition-colors"
                style={{ color: '#0072BC' }}
              >
                Create Account
              </button>
              </Link>

            </p>
          </div>

        
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-blue-900 text-sm">
          <p>© 2025 Shantix. All rights reserved.</p>
        </div>
        </div>
        
      </div>
  
  )
}
     