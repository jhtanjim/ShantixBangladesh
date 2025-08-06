export const CompactSpecCard = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-xs">
    <div className="text-[#0072BC] flex-shrink-0">{icon}</div>
    <div className="min-w-0 flex-1">
      <div className="text-gray-600 truncate">{label}</div>
      <div className="font-semibold text-[#003366] truncate">
        {value || "N/A"}
      </div>
    </div>
  </div>
);
