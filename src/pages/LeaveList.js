import { useEffect, useState } from "react";

function LeaveList() {

  const user = JSON.parse(localStorage.getItem("user"));
  const [leaves, setLeaves] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [msg, setMsg] = useState("");

  const [editLeaveData, setEditLeaveData] = useState({
    id: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: ""
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const res = await fetch("http://localhost:5000/api/leave");
    const data = await res.json();

    const myLeaves = data.filter(item => item.userId === user._id);
    setLeaves(myLeaves);
  };

  const cancelLeave = async (id) => {
    await fetch(`http://localhost:5000/api/leave/delete/${id}`, {
      method: "DELETE"
    });

    setMsg("❌ Leave cancelled");
    fetchLeaves();
  };

  const openEditPopup = (item) => {
    setEditLeaveData({
      id: item._id,
      leaveType: item.leaveType,
      startDate: item.startDate,
      endDate: item.endDate,
      reason: item.reason
    });
    setShowPopup(true);
  };

  const saveEdit = async () => {
    await fetch(`http://localhost:5000/api/leave/update/${editLeaveData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        leaveType: editLeaveData.leaveType,
        startDate: editLeaveData.startDate,
        endDate: editLeaveData.endDate,
        reason: editLeaveData.reason
      })
    });

    setMsg("✔️ Leave updated");
    setShowPopup(false);
    fetchLeaves();
  };

  return (
    <div style={{
      padding: "40px",
      background: "#f5f6ff",
      minHeight: "90vh"
    }}>

      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        📄 My Leave History
      </h2>

      {msg && (
        <p style={{
          textAlign: "center",
          fontWeight: "bold",
          color: msg.includes("✔️") ? "green" : "red"
        }}>
          {msg}
        </p>
      )}

      {/* ================== TABLE UI ==================== */}

      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        background: "white",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0px 0px 12px rgba(0,0,0,0.1)"
      }}>

        <thead>
          <tr style={{ background: "black", color: "white", textAlign: "left" }}>
            <th style={{ padding: "12px" }}>Type</th>
            <th style={{ padding: "12px" }}>From</th>
            <th style={{ padding: "12px" }}>To</th>
            <th style={{ padding: "12px" }}>Status</th>
            <th style={{ padding: "12px" }}>Reason</th>
            <th style={{ padding: "12px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((item, index) => (
            <tr
              key={index}
              style={{
                borderBottom: "1px solid #ddd",
                background: index % 2 === 0 ? "#fafafa" : "white"
              }}
            >

              <td style={{ padding: "12px" }}>{item.leaveType}</td>
              <td style={{ padding: "12px" }}>{item.startDate}</td>
              <td style={{ padding: "12px" }}>{item.endDate}</td>

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

              <td style={{ padding: "12px" }}>{item.reason}</td>

              <td style={{ padding: "12px" }}>
                {item.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => openEditPopup(item)}
                      style={{
                        padding: "6px 10px",
                        background: "black",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "6px"
                      }}
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() => cancelLeave(item._id)}
                      style={{
                        padding: "6px 10px",
                        background: "#d9534f",
                        color: "white",
                        borderRadius: "6px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      ❌ Cancel
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

      {/* =================== POPUP ===================== */}

      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "white",
            padding: "25px",
            width: "400px",
            maxHeight: "80vh",
            overflowY: "auto",
            borderRadius: "12px",
            boxShadow: "0px 0px 15px rgba(0,0,0,0.2)"
          }}>

            <h3 style={{ textAlign: "center", marginBottom: "15px" }}>
              ✏️ Edit Leave
            </h3>

            <label><b>Leave Type</b></label>
            <select
              value={editLeaveData.leaveType}
              onChange={e => setEditLeaveData({
                ...editLeaveData,
                leaveType: e.target.value
              })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #bbb"
              }}
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Medical Leave">Medical Leave</option>
              <option value="Vacation Leave">Vacation Leave</option>
            </select>

            <label><b>Start Date</b></label>
            <input
              type="date"
              value={editLeaveData.startDate}
              onChange={e => setEditLeaveData({
                ...editLeaveData,
                startDate: e.target.value
              })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #bbb"
              }}
            />

            <label><b>End Date</b></label>
            <input
              type="date"
              value={editLeaveData.endDate}
              onChange={e => setEditLeaveData({
                ...editLeaveData,
                endDate: e.target.value
              })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "6px",
                border: "1px solid #bbb"
              }}
            />

            <label><b>Reason</b></label>
            <textarea
              value={editLeaveData.reason}
              onChange={e => setEditLeaveData({
                ...editLeaveData,
                reason: e.target.value
              })}
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                resize: "none",
                minHeight: "80px"
              }}
            ></textarea>

            <div style={{
              display: "flex",
              justifyContent: "space-between"
            }}>
              
              <button
                onClick={saveEdit}
                style={{
                  width: "48%",
                  padding: "10px",
                  background: "black",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Save ✔️
              </button>

              <button
                onClick={() => setShowPopup(false)}
                style={{
                  width: "48%",
                  padding: "10px",
                  background: "#d1d1d1",
                  color: "black",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Close ✖️
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default LeaveList;
