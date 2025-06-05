import React from 'react'

const ErrorMessage = ({ error, title = "An error occurred" }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{title}</p>
        <p className="text-gray-500 text-sm mt-2">
          {error?.message || 'Something went wrong'}
        </p>
      </div>
    </div>
  )
}

export default ErrorMessage