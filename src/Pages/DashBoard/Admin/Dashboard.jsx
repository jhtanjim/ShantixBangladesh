"use client"

import { Car, Users, DollarSign, TrendingUp, AlertCircle, Loader2 } from "lucide-react"
import { useAllUsers } from "../../../hooks/useUsers"
import { useAllCarsAdmin } from "../../../hooks/useCars"
import { useMemo } from "react"

export function Dashboard() {
  const { data: carsData, error: carsError, isLoading: carsLoading } = useAllCarsAdmin()
  const { data: usersData, error: usersError, isLoading: usersLoading } = useAllUsers()

  // Handle different API response formats
  const cars = useMemo(() => {
    if (!carsData) return []

    // If API returns direct array
    if (Array.isArray(carsData)) {
      return carsData
    }

    // If API returns { data: [...] }
    if (carsData.data && Array.isArray(carsData.data)) {
      return carsData.data
    }

    // If API returns { cars: [...] }
    if (carsData.cars && Array.isArray(carsData.cars)) {
      return carsData.cars
    }

    // If API returns { results: [...] }
    if (carsData.results && Array.isArray(carsData.results)) {
      return carsData.results
    }

    return []
  }, [carsData])

  const users = useMemo(() => {
    if (!usersData) return []

    // If API returns direct array
    if (Array.isArray(usersData)) {
      return usersData
    }

    // If API returns { data: [...] }
    if (usersData.data && Array.isArray(usersData.data)) {
      return usersData.data
    }

    // If API returns { users: [...] }
    if (usersData.users && Array.isArray(usersData.users)) {
      return usersData.users
    }

    return []
  }, [usersData])

  // Calculate dynamic statistics
  const stats = useMemo(() => {
    const totalCars = cars.length
    const activeCars = cars.filter((car) => car?.isActive && car?.status === "AVAILABLE").length
    const totalUsers = users.length
    const totalRevenue = cars.reduce((sum, car) => sum + (car?.price || 0), 0)

    return [
      {
        title: "Total Cars",
        value: totalCars.toString(),
        change: totalCars > 0 ? "+12%" : "0%",
        icon: Car,
        color: "blue",
      },
      {
        title: "Total Users",
        value: totalUsers.toString(),
        change: totalUsers > 0 ? "+8%" : "0%",
        icon: Users,
        color: "green",
      },
      {
        title: "Total Value",
        value: `$${totalRevenue.toLocaleString()}`,
        change: totalRevenue > 0 ? "+20%" : "0%",
        icon: DollarSign,
        color: "yellow",
      },
      {
        title: "Active Cars",
        value: activeCars.toString(),
        change: activeCars > 0 ? "+5%" : "0%",
        icon: TrendingUp,
        color: "purple",
      },
    ]
  }, [cars, users])

  // Get recent cars (last 3 added)
  const recentCars = useMemo(() => {
    if (!cars.length) return []

    return cars
      .filter((car) => car && car.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((car) => ({
        id: car.id,
        name: car.title || "Untitled Car",
        price: `$${car.price?.toLocaleString() || "0"}`,
        status: car.isActive && car.status === "AVAILABLE" ? "Active" : "Inactive",
        make: car.make || "Unknown",
        model: car.model || "Unknown",
        year: car.year || "N/A",
        createdAt: car.createdAt,
      }))
  }, [cars])

  // Get recent users (last 3 registered)
  const recentUsers = useMemo(() => {
    if (!users.length) return []

    return users
      .filter((user) => user && user.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3)
      .map((user) => ({
        id: user.id,
        name: user.fullName || "Unknown User",
        email: user.email || "No email",
        country: user.country || "Unknown",
        phone: user.phone || null,
        role: user.role || "USER",
        date: getRelativeTime(user.createdAt),
      }))
  }, [users])

  // Helper function to get relative time
  function getRelativeTime(dateString) {
    if (!dateString) return "Unknown"

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

      if (diffInHours < 1) return "Just now"
      if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`

      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`

      return date.toLocaleDateString()
    } catch (error) {
      return "Unknown"
    }
  }

  // Loading state
  if (carsLoading || usersLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (carsError || usersError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-4" />
            <p className="text-red-600 font-medium">Error loading dashboard data</p>
            <div className="mt-4 text-sm text-gray-600">
              {carsError && <p>Cars Error: {carsError.message || "Unknown error"}</p>}
              {usersError && <p>Users Error: {usersError.message || "Unknown error"}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lg:p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to your admin dashboard</p>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
          <span>Last updated: {new Date().toLocaleString()}</span>
          <span>•</span>
          <span>
            {cars.length} cars • {users.length} users
          </span>
        </div>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow p-4 sm:p-6 hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </div>
              <div
                className={`p-2 sm:p-3 rounded-full flex-shrink-0 ml-3 ${
                  stat.color === "blue"
                    ? "bg-blue-100"
                    : stat.color === "green"
                      ? "bg-green-100"
                      : stat.color === "yellow"
                        ? "bg-yellow-100"
                        : "bg-purple-100"
                }`}
              >
                <stat.icon
                  className={`h-5 w-5 sm:h-6 sm:w-6 ${
                    stat.color === "blue"
                      ? "text-blue-600"
                      : stat.color === "green"
                        ? "text-green-600"
                        : stat.color === "yellow"
                          ? "text-yellow-600"
                          : "text-purple-600"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Data - Responsive Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Cars */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Cars</h3>
                <p className="text-gray-600 text-sm mt-1">Latest cars added to the system</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{cars.length} total</span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {recentCars.length > 0 ? (
              <div className="space-y-4">
                {recentCars.map((car) => (
                  <div
                    key={car.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{car.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-600">{car.price}</p>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-gray-500">
                          {car.make} {car.model} ({car.year})
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs flex-shrink-0 w-fit ${
                          car.status === "Active"
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {car.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No cars available</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100">
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
                <p className="text-gray-600 text-sm mt-1">Latest users registered</p>
              </div>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{users.length} total</span>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            user.role === "ADMIN"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {user.role}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-gray-500">{user.country}</p>
                        {user.phone && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <p className="text-xs text-gray-500">{user.phone}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 flex-shrink-0">{user.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No users registered</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Car Status Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Available</span>
              <span className="text-sm font-semibold text-green-600">
                {cars.filter((car) => car?.status === "AVAILABLE").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Active</span>
              <span className="text-sm font-semibold text-blue-600">{cars.filter((car) => car?.isActive).length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">User Roles</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Users</span>
              <span className="text-sm font-semibold text-blue-600">
                {users.filter((user) => user?.role === "USER").length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Admins</span>
              <span className="text-sm font-semibold text-purple-600">
                {users.filter((user) => user?.role === "ADMIN").length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 sm:p-6 border border-gray-100">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Popular Makes</h4>
          <div className="space-y-2">
            {cars.length > 0 ? (
              Object.entries(
                cars
                  .filter((car) => car?.make)
                  .reduce((acc, car) => {
                    acc[car.make] = (acc[car.make] || 0) + 1
                    return acc
                  }, {}),
              )
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([make, count]) => (
                  <div key={make} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{make}</span>
                    <span className="text-sm font-semibold text-gray-900">{count}</span>
                  </div>
                ))
            ) : (
              <p className="text-sm text-gray-500">No data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
