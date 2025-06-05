import React from 'react'

const ProfileHeader = ({ user }) => {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h1>
      <p className="text-gray-600 mt-2">Manage your account and view your car orders</p>
    </div>
  )
}

export default ProfileHeader