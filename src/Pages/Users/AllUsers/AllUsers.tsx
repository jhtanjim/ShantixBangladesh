import { useAllUsers, useDeleteUser } from "../../../hooks/useUsers";


const AllUsers = () => {
  const { data: users, isLoading, error } = useAllUsers();
  const deleteUser = useDeleteUser();

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Failed to load users.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Users</h1>
      <ul className="space-y-2">
        {users.map((user: any) => (
          <li key={user._id} className="border p-2 rounded">
            <p><strong>{user.name}</strong> - {user.email}</p>
            <button
              className="text-red-500 mt-1"
              onClick={() => deleteUser.mutate(user._id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsers;
