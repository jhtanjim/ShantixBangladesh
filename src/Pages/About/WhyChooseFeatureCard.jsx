// components/AboutUs/WhyChooseFeatureCard.jsx

const WhyChooseFeatureCard = ({ feature, index }) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    purple: "bg-purple-500 text-white",
    red: "bg-red-500 text-white",
    yellow: "bg-yellow-500 text-white",
    pink: "bg-pink-500 text-white",
  };

  const IconComponent = feature.icon;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div
        className={`w-16 h-16 rounded-full ${
          colorClasses[feature.color]
        } flex items-center justify-center mb-4`}
      >
        <IconComponent className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );
};

export default WhyChooseFeatureCard;
