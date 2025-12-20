import { useEffect, useState } from "react";

function Dashboard() {

  const localUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(localUser);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch(
      `http://localhost:5000/api/auth/user/${localUser._id}`
    );

    const data = await res.json();
    setUser(data);

    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <div style={{
      padding: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      
      <div style={{
        width: "450px",
        padding: "30px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0px 0px 15px rgba(0,0,0,0.1)",
        textAlign: "center"
      }}>

        <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
          👋 Welcome, {user?.name}
        </h2>

        <p style={{
          marginBottom: "20px",
          background: "#000",
          color: "white",
          display: "inline-block",
          padding: "6px 14px",
          borderRadius: "6px",
          fontSize: "15px",
          fontWeight: "bold"
        }}>
          {user?.role.toUpperCase()}
        </p>

        <div style={{
          padding: "20px",
          background: "#f5f7ff",
          borderRadius: "10px",
          marginTop: "10px"
        }}>

          <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>
            📝 Remaining Leave Balance
          </h3>

          <p style={{
            fontSize: "40px",
            fontWeight: "bold",
            color: "#2c2c2c",
            margin: 0
          }}>
            {user?.remainingLeaves}
          </p>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;
