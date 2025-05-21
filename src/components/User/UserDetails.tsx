import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { useAuth } from '../../hooks/useAuth';

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { useGetUser, useDeleteUser } = useUser();
  const { data: user, isLoading, error } = useGetUser(id || '');
  const deleteUserMutation = useDeleteUser();

  const handleDelete = async () => {
    if (!id) return;
    
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await deleteUserMutation.mutateAsync(id);
        navigate('/users');
      } catch (error) {
        console.error('Failed to delete user', error);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading user details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red">Error loading user details</div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-dark-blue">User Details</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/users/edit/${id}`)}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-dark-blue transition"
          >
            Edit User
          </button>
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={deleteUserMutation.isPending}
              className="px-4 py-2 bg-red text-white rounded-md hover:bg-red-700 transition disabled:opacity-70"
            >
              {deleteUserMutation.isPending ? 'Deleting...' : 'Delete User'}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">First Name</p>
            <p className="font-medium">{user.firstName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Last Name</p>
            <p className="font-medium">{user.lastName}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="font-medium">{user.email}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user.role}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Member Since</p>
            <p className="font-medium">
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate('/users')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
        >
          Back to Users
        </button>
      </div>
    </div>
  );
};

export default UserDetails;