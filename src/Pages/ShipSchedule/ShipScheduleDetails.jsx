import { Link, useNavigate, useParams } from "react-router-dom";
import useShipSchedule from "../../hooks/useShipSchedule";

const ShipScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schedules, isLoading, isError } = useShipSchedule();

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: "#0072BC" }}
          ></div>
          <p className="text-gray-600">Loading schedule details...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div
            className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#C9252B" }}
          >
            <svg
              className="w-8 h-8 text-white"
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
            <button
              className="cursor-pointer text-white px-6 py-2 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0072BC" }}
            >
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#E5E5E5" }}
      >
        <div className="text-center max-w-md mx-auto p-6">
          <div
            className="rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#C9252B" }}
          >
            <svg
              className="w-8 h-8 text-white"
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
            <button
              className="cursor-pointer text-white px-6 py-2 rounded-lg transition-colors hover:opacity-90"
              style={{ backgroundColor: "#0072BC" }}
            >
              Back to Schedules
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#E5E5E5" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link to={"/shipSchedule"}>
            <button
              className="inline-flex items-center transition-colors mb-4 hover:opacity-80"
              style={{ color: "#0072BC" }}
            >
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
          <div
            className="px-8 py-6"
            style={{
              background: `linear-gradient(to right, #003366, #0072BC)`,
            }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {schedule.title}
                </h1>
                {/* <div className="flex items-center">
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
                </div> */}
              </div>

              {/* PDF Download Button in Header */}
              {schedule.pdf && (
                <a
                  href={schedule.pdf}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
                  title="Download PDF"
                >
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
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download PDF
                </a>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Image Section */}
            <div className="mb-8">
              {schedule.image ? (
                <div className="relative">
                  <img
                    src={schedule.image}
                    alt={schedule.title}
                    className="w-full h-64 sm:h-80 object-cover rounded-lg shadow-md"
                  />
                  {/* PDF Logo Overlay on Image */}
                  {schedule.pdf && (
                    <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-8 h-8"
                          style={{ color: "#C9252B" }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                        <span className="text-sm font-semibold text-gray-700">
                          PDF Available
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // If no image, show PDF placeholder
                schedule.pdf && (
                  <div className="w-full h-64 sm:h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md flex items-center justify-center">
                    <a
                      href={schedule.pdf}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-all duration-300"
                      title="Download PDF"
                    >
                      <div className="text-center">
                        <svg
                          className="w-16 h-16 mx-auto mb-4"
                          style={{ color: "#C9252B" }}
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                          <path d="M14 2v6h6" />
                          <path d="M16 13H8" />
                          <path d="M16 17H8" />
                          <path d="M10 9H8" />
                        </svg>
                        <p className="text-lg font-semibold text-gray-700">
                          {schedule.title}.pdf
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Click download to view
                        </p>
                      </div>
                    </a>
                  </div>
                )
              )}
            </div>

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
