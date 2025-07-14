// components/ShipSchedule/ShipScheduleList.jsx - Complete main component
import {
  AlertCircle,
  Calendar,
  Loader,
  Plus,
  RefreshCw,
  Ship,
} from "lucide-react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import useShipSchedule from "../../../../hooks/useShipSchedule";
import ShipScheduleCard from "./ShipScheduleCard";
import ShipScheduleCreate from "./ShipScheduleCreate";
import ShipScheduleEdit from "./ShipScheduleEdit";
import ShipScheduleFilters from "./ShipScheduleFilters";

const ShipScheduleList = () => {
  const {
    adminSchedules,
    isLoading,
    error,
    // refetch,
    deleteMutation,
    updateMutation,
  } = useShipSchedule();
  console.log(adminSchedules);
  // UI States
  const [showCreate, setShowCreate] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");

  // Filtered and sorted adminSchedules
  const filteredSchedules = useMemo(() => {
    if (!adminSchedules) return [];

    let filtered = adminSchedules.data.filter((schedule) => {
      const matchesSearch =
        schedule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && schedule.isActive) ||
        (statusFilter === "inactive" && !schedule.isActive);

      return matchesSearch && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.isActive;
          bValue = b.isActive;
          break;
        case "created":
          aValue = new Date(a.createdAt || 0);
          bValue = new Date(b.createdAt || 0);
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [adminSchedules, searchTerm, statusFilter, sortBy, sortOrder]);

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("title");
    setSortOrder("asc");
  };

  // Handle edit
  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
  };

  // Handle delete
  const handleDelete = async (schedule) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete "${schedule.title}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await deleteMutation.mutateAsync(schedule.id);

        Swal.fire({
          title: "Deleted!",
          text: "Schedule has been deleted successfully.",
          icon: "success",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire({
          title: "Error",
          text: error.message || "Failed to delete schedule. Please try again.",
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (schedule) => {
    const newStatus = !schedule.isActive;
    const action = newStatus ? "activate" : "deactivate";

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Schedule?`,
      text: `This will ${action} "${schedule.title}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus ? "#10b981" : "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action}!`,
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await updateMutation.mutateAsync({
          id: schedule.id,
          data: {
            ...schedule,
            isActive: newStatus,
          },
        });

        Swal.fire({
          title: `${action.charAt(0).toUpperCase() + action.slice(1)}d!`,
          text: `Schedule has been ${action}d successfully.`,
          icon: "success",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error("Toggle status error:", error);
        Swal.fire({
          title: "Error",
          text:
            error.message || `Failed to ${action} schedule. Please try again.`,
          icon: "error",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  // Handle successful operations
  const handleOperationSuccess = () => {
    // refetch();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Failed to Load adminSchedules
          </h3>
          <p className="text-gray-600 mb-6">
            {error.message ||
              "Something went wrong while loading the adminSchedules."}
          </p>
          <button
            onClick={() => refetch()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-colors"
          >
            <RefreshCw size={18} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto  sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side: Icon + Text */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 w-full sm:w-auto">
              <div className="bg-blue-100 rounded-2xl p-3">
                <Ship className="text-blue-600" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-xl font-bold text-gray-800">
                  Ship Schedules
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  Manage your ship schedule information
                </p>
              </div>
            </div>

            {/* Right Side: Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => refetch()}
                disabled={isLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 w-full sm:w-auto"
              >
                <RefreshCw
                  className={isLoading ? "animate-spin" : ""}
                  size={18}
                />
                <span className="text-sm sm:text-base">Refresh</span>
              </button>

              <button
                onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
              >
                <Plus size={18} />
                <span className="text-sm sm:text-base">Add Schedule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ShipScheduleFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          totalSchedules={adminSchedules?.length || 0}
          filteredCount={filteredSchedules.length}
          clearAllFilters={clearAllFilters}
        />

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader
                className="animate-spin text-blue-600 mx-auto mb-4"
                size={48}
              />
              <p className="text-gray-600 text-lg">Loading adminSchedules...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredSchedules.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Calendar className="text-gray-300 mx-auto mb-6" size={64} />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No adminSchedules found"
                : "No adminSchedules yet"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria to find what you're looking for."
                : "Get started by creating your first ship schedule to help passengers plan their journeys."}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <button
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            ) : (
              <button
                onClick={() => setShowCreate(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition-all"
              >
                <Plus size={18} />
                Add Your First Schedule
              </button>
            )}
          </div>
        )}

        {/* adminSchedules Grid */}
        {!isLoading && filteredSchedules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchedules.map((schedule) => (
              <ShipScheduleCard
                key={schedule.id}
                schedule={schedule}
                onEdit={handleEdit}
                onToggleStatus={handleToggleStatus}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showCreate && (
          <ShipScheduleCreate
            onClose={() => setShowCreate(false)}
            onSuccess={handleOperationSuccess}
          />
        )}

        {/* Edit Modal */}
        {editingSchedule && (
          <ShipScheduleEdit
            schedule={editingSchedule}
            onClose={() => setEditingSchedule(null)}
            onSuccess={handleOperationSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ShipScheduleList;
