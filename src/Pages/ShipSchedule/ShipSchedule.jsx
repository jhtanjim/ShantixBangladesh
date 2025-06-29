import React from 'react';
import { Ship, Eye } from 'lucide-react';
import useShipSchedule from "../../hooks/useShipSchedule";

const ShipSchedule = () => {
  const { schedules, isLoading, isError } = useShipSchedule();

  // Safe fallback if schedules or schedules.data is undefined
  const activeSchedules = schedules?.data?.filter(schedule => schedule.isActive) || [];

  const handleViewDetails = (scheduleId) => {
    // Handle view details - you can navigate to details page or open modal
    console.log('View details for schedule ID:', scheduleId);
    // Example: navigate to details page
    // window.location.href = `/schedule/${scheduleId}`;
    // Or use React Router: navigate(`/schedule/${scheduleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#E5E5E5' }}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-center items-center h-64">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-4"
              style={{ borderColor: '#0072BC' }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#E5E5E5' }}>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6 border-l-4" style={{ borderLeftColor: '#C9252B' }}>
            <p style={{ color: '#C9252B' }}>Unable to load ship schedules. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#E5E5E5' }}>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#003366' }}>
            Ship Schedules
          </h1>
          <p className="text-lg" style={{ color: '#003366' }}>
            Discover our available ship routes and schedules
          </p>
        </div>

        {/* Content */}
        {activeSchedules.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Ship style={{ color: '#0072BC' }} size={48} className="mx-auto mb-4" />
              <p className="text-lg mb-2" style={{ color: '#003366' }}>No active schedules available</p>
              <p style={{ color: '#003366' }}>Please check back later for updated schedules.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image */}
                <div className="h-48 overflow-hidden" style={{ backgroundColor: '#E5E5E5' }}>
                  {schedule.image ? (
                    <img
                      src={schedule.image}
                      alt={schedule.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-full h-full items-center justify-center ${schedule.image ? 'hidden' : 'flex'}`}
                    style={{ backgroundColor: '#E5E5E5' }}
                  >
                    <Ship style={{ color: '#0072BC' }} size={64} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#003366' }}>
                    {schedule.title}
                  </h3>
                  
                  <button
                    onClick={() => handleViewDetails(schedule.id)}
                    className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#0072BC' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#003366'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0072BC'}
                  >
                    <Eye size={18} />
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipSchedule;