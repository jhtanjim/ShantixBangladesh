import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useShipSchedule from '../../hooks/useShipSchedule';

const ShipScheduleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { schedules, isLoading, isError } = useShipSchedule();

  const handleBackClick = () => {
    navigate('/shipSchedule');
  };

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
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load ship schedule</h2>
          <p className="text-gray-600 mb-6">Please try again later or contact support if the problem persists.</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Schedules
          </button>
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
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.886-6.134-2.34m0 0A7.962 7.962 0 014 9c0-5.522 4.477-10 10-10s10 4.478 10 10c0 2.34-.886 4.5-2.34 6.134m0 0A7.962 7.962 0 0115 20c-2.34 0-4.5-.886-6.134-2.34m0 0A7.962 7.962 0 019 20c-2.34 0-4.5-.886-6.134-2.34" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Schedule not found</h2>
          <p className="text-gray-600 mb-6">Check the URL or go back to the schedule list.</p>
          <button
            onClick={handleBackClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Back to Schedules
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={handleBackClick}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Schedules
          </button>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{schedule.title}</h1>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      schedule.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full mr-2 ${
                        schedule.isActive ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    ></span>
                    {schedule.isActive ? 'Active' : 'Inactive'}
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
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 leading-relaxed">{schedule.description}</p>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Created</h3>
                </div>
                <p className="text-gray-700">{formatDate(schedule.createdAt)}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Last Updated</h3>
                </div>
                <p className="text-gray-700">{formatDate(schedule.updatedAt)}</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <div className="flex items-center mb-2">
                  <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <h3 className="font-semibold text-gray-900">Schedule ID</h3>
                </div>
                <p className="text-gray-700 font-mono text-sm">{schedule.id}</p>
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBackClick}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to List
              </button>
              <div className="text-sm text-gray-500">
                Schedule Details
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipScheduleDetails