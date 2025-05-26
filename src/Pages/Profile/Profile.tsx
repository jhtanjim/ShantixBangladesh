import { useCurrentUser } from "../../hooks/useUsers";
import { Link } from "react-router-dom";

const Profile = () => {
  const { data: user, isLoading, error } = useCurrentUser();
console.log(user)
  if (isLoading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to load profile</p>;

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white shadow-md rounded-xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">My Profile</h1>

      <div className="space-y-4 text-lg">
        <p>
          <span className="font-semibold text-gray-700">Name:</span>{" "}
          {user.firstName} {user.lastName}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Email:</span>{" "}
          {user.email}
        </p>
        <p>
          <span className="font-semibold text-gray-700">Role:</span>{" "}
          {user.role}
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link to="/updateProfile">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-md transition">
            Update Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
