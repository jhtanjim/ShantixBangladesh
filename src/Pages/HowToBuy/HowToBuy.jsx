import React, { useState } from 'react';
import { Phone, MapPin, Mail, Car, Clock, CreditCard, Ship, Search, FileText, CheckCircle } from 'lucide-react';

const HowToBuy = () => {
  const [activeTab, setActiveTab] = useState('auction');

  const contactInfo = {
    phone: '+8170 8393 1325',
    japanOffice: 'Shin-Okubo Building 2, 3rd floor, 1-11-1, Hyakunincho, Shinjuku-ku, Tokyo 169-0073, Japan',
    bdOffice: '533/659, Standard City Plaza (2nd floor), Sk Mujib Road, Dewanhat, Chattogram'
  };

  const auctionSteps = [
    {
      step: 1,
      title: 'Contact Shantix Corporation Japan',
      description: 'Fill in your name and contact information followed by the type of car you are looking for. A sales representative will inform you about availability, market prices, and total operation cost. You will also get access to our Japanese auto auction search engine.',
      icon: <Phone className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Get Auction Access',
      description: 'You will have limited access to the auction search engine. Once you have found the car of your choice, we will provide you more details of that car.',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Make Deposit',
      description: 'Before bidding, we must receive a totally refundable deposit of 100,000 JPY via Telegraphic Transfer or PayPal. All transfer fees must be covered by the sending party. Refunds are granted within 2 business days of request.',
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Bidding',
      description: 'Once you have collected all necessary information about the car, proceed with bidding through our auction system. Place your maximum bid and our representative will inform you about the auction result.',
      icon: <Car className="w-6 h-6" />
    },
    {
      step: 5,
      title: 'Making Payment After Successful Bid',
      description: 'If you win the bid, a Pro forma invoice will be issued. Our sales representative will inform you of the soonest available vessel departing to your nearest port.',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 6,
      title: 'Shipping Arrangements',
      description: 'When the vessel departs from Japan, we will mail you all necessary documents needed to import the car with ample time before the vessel reaches your destination port.',
      icon: <Ship className="w-6 h-6" />
    }
  ];

  const stockSteps = [
    {
      step: 1,
      title: 'Look at Our Stock Page',
      description: 'We have plenty of options to choose from. You can check out your desired vehicle from our stock list and see details.',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Get More Information',
      description: 'Your Stock Inquiry will be sent to our sales representative. After contact, you can ask more questions directly via email or WhatsApp. You will be informed about availability and other details (such as total CIF price to your destination port).',
      icon: <Mail className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'Receive Invoice and Make Payment',
      description: 'After considering the purchase, let us know if you would like to proceed. We will send you a Proforma invoice and reserve the unit for a maximum of 12 days from your order date.',
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Your Car Will Be Shipped',
      description: 'After confirming full payment, we will advise you of the shipping schedule and start making shipping arrangements. You will receive all necessary documents before the ship arrives at your destination port.',
      icon: <Ship className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">How to Buy from Shantix Corporation</h1>
          
          {/* Contact Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Japan Office
              </h3>
              <p className="text-sm leading-relaxed">{contactInfo.japanOffice}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Bangladesh Office
              </h3>
              <p className="text-sm leading-relaxed">{contactInfo.bdOffice}</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <Phone className="w-5 h-5 mr-2" />
              <span className="text-lg font-medium">{contactInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-lg p-2 flex">
            <button
              onClick={() => setActiveTab('auction')}
              className={`px-8 py-3 rounded-md transition-all duration-300 font-medium ${
                activeTab === 'auction'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Buy from Auction
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-8 py-3 rounded-md transition-all duration-300 font-medium ${
                activeTab === 'stock'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              Buy from Stock
            </button>
          </div>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'auction' && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Japanese Car Auction Process
              </h2>
              <div className="grid gap-8">
                {auctionSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                          <div className="flex items-center mb-3">
                            <div className="text-blue-600 mr-3">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    {index < auctionSteps.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stock' && (
            <div>
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                Buy from Our Stock
              </h2>
              <div className="grid gap-8">
                {stockSteps.map((step, index) => (
                  <div key={step.step} className="relative">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-6">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                          <div className="flex items-center mb-3">
                            <div className="text-red-600 mr-3">{step.icon}</div>
                            <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    {index < stockSteps.length - 1 && (
                      <div className="absolute left-8 top-16 w-0.5 h-8 bg-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Important Notes */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <CheckCircle className="w-6 h-6 mr-2 text-yellow-600" />
              Important Notes
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                All transfer fees must be covered by the sending party
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Deposits are fully refundable within 2 business days of request
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                Stock reservations are held for a maximum of 12 days from order date
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">•</span>
                All necessary import documents will be provided before vessel arrival
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-lg mb-6">Contact us today to begin your car buying journey with Shantix Corporation</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`tel:${contactInfo.phone}`}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
              <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-300 flex items-center justify-center">
                <Mail className="w-5 h-5 mr-2" />
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowToBuy;