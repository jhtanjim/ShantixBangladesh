// components/ShipSchedule/ShipScheduleCard.jsx
import React from 'react';
import { Edit2, Trash2, Eye, EyeOff, Calendar, MapPin, Ship } from 'lucide-react';

const ShipScheduleCard = ({ 
  schedule, 
  onEdit, 
  onToggleStatus, 
  onDelete 
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden group">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
        {schedule.image ? (
          <img
            src={schedule.image}
            alt={schedule.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`${schedule.image ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-white`}
          style={{ display: schedule.image ? 'none' : 'flex' }}
        >
          <Ship size={48} />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            schedule.isActive 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            {schedule.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 flex-1">
            {schedule.title}
          </h3>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {schedule.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          {schedule.createdAt && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(schedule.createdAt).toLocaleDateString()}
            </div>
          )}
          <div className="flex items-center gap-1">
            <MapPin size={12} />
            Schedule
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(schedule)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit Schedule"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onToggleStatus(schedule)}
              className={`p-2 rounded-lg transition-colors ${
                schedule.isActive 
                  ? 'text-red-600 hover:bg-red-50' 
                  : 'text-green-600 hover:bg-green-50'
              }`}
              title={schedule.isActive ? 'Deactivate' : 'Activate'}
            >
              {schedule.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <button
              onClick={() => onDelete(schedule)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Schedule"
            >
              <Trash2 size={16} />
            </button>
          </div>
          
          <div className="flex items-center text-xs text-gray-400">
            ID: {schedule.id}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipScheduleCard;
