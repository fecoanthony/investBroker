import { useEffect, useState } from "react";
import {
  fetchAdminUsers,
  updateUserRole,
  toggleUserStatus,
} from "../../services/admin/userService";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminUsers();
      setUsers(data.users || data);
    } catch (err) {
      console.error(err);
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    if (!window.confirm(`Change role to ${role}?`)) return;
    await updateUserRole(userId, role);
    loadUsers();
  };

  const handleStatusToggle = async (userId, active) => {
    await toggleUserStatus(userId, active);
    loadUsers();
  };

  if (loading) return <p className="p-6">Loading users...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Users</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-gray-400 border-b border-slate-800">
            <tr>
              <th className="text-left py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-slate-900">
                <td className="py-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.active ? (
                    <span className="text-green-500">Active</span>
                  ) : (
                    <span className="text-red-500">Suspended</span>
                  )}
                </td>
                <td className="space-x-2">
                  <button
                    className="text-blue-400"
                    onClick={() =>
                      handleRoleChange(
                        u._id,
                        u.role === "admin" ? "user" : "admin"
                      )
                    }
                  >
                    Toggle Role
                  </button>

                  <button
                    className="text-yellow-400"
                    onClick={() => handleStatusToggle(u._id, !u.active)}
                  >
                    {u.active ? "Suspend" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;
