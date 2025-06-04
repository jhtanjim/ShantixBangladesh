"use client"

import { useState } from "react"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react"
import { useDeleteCar, useActivateCar, useDeactivateCar, useAllCarsAdmin } from "../../../../hooks/useCars"
import { useNavigate } from "react-router-dom"
import type { CarFilters } from "../../../../api/carService"

export function CarsPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<CarFilters>({
    search: "",
    page: 1,
    limit: 9,
  })
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error, refetch } = useAllCarsAdmin(filters)
  console.log(data)
  const deleteMutation = useDeleteCar()
  const activateMutation = useActivateCar()
  const deactivateMutation = useDeactivateCar()
console.log(data)
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        setShowDeleteModal(null)
        refetch()
      },
      onError: (error) => {
        console.error("Failed to delete car:", error)
        alert("Failed to delete car. Please try again.")
      },
    })
  }

  const handleToggleStatus = (car: any) => {
    const mutation = car.isActive ? deactivateMutation : activateMutation
    mutation.mutate(car.id, {
      onSuccess: () => refetch(),
      onError: (error) => {
        console.error("Failed to toggle car status:", error)
        alert("Failed to update car status. Please try again.")
      },
    })
  }

  const handleEdit = (carId: string) => {
    navigate(`/admin/cars/edit/${carId}`)
  }

  const handleViewDetails = (carId: string) => {
    navigate(`/admin/cars/${carId}`)
  }

  const handleCreate = () => {
    navigate("/admin/cars/create")
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }))
  }

  const clearFilters = () => {
    setFilters({ search: "", page: 1, limit: 9 })
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading cars...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
          <span className="text-red-800">
            Error loading cars: {error?.message || "Unknown error"}
            <button className="ml-2 underline text-blue-600 hover:text-blue-800" onClick={() => refetch()}>
              Retry
            </button>
          </span>
        </div>
      </div>
    )
  }

  const cars = data?.data || []
  const meta = data?.meta || { total: 0, page: 1, limit: 9, totalPages: 1 }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cars</h1>
          <p className="text-sm text-gray-600">Manage your car inventory ({meta.total} cars)</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cars..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="100000"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                <select
                  value={filters.fuel || ""}
                  onChange={(e) => setFilters({ ...filters, fuel: e.target.value || undefined, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={filters.sortBy || ""}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value || undefined, page: 1 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Default</option>
                  <option value="price">Price</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cars Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        {cars.length > 0 ? (
          cars.map((car: any) => (
            <div key={car.id} className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
              <div className="relative h-48">
                <img
                  src={car.mainImage || "/placeholder.svg?height=200&width=300"}
                  alt={car.title || "Car image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                  }}
                />
                <span
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                    car.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {car.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{car.title}</h3>
                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <div>Year: {car.year}</div>
                  <div>Fuel: {car.fuel}</div>
                  <div>Color: {car.exteriorColor}</div>
                  <div>Seats: {car.seats}</div>
                  <div className="font-semibold">Price: ${car.price.toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(car.id)}
                    className="flex-1 border border-blue-300 px-3 py-2 rounded-md hover:bg-blue-50 text-sm flex items-center justify-center text-blue-600"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(car.id)}
                    className="flex-1 border border-gray-300 px-3 py-2 rounded-md hover:bg-gray-50 text-sm flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleStatus(car)}
                    disabled={activateMutation.isPending || deactivateMutation.isPending}
                    className={`px-3 py-2 rounded-md text-white text-sm ${
                      car.isActive ? "bg-orange-600 hover:bg-orange-700" : "bg-green-600 hover:bg-green-700"
                    } disabled:opacity-50`}
                  >
                    {car.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(car.id)}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-12">
            <p className="text-lg mb-2">No cars found</p>
            <p className="text-sm">
              {filters.search || filters.minPrice || filters.maxPrice || filters.fuel
                ? "Try adjusting your search criteria"
                : "Start by adding your first car"}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total}{" "}
            results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-2 text-sm">
              Page {meta.page} of {meta.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md mx-4">
            <h2 className="text-lg font-bold mb-2">Confirm Deletion</h2>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this car? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => showDeleteModal && handleDelete(showDeleteModal)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
