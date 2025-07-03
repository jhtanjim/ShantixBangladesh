import {
  Award,
  Calendar,
  Car,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  Heart,
  Mail,
  MapPin,
  Phone,
  Quote,
  Shield,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

const AboutUs = () => {
  const [activeTab, setActiveTab] = useState("background");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const tabs = [
    { id: "background", label: "Company Background", icon: Globe },
    { id: "contact", label: "Contact Details", icon: Phone },
    { id: "team", label: "Our Team", icon: Users },
    { id: "gallery", label: "Photo Gallery", icon: Car },
    { id: "why-choose", label: "Why Choose Us", icon: Shield },
    { id: "testimonials", label: "Testimonials", icon: Star },
  ];

  const teamMembers = [
    {
      name: "Hiroshi Tanaka",
      position: "CEO & Founder",
      image: "/api/placeholder/150/150",
      bio: "With over 20 years of experience in the automotive industry, Hiroshi founded Shantix Corporation with a vision to bridge Japanese automotive excellence with global markets.",
      expertise: [
        "Business Strategy",
        "Market Development",
        "Quality Assurance",
      ],
    },
    {
      name: "Yuki Yamamoto",
      position: "Export Manager",
      image: "/api/placeholder/150/150",
      bio: "Yuki oversees our international operations and ensures smooth delivery of vehicles to customers worldwide.",
      expertise: ["International Trade", "Logistics", "Customer Relations"],
    },
    {
      name: "Rahman Ahmed",
      position: "Bangladesh Operations Head",
      image: "/api/placeholder/150/150",
      bio: "Rahman manages our Bangladesh operations and has been instrumental in expanding our presence in South Asian markets.",
      expertise: [
        "Market Analysis",
        "Local Partnerships",
        "Operations Management",
      ],
    },
    {
      name: "Sarah Johnson",
      position: "Quality Inspector",
      image: "/api/placeholder/150/150",
      bio: "Sarah ensures every vehicle meets our strict quality standards before export, maintaining our reputation for excellence.",
      expertise: [
        "Vehicle Inspection",
        "Quality Control",
        "Technical Assessment",
      ],
    },
  ];

  const galleryImages = [
    {
      src: "/api/placeholder/400/300",
      alt: "Shantix Corporation Office Building",
      caption: "Our Tokyo Headquarters",
    },
    {
      src: "/api/placeholder/400/300",
      alt: "Vehicle Inspection Facility",
      caption: "State-of-the-art Inspection Facility",
    },
    {
      src: "/api/placeholder/400/300",
      alt: "Car Auction House",
      caption: "Japanese Car Auction House",
    },
    {
      src: "/api/placeholder/400/300",
      alt: "Shipping Port",
      caption: "Vehicle Loading at Port",
    },
    {
      src: "/api/placeholder/400/300",
      alt: "Team Meeting",
      caption: "Our Professional Team",
    },
    {
      src: "/api/placeholder/400/300",
      alt: "Customer Delivery",
      caption: "Happy Customer Delivery",
    },
  ];

  const whyChooseFeatures = [
    {
      icon: Shield,
      title: "Strict Quality Inspection",
      description:
        "Every vehicle undergoes comprehensive 150-point inspection by certified technicians",
      color: "blue",
    },
    {
      icon: Globe,
      title: "Global Network",
      description:
        "Serving 50+ countries with established logistics and shipping partnerships",
      color: "green",
    },
    {
      icon: Car,
      title: "Vast Inventory",
      description:
        "300,000+ vehicles available from major auction houses and dealers",
      color: "purple",
    },
    {
      icon: Users,
      title: "Expert Team",
      description:
        "15+ years of experience in Japanese automotive export industry",
      color: "red",
    },
    {
      icon: Award,
      title: "Certified Excellence",
      description:
        "ISO certified processes and industry-recognized quality standards",
      color: "yellow",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Dedicated support team ensuring satisfaction from inquiry to delivery",
      color: "pink",
    },
  ];

  const testimonials = [
    {
      name: "Michael Thompson",
      country: "Australia",
      rating: 5,
      text: "Exceptional service from start to finish. The vehicle arrived exactly as described and the entire process was smooth and professional.",
      vehicle: "Toyota Prius 2018",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Abdul Rahman",
      country: "Bangladesh",
      rating: 5,
      text: "Shantix Corporation has been our trusted partner for over 5 years. Their quality and reliability is unmatched in the industry.",
      vehicle: "Honda Civic 2019",
      image: "/api/placeholder/60/60",
    },
    {
      name: "James Wilson",
      country: "UK",
      rating: 5,
      text: "Outstanding quality inspection and transparent communication. Highly recommend for anyone looking for Japanese used cars.",
      vehicle: "Nissan X-Trail 2020",
      image: "/api/placeholder/60/60",
    },
    {
      name: "Maria Santos",
      country: "Tanzania",
      rating: 5,
      text: "Professional team with excellent customer service. The vehicle quality exceeded my expectations.",
      vehicle: "Mazda CX-5 2017",
      image: "/api/placeholder/60/60",
    },
  ];

  const stats = [
    { icon: Car, number: "300,000+", label: "Vehicles Available" },
    { icon: Globe, number: "50+", label: "Countries Served" },
    { icon: Shield, number: "100%", label: "Quality Inspected" },
    { icon: Users, number: "15+", label: "Years Experience" },
  ];

  const brands = [
    "Toyota",
    "Honda",
    "Nissan",
    "Mitsubishi",
    "Mazda",
    "Subaru",
    "Isuzu",
    "Suzuki",
    "Daihatsu",
    "BMW",
    "Mercedes",
    "Audi",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case "background":
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
              <h2 className="text-4xl font-bold mb-4">
                Leading Japanese Vehicle Exporter
              </h2>
              <p className="text-xl text-blue-100">
                Trusted Global Partner Since 2009
              </p>
            </div>

            {/* Company Story */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                Our Story
              </h3>
              <div className="prose prose-lg text-gray-700">
                <p className="mb-4">
                  Shantix Corporation Japan was founded in 2009 with a simple
                  yet powerful vision: to make high-quality Japanese vehicles
                  accessible to customers around the world. What started as a
                  small export business has grown into one of Japan's most
                  trusted automotive exporters.
                </p>
                <p className="mb-4">
                  Our journey began when our founder, Hiroshi Tanaka, recognized
                  the growing global demand for reliable Japanese vehicles. With
                  his deep understanding of the Japanese automotive market and
                  passion for excellence, he established Shantix Corporation to
                  bridge the gap between Japanese automotive excellence and
                  international markets.
                </p>
                <p>
                  Today, we are proud to serve customers in over 50 countries,
                  maintaining our commitment to quality, transparency, and
                  customer satisfaction that has defined us from the beginning.
                </p>
              </div>
            </div>

            {/* Mission & Vision */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg shadow-lg p-8 text-white">
                <Target className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-red-100 leading-relaxed">
                  To deliver top-quality Japanese vehicles with honesty,
                  professionalism, and unmatched customer service — ensuring
                  every client is satisfied and every partnership thrives.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white">
                <Globe className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-green-100 leading-relaxed">
                  To become the world's most trusted name in Japanese vehicle
                  exports, setting the standard for quality, reliability, and
                  customer satisfaction in the global automotive market.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                  >
                    <IconComponent className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <div className="text-2xl font-bold text-gray-800 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Brands */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Vehicle Brands We Export
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 text-center hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-700">{brand}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Japan Office */}
                <div className="border-l-4 border-blue-600 pl-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-6 h-6 text-blue-600 mr-2" />
                    Japan Office (Headquarters)
                  </h3>
                  <div className="text-gray-700 space-y-2">
                    <p>Shin-Okubo Building 2, 3rd floor,</p>
                    <p>1-11-1, Hyakunincho, Shinjuku-ku,</p>
                    <p>Tokyo 169-0073, Japan</p>
                    <div className="flex items-center mt-4">
                      <Phone className="w-5 h-5 text-blue-600 mr-2" />
                      <span>+81 70 8393 1325</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-blue-600 mr-2" />
                      <span>info@shantix.jp</span>
                    </div>
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
                    <p>Chattogram, Bangladesh</p>
                    <div className="flex items-center mt-4">
                      <Phone className="w-5 h-5 text-green-600 mr-2" />
                      <span>+880 1711 123456</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-green-600 mr-2" />
                      <span>bd@shantix.jp</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                  Business Hours
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Japan Office
                    </h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (JST)
                    </p>
                    <p className="text-gray-600">
                      Saturday: 9:00 AM - 1:00 PM (JST)
                    </p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Bangladesh Office
                    </h4>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 6:00 PM (BST)
                    </p>
                    <p className="text-gray-600">
                      Saturday: 9:00 AM - 2:00 PM (BST)
                    </p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "team":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Meet Our Team
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated team of professionals brings together decades of
                experience in the automotive industry, committed to delivering
                excellence in every aspect of our service.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800">
                        {member.name}
                      </h3>
                      <p className="text-blue-600 font-semibold mb-2">
                        {member.position}
                      </p>
                      <p className="text-gray-600 text-sm mb-3">{member.bio}</p>
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "gallery":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Photo Gallery
              </h2>
              <p className="text-gray-600">
                Take a look at our facilities, operations, and team in action
              </p>
            </div>

            {/* Main Image Display */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="relative">
                <img
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-between p-4">
                  <button
                    onClick={prevImage}
                    className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/60 text-white p-3 rounded-lg">
                    <h3 className="font-semibold">
                      {galleryImages[currentImageIndex].caption}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden transition-all ${
                    index === currentImageIndex
                      ? "ring-4 ring-blue-600"
                      : "hover:ring-2 hover:ring-blue-300"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-20 object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "why-choose":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Why Choose Shantix Corporation?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We stand out in the industry through our commitment to quality,
                innovation, and customer satisfaction. Here's what makes us your
                ideal partner for Japanese vehicle exports.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                const colorClasses = {
                  blue: "bg-blue-500 text-white",
                  green: "bg-green-500 text-white",
                  purple: "bg-purple-500 text-white",
                  red: "bg-red-500 text-white",
                  yellow: "bg-yellow-500 text-white",
                  pink: "bg-pink-500 text-white",
                };

                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${
                        colorClasses[feature.color]
                      } flex items-center justify-center mb-4`}
                    >
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Additional Benefits */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Additional Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Competitive pricing with no hidden fees</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Comprehensive vehicle history reports</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Flexible payment options</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Real-time shipment tracking</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>24/7 customer support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-300" />
                    <span>Post-delivery support and assistance</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "testimonials":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Don't just take our word for it. Here's what our satisfied
                customers from around the world have to say about their
                experience with Shantix Corporation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Quote className="w-5 h-5 text-blue-600 mr-2" />
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-yellow-500 fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 italic">
                        "{testimonial.text}"
                      </p>
                      <div className="border-t pt-4">
                        <p className="font-semibold text-gray-800">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {testimonial.country}
                        </p>
                        <p className="text-sm text-blue-600 font-medium">
                          {testimonial.vehicle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Satisfaction Stats */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-6 text-center">
                Customer Satisfaction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <p className="text-green-100">Customer Satisfaction Rate</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">15,000+</div>
                  <p className="text-green-100">Happy Customers</p>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">4.9/5</div>
                  <p className="text-green-100">Average Rating</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Shantix Corporation</h1>
          <p className="text-xl text-blue-100">
            Your Trusted Partner in Japanese Vehicle Exports
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-2">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <IconComponent className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-8">{renderContent()}</div>
    </div>
  );
};

export default AboutUs;
