// components/AboutUs/TabNavigation.jsx

const TabNavigation = ({ tabs, activeTab, setActiveTab }) => {
  return (
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
  );
};

export default TabNavigation;
