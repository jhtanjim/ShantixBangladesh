"use client";

import { AlertTriangle, ArrowLeft, Loader2, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getCurrentUser } from "../api/users";

const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        if (token) {
          const currentUser = await getCurrentUser();
          setUserData(currentUser);
        }
      } catch (err) {
        setError("Failed to fetch user data");
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, user]);
  console.log(userData);
  // Loading state with beautiful spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto" />
            <div className="absolute inset-0 h-16 w-16 border-4 border-blue-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          <h3 className="mt-6 text-xl font-semibold text-gray-800">
            Verifying Access
          </h3>
          <p className="mt-2 text-gray-600">
            Please wait while we check your permissions...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!token || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="bg-yellow-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <Shield className="h-12 w-12 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access this area
          </p>
          <div className="space-y-3">
            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Go to Login
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not admin
  if (userData.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-6">
            <Shield className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-2">
            You don't have permission to access this area
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-6">
            <p className="text-sm text-gray-600">
              Current role:{" "}
              <span className="font-semibold text-gray-800">
                {userData.role}
              </span>
            </p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated and is admin
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      {/* <div className="bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 rounded-lg p-2">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Admin Dashboard</h1>
                <p className="text-green-100 text-sm">Welcome back, {userData.fullName}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-3 py-1">
              <span className="text-white text-sm font-medium">{userData.role}</span>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main content */}
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default AdminRoute;
