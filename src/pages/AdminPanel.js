import { useEffect, useState } from "react";

function AdminPanel() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("employee");
  const [password, setPassword] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await fetch("http://localhost:5000/api/auth/all-users");
    const data = await res.json();
    setUsers(data);
  };

  const createUser = async () => {
    if (!name || !email || !password) {
      alert("All fields required");
      return;
    }

    await fetch("http://localhost:5000/api/auth/create-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    alert("User created successfully!");
    setName("");
    setEmail("");
    setPassword("");
    loadUsers();
  };

  const resetLeaves = async () => {
    await fetch("http://localhost:5000/api/auth/reset-leaves", {
      method: "PUT"
    });

    alert("Leave balance reset");
    loadUsers();
  };

  if (user.role !== "superadmin") {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Access Denied ❌</h2>
      </div>
    );
  }

  const filteredUsers =
    filterRole === "All"
      ? users
      : users.filter(u => u.role === filterRole.toLowerCase());

  return (
    <div style={{
      padding: "40px",
      background: "#f5f6ff",
      minHeight: "90vh"
    }}>

      <h2 style={{
        textAlign: "center",
        fontSize: "32px",
        marginBottom: "30px"
      }}>
        🛠 Super Admin Control Panel
      </h2>

      {/* CREATE USER CARD */}
      <div style={{
        width: "500px",
        margin: "0 auto",
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0px 0px 12px rgba(0,0,0,0.1)",
        marginBottom: "40px"
      }}>
        <h3 style={{
          textAlign: "center",
          marginBottom: "20px",
          fontSize: "24px"
        }}>
          👤 Create New User
        </h3>

        <input
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        />

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "12px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        />

        <select
          onChange={e => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "20px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <button
          onClick={createUser}
          style={{
            width: "100%",
            padding: "12px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px"
          }}
        >
          Create User ➕
        </button>
      </div>


      {/* USER LIST HEADER + FILTER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
      }}>
        <h3 style={{
          fontSize: "26px"
        }}>
          📋 All Users
        </h3>

        <select
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        >
          <option value="All">All</option>
          <option value="Employee">Employee</option>
          <option value="Manager">Manager</option>
        </select>
      </div>


      {/* USER LIST TABLE */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0px 0px 12px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <thead>
          <tr style={{
            background: "black",
            color: "white",
            textAlign: "left"
          }}>
            <th style={{ padding: "12px" }}>Name</th>
            <th style={{ padding: "12px" }}>Email</th>
            <th style={{ padding: "12px" }}>Role</th>
            <th style={{ padding: "12px" }}>Leaves</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((u, i) => (
            <tr
              key={i}
              style={{
                borderBottom: "1px solid #ddd",
                background: i % 2 === 0 ? "#fafafa" : "white"
              }}
            >
              <td style={{ padding: "12px" }}>{u.name}</td>
              <td style={{ padding: "12px" }}>{u.email}</td>
              <td style={{ padding: "12px" }}>{u.role}</td>
              <td style={{ padding: "12px" }}>{u.remainingLeaves}</td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* RESET LEAVES */}
      <button
        onClick={resetLeaves}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: "bold",
          display: "block",
          margin: "0 auto"
        }}
      >
        🔄 Reset All Leave Balances
      </button>

    </div>
  );
}

export default AdminPanel;
