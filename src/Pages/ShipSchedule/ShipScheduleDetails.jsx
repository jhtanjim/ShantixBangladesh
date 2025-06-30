import { Link, useNavigate, useParams } from "react-router-dom";
import useShipSchedule from "../../hooks/useShipSchedule";

const ShipScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schedules, isLoading, isError } = useShipSchedule();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading schedule details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to load ship schedule
          </h2>
          <p className="text-gray-600 mb-6">
            Please try again later or contact support if the problem persists.
          </p>
          <Link to={"/"}>
            <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Back to Schedules
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const schedule = schedules?.data?.find((item) => item.id === id);

  if (!schedule) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.886-6.134-2.34m0 0A7.962 7.962 0 014 9c0-5.522 4.477-10 10-10s10 4.478 10 10c0 2.34-.886 4.5-2.34 6.134m0 0A7.962 7.962 0 0115 20c-2.34 0-4.5-.886-6.134-2.34m0 0A7.962 7.962 0 019 20c-2.34 0-4.5-.886-6.134-2.34"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Schedule not found
          </h2>
          <p className="text-gray-600 mb-6">
            Check the URL or go back to the schedule list.
          </p>
          <Link to={"/shipSchedule"}>
            <button className=" cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Back to Schedules
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to={"/shipSchedule"}>
            <button className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Schedules
            </button>
          </Link>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {schedule.title}
                </h1>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      schedule.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        schedule.isActive ? "bg-green-600" : "bg-red-600"
                      }`}
                    ></span>
                    {schedule.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Image Section */}
            {schedule.image && (
              <div className="mb-8">
                <img
                  src={schedule.image}
                  alt={schedule.title}
                  className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">
                  {schedule.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipScheduleDetails;
