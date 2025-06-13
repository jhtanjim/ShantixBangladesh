import React from 'react'
import { Calendar, MapPin, Clock, Users, Anchor, Car } from 'lucide-react'

const ShipSchedule = () => {
  const schedules = [
    {
      id: 1,
      title: "Dhaka to Barisal Express",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      route: "Dhaka → Barisal",
      departure: "8:00 AM",
      arrival: "2:00 PM",
      duration: "6 hours",
      capacity: "200 passengers",
      price: "৳450",
      date: "Daily",
      description: "Comfortable passenger ferry service connecting Dhaka to Barisal with modern amenities and scenic river views."
    },
    {
      id: 2,
      title: "Chittagong Coastal Cruise",
      image: "https://images.unsplash.com/photo-1520637836862-4d197d17c35a?w=400&h=250&fit=crop",
      route: "Chittagong → Cox's Bazar",
      departure: "10:30 AM",
      arrival: "6:30 PM",
      duration: "8 hours",
      capacity: "150 passengers",
      price: "৳850",
      date: "Tue, Thu, Sat",
      description: "Scenic coastal journey with premium dining options and entertainment facilities along the beautiful Bay of Bengal."
    },
    {
      id: 3,
      title: "Sylhet River Express",
      image: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?w=400&h=250&fit=crop",
      route: "Sylhet → Sunamganj",
      departure: "7:00 AM",
      arrival: "11:30 AM",
      duration: "4.5 hours",
      capacity: "100 passengers",
      price: "৳320",
      date: "Mon, Wed, Fri",
      description: "Navigate through the beautiful haor region with traditional riverine landscapes and local cultural experiences."
    },
    {
      id: 4,
      title: "Sundarbans Safari Ferry",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
      route: "Khulna → Sundarbans",
      departure: "6:00 AM",
      arrival: "4:00 PM",
      duration: "10 hours",
      capacity: "80 passengers",
      price: "৳1200",
      date: "Weekend Tours",
      description: "Wildlife viewing expedition through the world's largest mangrove forest with guided tours and photography opportunities."
    },
    {
      id: 5,
      title: "Rangpur Northern Route",
      image: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&h=250&fit=crop",
      route: "Rangpur → Kurigram",
      departure: "9:00 AM",
      arrival: "1:00 PM",
      duration: "4 hours",
      capacity: "120 passengers",
      price: "৳280",
      date: "Daily",
      description: "Connect northern districts with reliable ferry service through the Brahmaputra river system."
    },
    {
      id: 6,
      title: "Patuakhali Island Hopper",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop",
      route: "Patuakhali → Kuakata",
      departure: "11:00 AM",
      arrival: "3:30 PM",
      duration: "4.5 hours",
      capacity: "90 passengers",
      price: "৳380",
      date: "Daily",
      description: "Beach destination ferry with sea views and fresh seafood dining options during the scenic coastal journey."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Car className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Ship Schedule</h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our comprehensive ferry routes connecting major destinations across Bangladesh. 
            Book your journey with confidence and comfort.
          </p>
        </div>

        {/* Schedule Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              {/* Card Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={schedule.image} 
                  alt={schedule.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {schedule.price}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <h3 className="text-white text-xl font-bold">{schedule.title}</h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                {/* Route Information */}
                <div className="flex items-center mb-4 text-gray-700">
                  <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="font-semibold">{schedule.route}</span>
                </div>

                {/* Schedule Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Departure</span>
                    </div>
                    <span className="font-semibold text-gray-800">{schedule.departure}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">Arrival</span>
                    </div>
                    <span className="font-semibold text-gray-800">{schedule.arrival}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Schedule</span>
                    </div>
                    <span className="font-semibold text-gray-800">{schedule.date}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Capacity</span>
                    </div>
                    <span className="font-semibold text-gray-800">{schedule.capacity}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-6">
                  {schedule.description}
                </p>

                {/* Duration Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
                    {schedule.duration}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">{schedule.price}</span>
                </div>

                {/* Book Now Button */}
                <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 shadow-md">
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Need Help with Booking?</h2>
            <p className="text-gray-600 mb-6">
              Our customer service team is available 24/7 to assist you with reservations, 
              schedule changes, and travel information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                Call: +880-1XXX-XXXXXX
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Email Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipSchedule