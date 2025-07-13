// components/AboutUs/BackgroundTab.jsx
import { Globe, Target } from "lucide-react";
import BrandsSection from "./BrandsSection";
import StatsSection from "./StatsSection";

const BackgroundTab = ({ stats, brands }) => {
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
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Our Story</h3>
        <div className="prose prose-lg text-gray-700">
          <p className="mb-4">
            Shantix Corporation Japan was founded in 2009 with a simple yet
            powerful vision: to make high-quality Japanese vehicles accessible
            to customers around the world. What started as a small export
            business has grown into one of Japan's most trusted automotive
            exporters.
          </p>
          <p className="mb-4">
            Our journey began when our founder, Hiroshi Tanaka, recognized the
            growing global demand for reliable Japanese vehicles. With his deep
            understanding of the Japanese automotive market and passion for
            excellence, he established Shantix Corporation to bridge the gap
            between Japanese automotive excellence and international markets.
          </p>
          <p>
            Today, we are proud to serve customers in over 50 countries,
            maintaining our commitment to quality, transparency, and customer
            satisfaction that has defined us from the beginning.
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
            professionalism, and unmatched customer service — ensuring every
            client is satisfied and every partnership thrives.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg shadow-lg p-8 text-white">
          <Globe className="w-12 h-12 mb-4" />
          <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
          <p className="text-green-100 leading-relaxed">
            To become the world's most trusted name in Japanese vehicle exports,
            setting the standard for quality, reliability, and customer
            satisfaction in the global automotive market.
          </p>
        </div>
      </div>

      {/* Stats */}
      <StatsSection stats={stats} />

      {/* Brands */}
      <BrandsSection brands={brands} />
    </div>
  );
};

export default BackgroundTab;
