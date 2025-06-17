import React from 'react';
import { MapPin, Phone, Globe, Shield, Car, Users } from 'lucide-react';
import bannerImg from "../../assets/images/aboutBanner.jpg";
import coverImg from "../../assets/images/aboutcover.jpg";

const About = () => {
  const brands = [
    'Toyota', 'Honda', 'Nissan', 'Mitsubishi', 'Mazda', 
    'Subaru', 'Isuzu', 'Suzuki', 'Daihatsu', 'BMW', 'Mercedes','Audi'
  ];

  const countries = ['UK', 'Bangladesh', 'Tanzania', 'Australia'];

  const stats = [
    { icon: Car, number: '300,000+', label: 'Vehicles Available' },
    { icon: Globe, number: '50+', label: 'Countries Served' },
    { icon: Shield, number: '100%', label: 'Quality Inspected' },
    { icon: Users, number: '15+', label: 'Years Experience' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative h-96 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 51, 102, 0.8), rgba(0, 114, 188, 0.8)), url(${bannerImg})`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About Shantix Corporation</h1>
            <p className="text-xl font-light">Trusted Global Partner in Japanese Used Cars</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Company Introduction */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Leading Japanese Vehicle Exporter</h2>
            <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shantix Corporation Japan is a leading exporter of premium Japanese used vehicles and auto parts, 
                delivering excellence to customers around the world. Headquartered in Japan, we specialize in the 
                export of high-quality Right-Hand Drive (RHD) and Left-Hand Drive (LHD) vehicles to a wide range 
                of international markets.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Our strong ties with major Japanese auction houses, authorized dealerships, and nationwide suppliers 
                enable us to provide exceptional value and a broad variety of choices to our clients.
              </p>
            </div>
            <div className="relative">
              <img 
                src={coverImg} 
                alt="Shantix Corporation - Japanese Used Cars" 
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Why Choose Shantix Corporation?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">Strict Quality Inspection</h4>
              <p className="text-gray-600 text-sm">Every vehicle undergoes rigorous quality checks</p>
            </div>
            <div className="text-center">
              <Car className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">300,000+ Vehicles</h4>
              <p className="text-gray-600 text-sm">Extensive inventory from all major auction houses</p>
            </div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">Global Shipping</h4>
              <p className="text-gray-600 text-sm">Worldwide delivery network and logistics</p>
            </div>
            <div className="text-center">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-800 mb-2">Trusted Partnerships</h4>
              <p className="text-gray-600 text-sm">Long-term relationships with satisfied clients</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
                <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-2xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Vehicle Brands Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Vehicle Brands We Export</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors">
                <span className="font-semibold text-gray-700">{brand}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-600 mt-6">
            We offer vehicles from Japan's most renowned manufacturers as well as European premium brands.
          </p>
        </div>

        {/* Global Reach & Mission */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Globe className="w-8 h-8 text-blue-600 mr-3" />
              Our Global Reach
            </h3>
            <p className="text-gray-700 mb-4">
              We proudly serve customers in multiple countries across different continents. 
              Our growing international network is built on trust, long-term partnerships, 
              and a shared commitment to excellence.
            </p>
            <div className="flex flex-wrap gap-2">
              {countries.map((country, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {country}
                </span>
              ))}
              <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                and many more...
              </span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
            <p className="text-red-100 leading-relaxed">
              To deliver top-quality Japanese vehicles with honesty, professionalism, 
              and unmatched customer service — ensuring every client is satisfied and 
              every partnership thrives.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Japan Office */}
            <div className="border-l-4 border-blue-600 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                Japan Office
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>Shin-Okubo Building 2, 3rd floor,</p>
                <p>1-11-1, Hyakunincho, Shinjuku-ku,</p>
                <p>Tokyo 169-0073, Japan</p>
              </div>
            </div>

            {/* Bangladesh Office */}
            <div className="border-l-4 border-green-600 pl-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-6 h-6 text-green-600 mr-2" />
                Bangladesh Office
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>533/659, Standard City Plaza (2nd floor),</p>
                <p>Sk Mujib Road, Dewanhat,</p>
                <p>Chattogram</p>
              </div>
            </div>
          </div>

          {/* Contact Number */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center bg-blue-50 rounded-lg p-4">
              <Phone className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Contact Number</p>
                <p className="text-lg font-semibold text-gray-800">+81 70 8393 1325</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;