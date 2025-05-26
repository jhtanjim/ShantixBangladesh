import { Car, Users, DollarSign, TrendingUp } from "lucide-react"

export function Dashboard() {
  const stats = [
    { title: "Total Cars", value: "245", change: "+12%", icon: Car, color: "blue" },
    { title: "Total Users", value: "1,234", change: "+8%", icon: Users, color: "green" },
    { title: "Revenue", value: "$45,231", change: "+20%", icon: DollarSign, color: "yellow" },
    { title: "Active Cars", value: "189", change: "+5%", icon: TrendingUp, color: "purple" },
  ]

  const recentCars = [
    { name: "Toyota Corolla Cross Z", price: "$79,888", status: "Active" },
    { name: "Honda Civic Type R", price: "$65,000", status: "Active" },
    { name: "BMW X5 M Sport", price: "$120,000", status: "Pending" },
  ]

  const recentUsers = [
    { name: "John Doe", email: "john@example.com", date: "2 hours ago" },
    { name: "Jane Smith", email: "jane@example.com", date: "5 hours ago" },
    { name: "Mike Johnson", email: "mike@example.com", date: "1 day ago" },
  ]

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change} from last month</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Data */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Cars</h3>
            <p className="text-gray-600">Latest cars added to the system</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentCars.map((car, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{car.name}</p>
                    <p className="text-sm text-gray-600">{car.price}</p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      car.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {car.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <p className="text-gray-600">Latest users registered</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">{user.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
