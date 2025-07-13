// components/AboutUs/StatsSection.jsx

const StatsSection = ({ stats }) => {
  return (
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
  );
};

export default StatsSection;
