import { Link } from 'react-router-dom';
import logoImg from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#003366] to-[#001933] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0072BC] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9252B] rounded-full blur-3xl transform -translate-x-24 translate-y-24"></div>
      </div>
      
      <div className="relative z-10">
        {/* Main footer content */}
        <div className="container mx-auto px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Logo Section */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start">
              <div className="mb-6">
                <img 
                  src={logoImg} 
                  alt="Shantix Logo" 
                  className="h-32 lg:h-40 w-auto filter drop-shadow-lg hover:scale-105 transition-transform duration-300" 
                />
              </div>
              <p className="text-gray-300 text-center lg:text-left leading-relaxed max-w-sm">
                Your trusted partner in automotive excellence, connecting quality vehicles with customers worldwide.
              </p>
            </div>

            {/* Navigation Links */}
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">
                <span className="bg-gradient-to-r from-[#0072BC] to-[#C9252B] bg-clip-text text-transparent">
                  Quick Links
                </span>
              </h3>
              <nav className="grid grid-cols-2 gap-y-3 gap-x-4 lg:grid-cols-1 lg:gap-y-4">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About Us" },
                  { to: "/stock", label: "Stock List" },
                  { to: "/auction", label: "Auction" },
                  { to: "/container", label: "Container" },
                  { to: "/how-to-buy", label: "How To Buy" },
                  { to: "/contact", label: "Contact Us" }
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="text-gray-300 hover:text-[#0072BC] transition-all duration-300 font-medium text-lg group flex items-center"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#0072BC] transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-4">
              <h3 className="text-2xl font-bold mb-6 text-center lg:text-left">
                <span className="bg-gradient-to-r from-[#0072BC] to-[#C9252B] bg-clip-text text-transparent">
                  Contact Info
                </span>
              </h3>
              
              <div className="space-y-6">
                {/* Company Name */}
                <div className="text-center lg:text-left">
                  <h4 className="text-xl font-semibold text-[#0072BC] mb-2">Shantix Corporation</h4>
                  <div className="space-y-2">
                    <p className="text-gray-300 flex items-center justify-center lg:justify-start">
                      <span className="mr-3 text-[#0072BC]">📍</span>
                      Dhaka, Bangladesh
                    </p>
                    <p className="text-gray-300 flex items-center justify-center lg:justify-start">
                      <span className="mr-3 text-[#0072BC]">📍</span>
                      Chattogram, Bangladesh
                    </p>
                  </div>
                </div>

                {/* Contact Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center lg:justify-start group">
                    <span className="mr-3 text-[#0072BC] group-hover:scale-110 transition-transform duration-300">📞</span>
                    <a 
                      href="tel:+81-45-936-0776" 
                      className="text-gray-300 hover:text-[#0072BC] transition-colors duration-300 font-medium"
                    >
                      +81-45-936-0776
                    </a>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start group">
                    <span className="mr-3 text-[#0072BC] group-hover:scale-110 transition-transform duration-300">📞</span>
                    <a 
                      href="tel:+81-45-932-2376" 
                      className="text-gray-300 hover:text-[#0072BC] transition-colors duration-300 font-medium"
                    >
                      +81-45-932-2376
                    </a>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start group">
                    <span className="mr-3 text-[#0072BC] group-hover:scale-110 transition-transform duration-300">✉️</span>
                    <a 
                      href="mailto:sales@shantix.info" 
                      className="text-gray-300 hover:text-[#0072BC] transition-colors duration-300 font-medium"
                    >
                      sales@shantix.info
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Shantix Corporation. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-[#0072BC] text-sm transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-[#0072BC] text-sm transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;