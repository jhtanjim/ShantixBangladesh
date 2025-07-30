import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "../../api/axios"; // Update this path

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = searchParams.get("token");

  // Query to verify email token
  const {
    data: verificationData,
    isLoading: isVerifying,
    isError: verificationError,
    error,
  } = useQuery({
    queryKey: ["verifyEmail", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No token provided");
      }
      const response = await axios.get(`/auth/verify-email?token=${token}`);
      return response.data;
    },
    enabled: !!token,
    retry: false, // Don't retry on failure
    refetchOnWindowFocus: false,
  });

  // Mutation to resend verification email
  const resendVerificationMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/auth/resend-verification");
      return response.data;
    },
    onSuccess: () => {
      // Optionally show success message or redirect
      console.log("Verification email sent successfully");
    },
    onError: (error) => {
      console.error("Failed to resend verification email:", error);
    },
  });

  // Redirect to login or dashboard on successful verification
  useEffect(() => {
    if (verificationData && !verificationError) {
      // Optionally store any returned data (like tokens)
      if (verificationData.token) {
        localStorage.setItem("token", verificationData.token);
      }

      // Redirect after successful verification
      setTimeout(() => {
        navigate("/dashboard"); // or wherever you want to redirect
      }, 2000);
    }
  }, [verificationData, verificationError, navigate]);

  // Handle resend verification
  const handleResendVerification = () => {
    resendVerificationMutation.mutate();
  };

  // No token provided
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Invalid Verification Link
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              The verification link is invalid or expired.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verifying Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we verify your email address...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (verificationData && !verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your email has been verified. You will be redirected shortly...
            </p>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full animate-pulse"
                  style={{ width: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state - show resend button
  if (verificationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Verification Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {error?.response?.data?.message ||
                "The verification token is invalid or has expired."}
            </p>

            <div className="mt-6 space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={resendVerificationMutation.isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendVerificationMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  "Resend Verification Email"
                )}
              </button>

              {resendVerificationMutation.isSuccess && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    Verification email sent successfully! Please check your
                    inbox.
                  </p>
                </div>
              )}

              {resendVerificationMutation.isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">
                    Failed to send verification email. Please try again.
                  </p>
                </div>
              )}

              <button
                onClick={() => navigate("/login")}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default VerifyEmail;
