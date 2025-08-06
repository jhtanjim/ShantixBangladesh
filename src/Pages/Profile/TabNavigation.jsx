import { Car, User } from "lucide-react";

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-white rounded-lg p-1 shadow-lg border flex gap-2">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
            activeTab === "profile"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <User className="w-4 h-4" />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("mycar")}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-medium transition-all ${
            activeTab === "mycar"
              ? "bg-blue-600 text-white shadow-md"
              : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
          }`}
        >
          <Car className="w-4 h-4" />
          My Cars
        </button>
      </div>
    </div>
  );
};

export default TabNavigation;
