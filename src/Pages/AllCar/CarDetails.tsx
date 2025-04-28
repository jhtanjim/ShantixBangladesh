import React from 'react'
import firstImage from "../../assets/images/first.jpg"
import secondImage from "../../assets/images/second.jpg"
import thirdImage from "../../assets/images/third.jpg"
import fourthImage from "../../assets/images/fourth.jpg"

const CarDetails = () => {
  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Header */}
      <h1 className="text-2xl font-bold text-red-600 mb-4">Toyota Corolla Cross Z Leather 2022 Pearl White Hybrid</h1>
      
      {/* Main Image */}
      <div className="mb-6">
        <img src={firstImage} alt="Toyota Corolla Cross - Side View" className="w-full rounded-lg" />
      </div>
      
      {/* Image Gallery */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <img src={secondImage} alt="Steering Wheel" className="w-full h-70 object-cover rounded-lg" />
        <img src={thirdImage} alt="Front View" className="w-full h-70 object-cover rounded-lg" />
        <img src={fourthImage} alt="Interior" className="w-full h-70 object-cover rounded-lg" />
      </div>
      
      {/* Features Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold uppercase mb-2">Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Safety */}
          <div>
            <h3 className="font-medium text-red-600 mb-2">Safety</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                ABS brakes
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Safety belts
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Emergency brake
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Cruise control
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Central locking
              </li>
            </ul>
          </div>
          
          {/* Interior */}
          <div>
            <h3 className="font-medium text-red-600 mb-2">Interior</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Leather seats
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                A/C Dual
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Bluetooth
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Cup holders
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Remote trunk
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Keyless start
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                TV Navigation
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Push button
              </li>
            </ul>
          </div>
          
          {/* Exterior */}
          <div>
            <h3 className="font-medium text-red-600 mb-2">Exterior</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Fog lights
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                LED headlights
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Alloy wheels
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Sun roof
              </li>
            </ul>
          </div>
          
          {/* Special */}
          <div>
            <h3 className="font-medium text-red-600 mb-2">Special</h3>
            <ul className="space-y-1">
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Park assist
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Backup camera
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Push start
              </li>
              <li className="flex items-center">
                <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
                Keyless doors
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Specs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
        <div>
          <h3 className="font-medium text-red-600 mb-2">Years</h3>
          <p>2022</p>
        </div>
        <div>
          <h3 className="font-medium text-red-600 mb-2">Fuel</h3>
          <p>Hybrid</p>
        </div>
        <div>
          <h3 className="font-medium text-red-600 mb-2">Exterior Color</h3>
          <p>Pearl White</p>
        </div>
        <div>
          <h3 className="font-medium text-red-600 mb-2">Seats</h3>
          <p>5</p>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="bg-blue-600 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-1">Contact Information</h2>
        <h3 className="text-2xl font-bold mb-4">SHANTIX Corporation</h3>
        
        <div className="space-y-3">
          <div className="flex items-start">
            <div className="bg-blue-500 p-2 rounded-lg mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p>Dhaka, Bangladesh</p>
              <p>Chattogram, Bangladesh</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <div>
              <p>+81-45-936-0776</p>
              <p>+81-45-932-2376</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-blue-500 p-2 rounded-lg mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <p>sales@shantix.info</p>
          </div>
        </div>
      </div>
      
      {/* Price */}
      <div className="mt-6 flex justify-end">
        <div className="bg-red-600 text-white px-6 py-3 rounded-lg flex items-center">
          <div>
            <p className="text-sm">Price</p>
            <p className="text-xl font-bold">$79,888</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarDetails