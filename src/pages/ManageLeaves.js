import { useEffect, useState } from "react";

function ManageLeaves() {

  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Pending");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("http://localhost:5000/api/leave");
    const data = await res.json();
    setLeaves(data);
  };

  const updateLeave = async (id, status) => {
    await fetch(`http://localhost:5000/api/leave/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    setMsg(`✔️ Leave ${status}`);
    loadData();
  };

  const filteredLeaves = statusFilter === "All"
    ? leaves
    : leaves.filter(item => item.status === statusFilter);

  return (
    <div style={{
      padding: "40px",
      background: "#f5f6ff",
      minHeight: "90vh"
    }}>

      <h2 style={{
        textAlign: "center",
        fontSize: "32px",
        marginBottom: "25px"
      }}>
        🧾 Manage Leave Requests
      </h2>

      {msg && (
        <p style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "green"
        }}>
          {msg}
        </p>
      )}

      {/* FILTER */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            padding: "10px",
            fontSize: "16px",
            borderRadius: "6px",
            border: "1px solid #bbb"
          }}
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* TABLE */}
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0px 0px 12px rgba(0,0,0,0.1)"
      }}>

        <thead>
          <tr style={{
            background: "black",
            color: "white",
            textAlign: "left"
          }}>
            <th style={{ padding: "12px" }}>Name</th>
            <th style={{ padding: "12px" }}>Type</th>
            <th style={{ padding: "12px" }}>From</th>
            <th style={{ padding: "12px" }}>To</th>
            <th style={{ padding: "12px" }}>Reason</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredLeaves.map((item, index) => (
            <tr
              key={index}
              style={{
                borderBottom: "1px solid #ddd",
                background: index % 2 === 0 ? "#fafafa" : "white"
              }}
            >
              <td style={{ padding: "12px" }}>{item.name}</td>
              <td style={{ padding: "12px" }}>{item.leaveType}</td>
              <td style={{ padding: "12px" }}>{item.startDate}</td>
              <td style={{ padding: "12px" }}>{item.endDate}</td>
              <td style={{ padding: "12px" }}>{item.reason}</td>

              {/* STATUS BADGE */}
              <td style={{ padding: "12px", fontWeight: "bold" }}>
                <span style={{
                  padding: "5px 10px",
                  borderRadius: "5px",
                  color: "white",
                  background:
                    item.status === "Approved" ? "green" :
                    item.status === "Rejected" ? "red" :
                    "orange"
                }}>
                  {item.status}
                </span>
              </td>

              {/* ACTION BUTTONS */}
              <td style={{ padding: "12px" }}>
                {item.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => updateLeave(item._id, "Approved")}
                      style={{
                        padding: "6px 10px",
                        background: "green",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "6px"
                      }}
                    >
                      ✔️ Approve
                    </button>

                    <button
                      onClick={() => updateLeave(item._id, "Rejected")}
                      style={{
                        padding: "6px 10px",
                        background: "#d9534f",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      ❌ Reject
                    </button>
                  </>
                ) : (
                  <span style={{ color: "grey" }}>—</span>
                )}
              </td>

            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default ManageLeaves;
