import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { API_URL } from "../config";

function CalendarView() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [leaves, setLeaves] = useState([]);
  const [popupData, setPopupData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  /* ---------- DATE HELPERS ---------- */
  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  /* ---------- FETCH USER LEAVES ---------- */
  const fetchLeaves = async () => {
    try {
      const res = await fetch(`${API_URL}/api/leave`);
      const data = await res.json();

      const myLeaves = data
        .filter(l => l.userId && l.userId.toString() === user._id)
        .map(l => ({
          ...l,
          startDate: startOfDay(l.startDate),
          endDate: endOfDay(l.endDate)
        }));

      setLeaves(myLeaves);
    } catch (err) {
      console.error("Error fetching leaves", err);
    }
  };

  /* ---------- TILE COLOR ---------- */
  const markDate = ({ date }) => {
    const current = startOfDay(date);

    const match = leaves.find(
      l => current >= l.startDate && current <= l.endDate
    );

    if (!match) return null;

    if (match.status === "Approved") return "approved-day";
    if (match.status === "Pending") return "pending-day";
    if (match.status === "Rejected") return "rejected-day";
    return null;
  };

  /* ---------- DAY CLICK ---------- */
  const onDateClick = (date) => {
    const current = startOfDay(date);

    const found = leaves.filter(
      l => current >= l.startDate && current <= l.endDate
    );

    if (found.length > 0) {
      setPopupData(found);
      setShowPopup(true);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>📅 My Leave Calendar</h2>

      {/* CALENDAR CARD */}
      <div style={styles.calendarCard}>
        <Calendar
          tileClassName={markDate}
          onClickDay={onDateClick}
          showNeighboringMonth={false}
        />
      </div>

      {/* LEGEND */}
      <div style={styles.legendRow}>
        <Legend color="#86efac" label="Approved" />
        <Legend color="#fde68a" label="Pending" />
        <Legend color="#fca5a5" label="Rejected" />
      </div>

      {/* POPUP */}
      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h3 style={styles.popupTitle}>Leave Details</h3>

            {popupData.map((item, i) => (
              <div key={i} style={styles.popupCard}>
                <p><b>Type:</b> {item.leaveType}</p>
                <p><b>Status:</b> {item.status}</p>
                <p><b>From:</b> {item.startDate.toDateString()}</p>
                <p><b>To:</b> {item.endDate.toDateString()}</p>
                <p><b>Reason:</b> {item.reason}</p>
              </div>
            ))}

            <button style={styles.closeBtn} onClick={() => setShowPopup(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* CALENDAR STYLE OVERRIDES */}
      <style>{`
        .react-calendar {
          width: 100%;
          border: none;
          background: white;
          border-radius: 18px;
          padding: 18px;
          font-family: "Inter", "Segoe UI", sans-serif;
        }

        .react-calendar__navigation {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .react-calendar__navigation button {
          background: #f1f3ff;
          border: none;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 16px;
          cursor: pointer;
        }

        .react-calendar__navigation button:hover {
          background: #e0e7ff;
        }

        .react-calendar__navigation__label {
          font-weight: 600;
          font-size: 20px;
        }

        .react-calendar__month-view__weekdays {
          font-weight: 600;
          font-size: 14px;
          color: #6b7280;
          text-align: center;
          margin-bottom: 8px;
        }

        .react-calendar__tile {
          height: 52px;
          border-radius: 14px;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .react-calendar__tile:hover {
          background: #eef2ff;
          transform: scale(1.06);
        }

        .react-calendar__tile--now {
          background: #e0e7ff !important;
          border: 2px solid #6366f1;
          font-weight: bold;
        }

        .approved-day {
          background: #86efac !important;
          border-radius: 50%;
          font-weight: bold;
          color: #065f46;
        }

        .pending-day {
          background: #fde68a !important;
          border-radius: 50%;
          font-weight: bold;
          color: #92400e;
        }

        .rejected-day {
          background: #fca5a5 !important;
          border-radius: 50%;
          font-weight: bold;
          color: #7f1d1d;
        }
      `}</style>
    </div>
  );
}

/* ---------- LEGEND ---------- */
function Legend({ color, label }) {
  return (
    <div style={styles.legendItem}>
      <span style={{ ...styles.legendDot, background: color }}></span>
      {label}
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  page: {
    minHeight: "90vh",
    background: "linear-gradient(135deg, #eef2ff, #f9f9ff)",
    padding: "40px"
  },
  heading: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "25px"
  },
  calendarCard: {
    maxWidth: "460px",
    margin: "0 auto",
    background: "white",
    padding: "20px",
    borderRadius: "18px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.12)"
  },
  legendRow: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "40px"
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    fontSize: "17px",
    fontWeight: "500"
  },
  legendDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    marginRight: "8px"
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  popup: {
    background: "white",
    padding: "25px",
    width: "420px",
    maxHeight: "480px",
    overflowY: "auto",
    borderRadius: "16px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.25)"
  },
  popupTitle: {
    textAlign: "center",
    marginBottom: "15px"
  },
  popupCard: {
    background: "#f7f8ff",
    padding: "12px",
    borderRadius: "10px",
    marginBottom: "10px",
    border: "1px solid #e0e0ff"
  },
  closeBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "12px",
    background: "#2d3436",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer"
  }
};

export default CalendarView;
