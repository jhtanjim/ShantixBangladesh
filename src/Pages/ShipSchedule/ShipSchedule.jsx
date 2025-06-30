import { useState } from "react";
import { Link } from "react-router-dom";
import useShipSchedule from "../../hooks/useShipSchedule";

const ShipSchedule = () => {
  const { schedules, isLoading, isError } = useShipSchedule();
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">
          Failed to load ship schedules
        </p>
        <p className="text-red-500 text-sm mt-1">Please try again later</p>
      </div>
    );
  }

  if (!schedules?.data || schedules.data.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600 font-medium">No ship schedules available</p>
        <p className="text-gray-500 text-sm mt-1">
          Check back later for updates
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ship Schedules
        </h1>
        <p className="text-gray-600">
          Total Schedules: {schedules.data.length}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schedules.data.map((schedule) => (
          <Link
            key={schedule.id}
            to={`/shipSchedule/${schedule.id}`}
            className="group block"
          >
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2">
              <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                {schedule.image ? (
                  <img
                    src={schedule.image}
                    alt={schedule.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                    <svg
                      className="w-16 h-16 text-blue-400 transition-transform duration-500 group-hover:scale-125"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
                    </svg>
                  </div>
                )}

                {schedule.isActive && (
                  <div className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold bg-emerald-500 text-white rounded-full shadow-lg">
                    Active
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2">
                      {schedule.title}
                    </h3>
                    <p
                      className={`text-sm opacity-90 leading-relaxed transition-all duration-300 ${
                        expandedId === schedule.id ? "" : "line-clamp-3"
                      }`}
                    >
                      {schedule.description}
                    </p>

                    {schedule.description?.length > 100 && (
                      <button
                        onClick={(e) => {
                          e.preventDefault(); // Prevent Link navigation
                          toggleExpand(schedule.id);
                        }}
                        className="mt-1 text-xs underline hover:text-white transition"
                      >
                        {expandedId === schedule.id ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <svg
                      className="w-4 h-4 text-gray-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShipSchedule;
