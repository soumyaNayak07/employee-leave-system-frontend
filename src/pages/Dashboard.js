import { useEffect, useState } from "react";
import { API_URL } from "../config";

function Dashboard() {
  const localUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(localUser);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchLeaves();
  }, []);

  // 🔹 Fetch user details
  const fetchUser = async () => {
    const res = await fetch(`${API_URL}/api/auth/user/${localUser._id}`);
    const data = await res.json();
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  // 🔹 Fetch ONLY approved leaves for this user
  const fetchLeaves = async () => {
    const res = await fetch(`${API_URL}/api/leave`);
    const data = await res.json();

    const approvedLeaves = data.filter(
      (l) => l.userId === localUser._id && l.status === "Approved"
    );

    setLeaves(approvedLeaves);
  };

  // 🔹 All leave types (always visible)
  const LEAVE_TYPES = [
    "Medical Leave",
    "Casual Leave",
    "Sick Leave",
    "Vacation Leave"
  ];

  // 🔹 Count approved leaves per type
  const leaveCountByType = LEAVE_TYPES.reduce((acc, type) => {
    acc[type] = leaves.filter((l) => l.leaveType === type).length;
    return acc;
  }, {});

  const TOTAL_LEAVES = 20;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>👋 Welcome, {user?.name}</h2>

        <span style={styles.roleBadge}>
          {user?.role.toUpperCase()}
        </span>

        {/* STAT BOXES */}
        <div style={styles.grid}>

          <StatBox title="Total" value={TOTAL_LEAVES} color="#6366f1" />

          <StatBox
            title="Remaining"
            value={user?.remainingLeaves}
            color="#22c55e"
          />

          {LEAVE_TYPES.map((type, index) => (
            <StatBox
              key={type}
              title={type.replace(" Leave", "")}
              value={leaveCountByType[type]}
              color={colorPalette[index]}
            />
          ))}

        </div>
      </div>
    </div>
  );
}

/* ---------- STAT BOX ---------- */
function StatBox({ title, value, color }) {
  return (
    <div style={{ ...styles.statBox, borderTop: `4px solid ${color}` }}>
      <p style={styles.statTitle}>{title}</p>
      <p style={{ ...styles.statValue, color }}>{value}</p>
    </div>
  );
}

/* ---------- COLORS ---------- */
const colorPalette = [
  "#ef4444", // Medical
  "#f59e0b", // Casual
  "#0ea5e9", // Sick
  "#8b5cf6"  // Vacation
];

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #eef2ff, #f9f9ff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px"
  },
  card: {
    width: "100%",
    maxWidth: "1250px",
    background: "white",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.12)",
    textAlign: "center"
  },
  heading: {
    fontSize: "30px",
    marginBottom: "6px"
  },
  roleBadge: {
    display: "inline-block",
    background: "#111827",
    color: "white",
    padding: "6px 18px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "22px"
  },
  grid: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px"
  },
  statBox: {
    flex: 1,
    background: "#f9fafb",
    padding: "14px 10px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 6px 14px rgba(0,0,0,0.08)"
  },
  statTitle: {
    fontSize: "13px",
    marginBottom: "4px",
    color: "#374151",
    fontWeight: "600",
    whiteSpace: "nowrap"
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "bold",
    margin: 0
  }
};

export default Dashboard;
