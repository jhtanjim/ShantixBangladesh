"use client";

import {
  Calendar,
  Car,
  Eye,
  Filter,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import Swal from "sweetalert2";
import {
  useAllInquiries,
  useDeleteInquiry,
  useInquiry,
  useUpdateInquiry,
} from "../../../../hooks/useInquiry";

const EnquiryList = () => {
  const [filters, setFilters] = useState({
    status: "",
    inquiryType: "",
    country: "",
    email: "",
    fromDate: "",
    toDate: "",
    page: 1,
    limit: 10,
  });

  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");

  // Filter out empty string values before sending to API
  const cleanFilters = useMemo(() => {
    const cleaned = {};
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      // Only include non-empty values (but keep page and limit)
      if (
        key === "page" ||
        key === "limit" ||
        (value !== "" && value !== null && value !== undefined)
      ) {
        cleaned[key] = value;
      }
    });
    return cleaned;
  }, [filters]);

  const {
    data: inquiriesData,
    isLoading,
    isError,
    error,
  } = useAllInquiries(cleanFilters);

  console.log(inquiriesData);

  const { data: inquiryDetails, isLoading: isLoadingDetails } = useInquiry(
    selectedInquiry?.id
  );

  const updateInquiryMutation = useUpdateInquiry();
  const deleteInquiryMutation = useDeleteInquiry();

  const inquiries = inquiriesData?.data || [];
  const totalCount = inquiriesData?.meta?.total || 0;
  const totalPages =
    inquiriesData?.meta?.totalPages || Math.ceil(totalCount / filters.limit);

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESPONDED", label: "Responded" },
    { value: "CLOSED", label: "Closed" },
  ];

  const inquiryTypeOptions = [
    { value: "", label: "All Types" },
    { value: "CAR", label: "Car" },
    { value: "BUS", label: "Bus" },
    { value: "TRUCKS", label: "Trucks" },
    { value: "PARTS", label: "Parts" },
    { value: "BIKES", label: "Bikes" },
    { value: "OTHERS", label: "Others" },
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "",
      inquiryType: "",
      country: "",
      email: "",
      fromDate: "",
      toDate: "",
      page: 1,
      limit: 10,
    });
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      PENDING: "bg-yellow-100 text-yellow-800",
      IN_PROGRESS: "bg-blue-100 text-blue-800",
      RESPONDED: "bg-green-100 text-green-800",
      CLOSED: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.replace("_", " ")}
      </span>
    );
  };

  const handleViewDetails = (inquiry) => {
    setSelectedInquiry(inquiry);
    setShowDetails(true);
  };

  const handleUpdateStatus = async (inquiryId, newStatus) => {
    try {
      const result = await Swal.fire({
        title: "Update Status",
        text: `Change status to ${newStatus.replace("_", " ")}?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Update",
      });

      if (result.isConfirmed) {
        await updateInquiryMutation.mutateAsync({
          inquiryId,
          updateData: { status: newStatus },
        });
        Swal.fire({
          icon: "success",
          title: "Status Updated",
          text: "Inquiry status has been updated successfully.",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || "Failed to update status",
      });
    }
  };

  const handleRespond = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminResponse(inquiry.adminResponse || "");
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!adminResponse.trim()) {
      Swal.fire({
        icon: "error",
        title: "Response Required",
        text: "Please enter a response message",
      });
      return;
    }

    try {
      await updateInquiryMutation.mutateAsync({
        inquiryId: selectedInquiry.id,
        updateData: {
          status: "RESPONDED",
          adminResponse: adminResponse.trim(),
          respondedBy: "Admin", // You can get this from auth context
        },
      });

      Swal.fire({
        icon: "success",
        title: "Response Sent",
        text: "Your response has been sent successfully.",
        timer: 2000,
        timerProgressBar: true,
      });

      setShowResponseModal(false);
      setAdminResponse("");
      setSelectedInquiry(null);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Response Failed",
        text: error.response?.data?.message || "Failed to send response",
      });
    }
  };

  const handleDelete = async (inquiryId) => {
    try {
      const result = await Swal.fire({
        title: "Delete Inquiry",
        text: "Are you sure you want to delete this inquiry? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Yes, Delete",
      });

      if (result.isConfirmed) {
        await deleteInquiryMutation.mutateAsync(inquiryId);
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Inquiry has been deleted successfully.",
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Failed to delete inquiry",
      });
    }
  };

  // Helper function to get customer name from email
  const getCustomerName = (email) => {
    return email ? email.split("@")[0] : "Unknown";
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Inquiries
          </h2>
          <p className="text-gray-600">
            {error?.message || "Something went wrong"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Inquiry Management
          </h1>
          <p className="text-gray-600">
            Manage customer inquiries and responses
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filters
              </h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      handleFilterChange("status", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={filters.inquiryType}
                    onChange={(e) =>
                      handleFilterChange("inquiryType", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {inquiryTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={filters.country}
                    onChange={(e) =>
                      handleFilterChange("country", e.target.value)
                    }
                    placeholder="Enter country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={filters.email}
                    onChange={(e) =>
                      handleFilterChange("email", e.target.value)
                    }
                    placeholder="Enter email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date
                  </label>
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) =>
                      handleFilterChange("fromDate", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date
                  </label>
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) =>
                      handleFilterChange("toDate", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Inquiries Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Inquiries ({totalCount})
              </h2>
            </div>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No inquiries found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Inquiry Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vehicle Info
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {getCustomerName(inquiry.email)}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {inquiry.email}
                            </div>
                            {inquiry.mobile && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Phone className="h-3 w-3 mr-1" />
                                {inquiry.mobile}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="flex items-center mb-1">
                            <Car className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="font-medium">
                              {inquiry.inquiryType}
                            </span>
                            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {inquiry.customerType}
                            </span>
                          </div>
                          <div className="text-gray-600 line-clamp-2 max-w-xs">
                            {inquiry.message}
                          </div>
                          {inquiry.country && (
                            <div className="flex items-center mt-1 text-gray-500">
                              <MapPin className="h-3 w-3 mr-1" />
                              {inquiry.country}
                              {inquiry.port && ` - ${inquiry.port}`}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {inquiry.make && inquiry.model && (
                            <div className="font-medium">
                              {inquiry.make} {inquiry.model}
                            </div>
                          )}
                          {inquiry.yearFrom && inquiry.yearTo && (
                            <div className="text-gray-600">
                              {inquiry.yearFrom === inquiry.yearTo
                                ? inquiry.yearFrom
                                : `${inquiry.yearFrom}-${inquiry.yearTo}`}
                            </div>
                          )}
                          {inquiry.engineCC && (
                            <div className="text-gray-600 text-xs">
                              {inquiry.engineCC}cc
                            </div>
                          )}
                          {inquiry.transmission && (
                            <div className="text-gray-600 text-xs">
                              {inquiry.transmission}
                            </div>
                          )}
                          {inquiry.steering && (
                            <div className="text-gray-600 text-xs">
                              {inquiry.steering.replace("_", " ")}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-2">
                          {getStatusBadge(inquiry.status)}
                          <select
                            value={inquiry.status}
                            onChange={(e) =>
                              handleUpdateStatus(inquiry.id, e.target.value)
                            }
                            className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            disabled={updateInquiryMutation.isLoading}
                          >
                            {statusOptions.slice(1).map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(inquiry.createdAt).toLocaleTimeString()}
                        </div>
                        {inquiry.emailSentAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Email sent
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(inquiry)}
                            className="text-blue-600 hover:text-blue-900 flex items-center"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRespond(inquiry)}
                            className="text-green-600 hover:text-green-900 flex items-center"
                            title="Respond"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            title="Delete"
                            disabled={deleteInquiryMutation.isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(filters.page - 1) * filters.limit + 1} to{" "}
                  {Math.min(filters.page * filters.limit, totalCount)} of{" "}
                  {totalCount} results
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, index) => {
                    const page =
                      Math.max(1, Math.min(totalPages - 4, filters.page - 2)) +
                      index;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded-md text-sm font-medium ${
                          filters.page === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {showDetails && selectedInquiry && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Inquiry Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>

              {isLoadingDetails ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading details...</p>
                </div>
              ) : inquiryDetails ? (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Customer Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Mobile
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.mobile || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Country
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.country || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Port
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.port || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Customer Type
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.customerType}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Inquiry Type
                        </label>
                        <p className="text-sm text-gray-900">
                          {inquiryDetails.inquiryType}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Details Section */}
                  {inquiryDetails.inquiryType === "CAR" && (
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">
                        Vehicle Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Make
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.make || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Model
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.model || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Year Range
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.yearFrom && inquiryDetails.yearTo
                              ? `${inquiryDetails.yearFrom} - ${inquiryDetails.yearTo}`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Engine CC
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.engineCC
                              ? `${inquiryDetails.engineCC}cc`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Transmission
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.transmission || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Drive Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.driveType || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Steering
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.steering
                              ? inquiryDetails.steering.replace("_", " ")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Exterior Color
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.exteriorColor || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Interior Color
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.color || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Seats
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.seats || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Mileage
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.mileage
                              ? `${inquiryDetails.mileage.toLocaleString()} km`
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Type
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.type || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Grade
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.grade || "N/A"}
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Auction Score
                          </label>
                          <p className="text-sm text-gray-900">
                            {inquiryDetails.auctionScore || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message and Response */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Communication
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Customer Message
                        </label>
                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md mt-1">
                          {inquiryDetails.message}
                        </p>
                      </div>

                      {inquiryDetails.adminResponse && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Admin Response
                          </label>
                          <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-md mt-1">
                            {inquiryDetails.adminResponse}
                          </p>
                          {inquiryDetails.respondedBy && (
                            <p className="text-xs text-gray-500 mt-1">
                              Responded by: {inquiryDetails.respondedBy}
                              {inquiryDetails.respondedAt && (
                                <span className="ml-2">
                                  on{" "}
                                  {new Date(
                                    inquiryDetails.respondedAt
                                  ).toLocaleString()}
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status and Timestamps */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      Status & Timeline
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        {getStatusBadge(inquiryDetails.status)}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email Status
                        </label>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            inquiryDetails.isEmailSent
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {inquiryDetails.isEmailSent ? "Sent" : "Not Sent"}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Created At
                        </label>
                        <p className="text-sm text-gray-900">
                          {new Date(inquiryDetails.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Updated At
                        </label>
                        <p className="text-sm text-gray-900">
                          {new Date(inquiryDetails.updatedAt).toLocaleString()}
                        </p>
                      </div>
                      {inquiryDetails.emailSentAt && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Email Sent At
                          </label>
                          <p className="text-sm text-gray-900">
                            {new Date(
                              inquiryDetails.emailSentAt
                            ).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-600">
                  Failed to load inquiry details
                </p>
              )}
            </div>
          </div>
        )}

        {/* Response Modal */}
        {showResponseModal && selectedInquiry && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Respond to Inquiry
                </h3>
                <button
                  onClick={() => setShowResponseModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  <span className="sr-only">Close</span>✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Original Inquiry
                  </h4>
                  <p className="text-sm text-gray-700">
                    {selectedInquiry.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    From: {getCustomerName(selectedInquiry.email)} (
                    {selectedInquiry.email})
                  </p>
                  {selectedInquiry.make && selectedInquiry.model && (
                    <p className="text-xs text-gray-500">
                      Vehicle: {selectedInquiry.make} {selectedInquiry.model}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Response
                  </label>
                  <textarea
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={6}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your response..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowResponseModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    disabled={updateInquiryMutation.isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitResponse}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    disabled={updateInquiryMutation.isLoading}
                  >
                    {updateInquiryMutation.isLoading
                      ? "Sending..."
                      : "Send Response"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryList;
