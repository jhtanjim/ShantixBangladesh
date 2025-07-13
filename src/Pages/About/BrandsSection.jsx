// components/AboutUs/BrandsSection.jsx

const BrandsSection = ({ brands }) => {
  return (
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
  );
};

export default BrandsSection;
