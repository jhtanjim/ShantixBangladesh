import { useState } from "react";
import { useAllUsers, useDeleteUser } from "../../../../hooks/useUsers";

import { Link } from "react-router-dom"
import { Plus, Search, Edit, Trash2, Mail, Phone } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  createdAt: string
  isActive: boolean
}

export function UsersPage() {
  const { data: users = [], isLoading } = useAllUsers();
  console.log(users)
  const deleteUser = useDeleteUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (user:User) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    deleteUser.mutate(id);
    setShowDeleteModal(null);
  };

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600">Manage user accounts</p>
        </div>
        <Link
          to="/admin/users/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user:User) => (
          <div key={user.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {user.firstName} {user.lastName}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="truncate text-gray-600">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">{user.phone}</span>
              </div>
              <div className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/admin/users/${user.id}/edit`}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
              <button
                onClick={() => setShowDeleteModal(user.id)}
                className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this user account? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
