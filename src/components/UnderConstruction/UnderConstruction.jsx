import React, { useState, useEffect } from 'react'
import { Car, Wrench, Clock, Mail, Phone, MapPin, Zap, Settings, ArrowRight } from 'lucide-react'
import logoImg from "../../assets/images/logo.png"

const UnderConstruction = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [emailSubscribed, setEmailSubscribed] = useState(false)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleEmailSubmit = () => {
    if (email.trim()) {
      setEmailSubscribed(true)
      setEmail('')
    }
  }

  const targetDate = new Date('2025-08-15') // Example launch date
  const timeUntilLaunch = targetDate - currentTime
  const days = Math.floor(timeUntilLaunch / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeUntilLaunch % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilLaunch % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeUntilLaunch % (1000 * 60)) / 1000)

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#E5E5E5' }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating car icons */}
        <div className="absolute top-20 left-10 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
          <Car size={40} style={{ color: '#0072BC' }} className="opacity-20" />
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>
          <Settings size={35} style={{ color: '#C9252B' }} className="opacity-20" />
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }}>
          <Wrench size={30} style={{ color: '#003366' }} className="opacity-20" />
        </div>
        <div className="absolute top-60 left-1/3 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '5s' }}>
          <Zap size={25} style={{ color: '#0072BC' }} className="opacity-15" />
        </div>
        <div className="absolute bottom-60 right-1/4 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}>
          <Car size={45} style={{ color: '#C9252B' }} className="opacity-15" />
        </div>

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-red-50/20 to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Brand Section */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 shadow-2xl transform hover:scale-110 transition-all duration-300 bg-white p-2" 
                 style={{ backgroundColor: 'white' }}>
              <img 
                src={logoImg} 
                alt="Shantix Logo" 
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4" style={{ color: '#003366' }}>
              Shantix
            </h1>
            <p className="text-lg md:text-xl font-medium mb-4" style={{ color: '#0072BC' }}>
              Your Premier Auto Destination
            </p>
            <div className="w-24 h-1 mx-auto mb-6 rounded-full" style={{ backgroundColor: '#C9252B' }}></div>
          </div>

          {/* Under Construction Message */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full shadow-lg mb-6" 
                 style={{ backgroundColor: '#0072BC' }}>
              <Wrench size={24} className="text-white animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-white font-semibold text-lg">Under Construction</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#003366' }}>
              We're Building Something 
              <span style={{ color: '#C9252B' }} className="block md:inline"> Amazing!</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Our team is working hard to bring you the ultimate car buying and selling experience. 
              Get ready for a revolutionary platform that will change how you connect with vehicles.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6" style={{ color: '#003366' }}>
              <Clock className="inline mr-2" size={20} />
              Launching In:
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto">
              {[
                { value: days, label: 'Days' },
                { value: hours, label: 'Hours' },
                { value: minutes, label: 'Minutes' },
                { value: seconds, label: 'Seconds' }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-4 transform hover:scale-105 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold mb-2" style={{ color: index % 2 === 0 ? '#C9252B' : '#0072BC' }}>
                    {item.value.toString().padStart(2, '0')}
                  </div>
                  <div className="text-sm font-medium text-gray-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-8" style={{ color: '#003366' }}>
              What's Coming Soon?
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  icon: <Car size={32} />,
                  title: 'Extensive Inventory',
                  description: 'Browse thousands of quality vehicles from trusted dealers'
                },
                {
                  icon: <Zap size={32} />,
                  title: 'Instant Search',
                  description: 'Find your perfect car with our lightning-fast search engine'
                },
                {
                  icon: <Settings size={32} />,
                  title: 'Smart Filters',
                  description: 'Advanced filtering options to match your exact preferences'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
                       style={{ backgroundColor: index === 1 ? '#C9252B' : '#0072BC' }}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h4 className="text-xl font-bold mb-3" style={{ color: '#003366' }}>{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Email Subscription */}
          <div className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#003366' }}>
                Get Notified
              </h3>
              <p className="text-gray-600 mb-6">
                Be the first to know when we launch!
              </p>
              
              {!emailSubscribed ? (
                <div className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <button
                    onClick={handleEmailSubmit}
                    className="w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-300 shadow-lg"
                    style={{ backgroundColor: '#C9252B' }}
                  >
                    Notify Me
                    <ArrowRight size={20} />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#0072BC' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-semibold" style={{ color: '#003366' }}>
                    Thank you for subscribing!
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    We'll keep you updated on our progress.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-6" style={{ color: '#003366' }}>
              Stay Connected
            </h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300" 
                     style={{ backgroundColor: '#0072BC' }}>
                  <Mail size={20} className="text-white" />
                </div>
                <p className="font-medium" style={{ color: '#003366' }}>Email</p>
                <p className="text-gray-600 text-sm">info@shantix.com</p>
              </div>
              
              <div className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300" 
                     style={{ backgroundColor: '#C9252B' }}>
                  <Phone size={20} className="text-white" />
                </div>
                <p className="font-medium" style={{ color: '#003366' }}>Phone</p>
                <p className="text-gray-600 text-sm">+1 (555) 123-4567</p>
              </div>
              
              <div className="group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300" 
                     style={{ backgroundColor: '#003366' }}>
                  <MapPin size={20} className="text-white" />
                </div>
                <p className="font-medium" style={{ color: '#003366' }}>Location</p>
                <p className="text-gray-600 text-sm">Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-gray-500 text-sm">
              © 2025 Shantix. All rights reserved. | Building the future of automotive excellence.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnderConstruction