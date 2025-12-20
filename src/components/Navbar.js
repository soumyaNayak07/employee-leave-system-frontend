import { Link } from "react-router-dom";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div style={{
      background: "black",
      padding: "15px 30px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "white",
      marginBottom: "30px"
    }}>

      {/* LEFT BRAND LOGO */}
      <div style={{ fontSize: "22px", fontWeight: "bold" }}>
        🧾 Leave System
      </div>

      {/* CENTER LINKS */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "20px",
        fontSize: "16px"
      }}>

        <Link
          to="/dashboard"
          style={{
            color: "white",
            textDecoration: "none",
            padding: "6px 10px"
          }}
        >
          Dashboard
        </Link>

        {user?.role === "employee" && (
          <>
            <Link
              to="/apply"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Apply Leave
            </Link>

            <Link
              to="/list"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Leave History
            </Link>

            <Link
              to="/calendar"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Calendar
            </Link>
          </>
        )}

        {user?.role === "manager" && (
          <>
            <Link
              to="/manage"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Manage Leaves
            </Link>

            <Link
              to="/calendar"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Calendar
            </Link>
          </>
        )}

        {user?.role === "superadmin" && (
          <>
            <Link
              to="/admin"
              style={{
                color: "white",
                textDecoration: "none",
                padding: "6px 10px"
              }}
            >
              Admin Panel
            </Link>
          </>
        )}
      </div>

      {/* RIGHT SIDE USER + LOGOUT */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        
        {/* ROLE BADGE */}
        <span style={{
          background: "white",
          color: "black",
          padding: "4px 10px",
          borderRadius: "6px",
          fontSize: "13px",
          fontWeight: "bold",
          textTransform: "uppercase"
        }}>
          {user?.role}
        </span>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          style={{
            padding: "8px 15px",
            background: "white",
            color: "black",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;
