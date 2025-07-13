// components/AboutUs/ContactTab.jsx
import { Calendar, Mail, MapPin, Phone } from "lucide-react";

const ContactTab = () => {
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
              <h4 className="font-semibold text-gray-700 mb-2">Japan Office</h4>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM (JST)
              </p>
              <p className="text-gray-600">Saturday: 9:00 AM - 1:00 PM (JST)</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">
                Bangladesh Office
              </h4>
              <p className="text-gray-600">
                Monday - Friday: 9:00 AM - 6:00 PM (BST)
              </p>
              <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM (BST)</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactTab;
