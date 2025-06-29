import React from 'react'
import useShipSchedule from '../../hooks/useShipSchedule';
import { Link } from 'react-router-dom';

const ShipSchedule = () => {
    const { schedules, isLoading, isError } = useShipSchedule();
    // console.log(schedules.data)
    // Handle loading state
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    
    // Handle error state
    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 font-medium">Failed to load ship schedules</p>
                <p className="text-red-500 text-sm mt-1">Please try again later</p>
            </div>
        );
    }
    
    // Handle empty data
    if (!schedules?.data || schedules.data.length === 0) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                <p className="text-gray-600 font-medium">No ship schedules available</p>
                <p className="text-gray-500 text-sm mt-1">Check back later for updates</p>
            </div>
        );
    }
    
    // Format date helper function
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    return (
        <div className="max-w-7xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Ship Schedules</h1>
                <p className="text-gray-600">Total Schedules: {schedules.data.length}</p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {schedules.data.map((schedule) => (
                 <Link to={`/shipSchedule/${schedule.id}`}>
   
                    <div 
                        key={schedule.id} 
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                        {/* Image Section */}
                        <div className="w-full h-48 bg-gray-100">
                            {schedule.image ? (
                                <img 
                                    src={schedule.image} 
                                    alt={schedule.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                                    <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                                    </svg>
                                </div>
                            )}
                        </div>
                        
                        {/* Content Section */}
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-lg font-semibold text-gray-900 truncate">
                                    {schedule.title}
                                </h2>
                                {schedule.isActive && (
                                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>
                            
                            <p className="text-gray-700 text-sm mb-4 leading-relaxed line-clamp-3">
                                {schedule.description}
                            </p>
                            
                            <div className="space-y-2 text-xs text-gray-500">
                                <div>
                                    <strong>Created:</strong> {formatDate(schedule.createdAt)}
                                </div>
                                <div>
                                    <strong>Updated:</strong> {formatDate(schedule.updatedAt)}
                                </div>
                            </div>
                            
                            <div className="mt-4 pt-3 border-t border-gray-100">
                                <span className="text-xs text-gray-400 font-mono">
                                    ID: {schedule.id.slice(-8)}
                                </span>
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