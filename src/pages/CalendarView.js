import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarView() {

  const [leaves, setLeaves] = useState([]);
  const [popupData, setPopupData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    const res = await fetch("http://localhost:5000/api/leave");
    const data = await res.json();
    setLeaves(data);
  };

  const markDate = ({ date }) => {

    const match = leaves.find(
      l => new Date(l.startDate) <= date && new Date(l.endDate) >= date
    );

    if (!match) return null;

    if (match.status === "Approved") return "approved-day";
    if (match.status === "Pending") return "pending-day";
    if (match.status === "Rejected") return "rejected-day";

    return null;
  };

  const onDateClick = (date) => {

    const found = leaves.filter(
      l => new Date(l.startDate) <= date && new Date(l.endDate) >= date
    );

    if (found.length > 0) {
      setPopupData(found);
      setShowPopup(true);
    }
  };

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
        📅 Leave Calendar
      </h2>

      {/* CALENDAR WRAPPER */}
      <div style={{
        width: "450px",
        margin: "0 auto",
        background: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0px 0px 12px rgba(0,0,0,0.1)"
      }}>
        <Calendar
          locale="en"
          tileClassName={markDate}
          onClickDay={onDateClick}
          nextLabel="›"
          next2Label="»"
          prevLabel="‹"
          prev2Label="«"
        />
      </div>

      {/* CALENDAR OVERRIDES */}
      <style>{`

        .react-calendar {
          width: 100% !important;
          max-width: 450px !important;
          background: white !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 10px !important;
          font-family: sans-serif !important;
        }

        .react-calendar__navigation {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          margin-bottom: 20px !important;
        }

        .react-calendar__navigation button {
          background: none !important;
          border: none !important;
          font-size: 20px !important;
          padding: 8px 12px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          transition: 0.2s !important;
        }

        .react-calendar__navigation button:hover {
          background: #ededed !important;
        }

        .react-calendar__navigation__label {
          font-size: 22px !important;
          font-weight: bold !important;
        }

        .react-calendar__month-view__weekdays {
          text-align: center !important;
          font-size: 15px !important;
          font-weight: bold !important;
          color: #666 !important;
          margin-bottom: 5px !important;
        }

        .react-calendar__tile {
          padding: 15px 5px !important;
          font-size: 17px !important;
          border-radius: 10px !important;
          transition: 0.2s !important;
        }

        .react-calendar__tile:hover {
          background: #dfefff !important;
          cursor: pointer !important;
          transform: scale(1.05) !important;
        }

        .react-calendar__tile--active {
          background: #8aadff !important;
          color: white !important;
        }

        .react-calendar__tile--now {
          background: #bcd3ff !important;
          border: 2px solid #005eff !important;
        }

        .approved-day {
          background: #9bff9b !important;
          border-radius: 50% !important;
          border: 2px solid green !important;
          color: black !important;
          font-weight: bold !important;
        }

        .pending-day {
          background: #fff199 !important;
          border-radius: 50% !important;
          border: 2px solid orange !important;
          color: black !important;
          font-weight: bold !important;
        }

        .rejected-day {
          background: #ff9b9b !important;
          border-radius: 50% !important;
          border: 2px solid red !important;
          color: black !important;
          font-weight: bold !important;
        }

      `}</style>


      {/* LEGEND */}
      <div style={{
        marginTop: "35px",
        display: "flex",
        justifyContent: "center",
        gap: "45px",
        flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", fontSize: "18px" }}>
          <span style={{
            width: "18px",
            height: "18px",
            background: "#9bff9b",
            borderRadius: "50%",
            marginRight: "10px",
            border: "2px solid green"
          }}></span>
          Approved
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: "18px" }}>
          <span style={{
            width: "18px",
            height: "18px",
            background: "#fff199",
            borderRadius: "50%",
            marginRight: "10px",
            border: "2px solid orange"
          }}></span>
          Pending
        </div>

        <div style={{ display: "flex", alignItems: "center", fontSize: "18px" }}>
          <span style={{
            width: "18px",
            height: "18px",
            background: "#ff9b9b",
            borderRadius: "50%",
            marginRight: "10px",
            border: "2px solid red"
          }}></span>
          Rejected
        </div>
      </div>


      {/* POPUP */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 999
        }}>

          <div style={{
            background: "white",
            padding: "20px",
            width: "450px",
            maxHeight: "450px",
            overflowY: "auto",
            borderRadius: "12px",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)"
          }}>

            <h3 style={{
              fontSize: "24px",
              marginBottom: "20px",
              textAlign: "center"
            }}>
              📌 Leave Details
            </h3>

            {popupData.map((item, index) => (
              <div key={index} style={{
                background: "#f8f8f8",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "12px",
                border: "1px solid #ddd"
              }}>
                <p><b>Name:</b> {item.name}</p>
                <p><b>Type:</b> {item.leaveType}</p>
                <p><b>Status:</b> {item.status}</p>
                <p><b>From:</b> {item.startDate}</p>
                <p><b>To:</b> {item.endDate}</p>
                <p><b>Reason:</b> {item.reason}</p>
              </div>
            ))}

            <button
              onClick={() => setShowPopup(false)}
              style={{
                padding: "12px",
                width: "100%",
                background: "black",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold"
              }}
            >
              Close ×
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default CalendarView;
