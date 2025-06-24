import React from 'react'
import { Car, Wrench, Phone, Mail, MapPin } from 'lucide-react'
import logoImg from "../../assets/images/logo.png"

const UnderConstruction = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#E5E5E5' }}>
      <div className="max-w-2xl mx-auto text-center">
        
        {/* Logo Section */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full mb-6 bg-white shadow-lg p-2">
            <img 
              src={logoImg} 
              alt="Shantix Logo" 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#003366' }}>
            Shantix Corporation
          </h1>
          <p className="text-lg" style={{ color: '#0072BC' }}>
            Your Premier Auto Destination
          </p>
        </div>

        {/* Under Construction Message */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white shadow-lg mb-6">
            <Wrench size={20} style={{ color: '#C9252B' }} />
            <span className="font-semibold" style={{ color: '#003366' }}>Under Construction</span>
          </div>
          
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#003366' }}>
            We're Building Something Amazing!
          </h2>
          
          <p className="text-gray-600 mb-8">
            Our team is working hard to bring you the ultimate car buying experience.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h3 className="text-xl font-bold mb-6" style={{ color: '#003366' }}>
            Contact Information
          </h3>
          
          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: '#0072BC' }}>
                <MapPin size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: '#003366' }}>Locations</p>
                <p className="text-gray-600 text-sm">Dhaka, Bangladesh</p>
                <p className="text-gray-600 text-sm">Chattogram, Bangladesh</p>
              </div>
            </div>

            {/* Phone Numbers */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: '#C9252B' }}>
                <Phone size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: '#003366' }}>Phone</p>
                <p className="text-gray-600 text-sm">+81-45-936-0776</p>
                <p className="text-gray-600 text-sm">+81-45-932-2376</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: '#003366' }}>
                <Mail size={20} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium" style={{ color: '#003366' }}>Email</p>
                <p className="text-gray-600 text-sm">sales@shantix.info</p>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Footer */}
        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            © 2025 Shantix Corporation. Building the future of automotive excellence.
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnderConstruction