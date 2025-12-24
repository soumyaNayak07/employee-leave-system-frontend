import { useEffect, useState } from "react";
import { API_URL } from "../config";

function AdminPanel() {
  const loggedUser = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [showPassword, setShowPassword] = useState(false);
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch(`${API_URL}/api/auth/all-users`);
    const data = await res.json();
    setUsers(data);
  };

  const createUser = async () => {
    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }else if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    await fetch(`${API_URL}/api/auth/create-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    setName("");
    setEmail("");
    setPassword("");
    setRole("employee");
    loadUsers();
  };

  const updateRole = async (userId, newRole) => {
    await fetch(`${API_URL}/api/auth/change-role/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole })
    });
    loadUsers();
  };

  const resetLeaves = async () => {
    await fetch(`${API_URL}/api/auth/reset-leaves`, { method: "PUT" });
    loadUsers();
  };

  if (loggedUser.role !== "superadmin") {
    return <h2 style={{ padding: "40px" }}>Access Denied ❌</h2>;
  }

  const filteredUsers =
    filterRole === "All"
      ? users
      : users.filter(u => u.role === filterRole);

  return (
    <div style={page}>
      <h1 style={title}>Super Admin Dashboard</h1>

      {/* CREATE USER */}
      <div style={card}>
        <h3 style={sectionTitle}>Create User</h3>

        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={input} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={input} />

        <div style={passwordRow}>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...input, marginBottom: 0 }}
          />
          <button onClick={() => setShowPassword(!showPassword)} style={eyeBtn}>
            {showPassword ? "👁️" : "🙈"}
          </button>
        </div>

        <select value={role} onChange={e => setRole(e.target.value)} style={input}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="superadmin">Super Admin</option>
        </select>

        <button onClick={createUser} style={primaryBtn}>
          Create User
        </button>
      </div>

      {/* USERS HEADER */}
      <div style={headerRow}>
        <h3>All Users</h3>
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} style={filter}>
          <option value="All">All</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="superadmin">Super Admin</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <table style={table}>
        <thead>
          <tr style={thead}>
            <th>Name</th>
            <th>Email</th>
            <th>Current Role</th>
            <th>Change Role</th>
            <th>Leaves</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u._id} style={row}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span style={badge(u.role)}>{u.role}</span></td>
              <td>
                <select defaultValue={u.role} onChange={e => (u.newRole = e.target.value)}>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="superadmin">Super Admin</option>
                </select>
                <button onClick={() => updateRole(u._id, u.newRole || u.role)} style={confirmBtn}>
                  ✔
                </button>
              </td>
              <td>{u.remainingLeaves}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={resetLeaves} style={dangerBtn}>
        Reset All Leave Balances
      </button>
    </div>
  );
}

/* ================= STYLES ================= */

const page = {
  background: "#f4f6fb",
  minHeight: "100vh",
  padding: "40px"
};

const title = {
  textAlign: "center",
  marginBottom: "30px"
};

const card = {
  background: "white",
  maxWidth: "500px",
  margin: "0 auto 40px",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
};

const sectionTitle = {
  marginBottom: "20px",
  textAlign: "center"
};

const input = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};

const passwordRow = {
  display: "flex",
  gap: "8px",
  alignItems: "center",
  marginBottom: "12px"
};

const eyeBtn = {
  padding: "10px",
  borderRadius: "6px",
  cursor: "pointer",
  border: "1px solid #ccc",
  background: "#eee"
};

const primaryBtn = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "bold",
  cursor: "pointer"
};

const dangerBtn = {
  marginTop: "25px",
  padding: "12px 20px",
  background: "#dc2626",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  display: "block",
  marginLeft: "auto"
};

const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "15px"
};

const filter = {
  padding: "8px",
  borderRadius: "6px"
};

const table = {
  width: "100%",
  background: "white",
  borderCollapse: "collapse",
  borderRadius: "10px",
  overflow: "hidden",
  boxShadow: "0 6px 15px rgba(0,0,0,0.08)"
};

const thead = {
  background: "#111827",
  color: "white"
};

const row = {
  borderBottom: "1px solid #eee"
};

const confirmBtn = {
  marginLeft: "8px",
  cursor: "pointer"
};

const badge = role => ({
  padding: "4px 10px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "bold",
  color: "white",
  background:
    role === "superadmin"
      ? "#7c3aed"
      : role === "manager"
      ? "#0ea5e9"
      : "#16a34a"
});

export default AdminPanel;
