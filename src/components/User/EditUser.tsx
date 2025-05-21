import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../hooks/useUser';
import { UpdateUserDto } from '../../types/user';

const EditUser: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetUser, useUpdateUser } = useUser();
  const { data: user, isLoading, error } = useGetUser(id || '');
  const updateUserMutation = useUpdateUser();
  
  const [formData, setFormData] = useState<UpdateUserDto>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      await updateUserMutation.mutateAsync({
        id,
        data: formData
      });
      navigate(`/users/${id}`);
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red">Error loading user data</div>;
  }

  if (!user) {
    return <div className="text-center py-8">User not found</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-dark-blue mb-6">Edit User</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block mb-1 text-sm font-medium text-dark-blue">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block mb-1 text-sm font-medium text-dark-blue">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-dark-blue">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block mb-1 text-sm font-medium text-dark-blue">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            disabled={updateUserMutation.isPending}
            className="px-4 py-2 bg-blue text-white rounded-md hover:bg-dark-blue transition disabled:opacity-70"
          >
            {updateUserMutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/users/${id}`)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
          >
            Cancel
          </button>
        </div>
        
        {updateUserMutation.isError && (
          <div className="mt-4 p-3 bg-red-100 text-red rounded-md">
            Failed to update user
          </div>
        )}
      </form>
    </div>
  );
};

export default EditUser;