// components/AboutUs/WhyChooseTab.jsx
import { CheckCircle } from "lucide-react";
import WhyChooseFeatureCard from "./WhyChooseFeatureCard";

const WhyChooseTab = ({ whyChooseFeatures }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Why Choose Shantix Corporation?
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          We stand out in the industry through our commitment to quality,
          innovation, and customer satisfaction. Here's what makes us your ideal
          partner for Japanese vehicle exports.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {whyChooseFeatures.map((feature, index) => (
          <WhyChooseFeatureCard key={index} feature={feature} index={index} />
        ))}
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
};

export default WhyChooseTab;
