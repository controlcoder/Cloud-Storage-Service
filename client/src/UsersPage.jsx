import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchAllUsers,
  fetchUser,
  deleteUserById,
  restoreUserById,
  logoutUserById,
} from "./api/userApi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");
  const navigate = useNavigate();

  const logoutUser = async (id, email) => {
    const confirmed = confirm(`You are about to logout ${email}`);
    if (!confirmed) return;
    try {
      await logoutUserById(id);
      fetchUsers();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const deleteUser = async (id, email) => {
    const confirmed = confirm(`You are about to delete ${email}`);
    if (!confirmed) return;
    try {
      await deleteUserById(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const restoreUser = async (id, email) => {
    const confirmed = confirm(`You are about to restore ${email}`);
    if (!confirmed) return;
    try {
      await restoreUserById(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  async function fetchUsers() {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
      else if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching users failed:", err);
    }
  }

  async function fetchCurrentUser() {
    try {
      const data = await fetchUser();
      setUserName(data.name);
      setUserEmail(data.email);
      setUserRole(data.role);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching user failed:", err);
    }
  }

  return (
    <div className="max-w-5xl mt-10 mx-4">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      <p>
        <b>{userName}</b>: <i>({userRole})</i>
      </p>

      <table className="w-full mt-6 border-collapse">
        <thead>
          <tr>
            <th className="border p-3 bg-gray-200 text-left">Name</th>
            <th className="border p-3 bg-gray-200 text-left">Email</th>
            <th className="border p-3 bg-gray-200 text-left">Status</th>
            <th className="border p-3 bg-gray-200 text-left"></th>
            {userRole === "Admin" && (
              <th className="border p-3 bg-gray-200 text-left"></th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map(({ id, name, email, isLoggedIn, isDeleted, isAdmin }) => (
            <tr key={id}>
              <td className="border p-3">{name}</td>
              <td className="border p-3">{email}</td>
              <td className="border p-3">
                {isAdmin ? "Admin" : isLoggedIn ? "Logged In" : "Logged Out"}
              </td>
              <td className="border p-3">
                <button
                  onClick={() => logoutUser(id, email)}
                  disabled={!isLoggedIn || isAdmin}
                  className={`px-3 py-1 text-sm text-white rounded ${
                    isAdmin
                      ? "bg-blue-400 cursor-not-allowed"
                      : isLoggedIn
                        ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAdmin ? "Admin" : "Logout"}
                </button>
              </td>
              {userRole === "Admin" && (
                <td className="border p-3">
                  {email === userEmail ? (
                    <button
                      disabled
                      className={`px-3 py-1 text-sm text-white rounded bg-blue-400 cursor-not-allowed`}
                    >
                      Admin
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (isDeleted) restoreUser(id, email);
                        else deleteUser(id, email);
                      }}
                      disabled={email === userEmail}
                      className={`px-3 py-1 text-sm text-white rounded ${
                        isDeleted
                          ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                          : "bg-red-600 hover:bg-red-700 cursor-pointer"
                      }`}
                    >
                      {isDeleted ? "Restore" : "Delete"}
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
