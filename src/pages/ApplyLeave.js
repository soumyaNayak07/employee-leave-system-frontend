import { useState } from "react";

function ApplyLeave() {

  const user = JSON.parse(localStorage.getItem("user"));
  
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [msg, setMsg] = useState("");

  const submitForm = async () => {

    if (!leaveType || !startDate || !endDate || !reason) {
      setMsg("❌ All fields are required");
      return;
    }

    setMsg("Processing...");

    const res = await fetch("http://localhost:5000/api/leave/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        name: user.name,
        leaveType,
        startDate,
        endDate,
        reason
      })
    });

    const data = await res.json();

    setMsg(data.message.includes("applied") ? "✅ Leave applied!" : "❌ Failed");

    if (data.remainingLeaves !== undefined) {
      const updatedUser = {
        ...user,
        remainingLeaves: data.remainingLeaves
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const clearForm = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setMsg("");
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      padding: "40px",
      background: "#f5f6ff",
      minHeight: "90vh"
    }}>

      <div style={{
        width: "450px",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
      }}>

        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          📝 Apply for Leave
        </h2>

        <label style={{ fontWeight: "bold" }}>Employee Name</label>
        <input
          type="text"
          value={user.name}
          disabled
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #bbb",
            background: "#e9e9e9"
          }}
        />

        <label style={{ fontWeight: "bold" }}>Leave Type</label>
        <select
          value={leaveType}
          onChange={e => setLeaveType(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #bbb",
            background: "white"
          }}
        >
          <option value="">Select Leave Type</option>
          <option value="Sick Leave">Sick Leave</option>
          <option value="Casual Leave">Casual Leave</option>
          <option value="Medical Leave">Medical Leave</option>
          <option value="Vacation Leave">Vacation Leave</option>
        </select>

        <label style={{ fontWeight: "bold" }}>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={e => setStartDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #bbb"
          }}
        />

        <label style={{ fontWeight: "bold" }}>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "15px",
            borderRadius: "5px",
            border: "1px solid #bbb"
          }}
        />

        <label style={{ fontWeight: "bold" }}>Reason</label>
        <textarea
          placeholder="Write leave reason..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "5px",
            border: "1px solid #bbb",
            resize: "none",
            minHeight: "80px"
          }}
        ></textarea>

        <div style={{ display: "flex", justifyContent: "space-between" }}>

          <button
            onClick={submitForm}
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
            Submit →
          </button>

          <button
            onClick={clearForm}
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
            Cancel ×
          </button>

        </div>

        {msg && (
          <p style={{
            marginTop: "15px",
            textAlign: "center",
            fontWeight: "bold",
            color: msg.includes("❌") ? "red" : "green"
          }}>
            {msg}
          </p>
        )}

      </div>

    </div>
  );
}

export default ApplyLeave;
