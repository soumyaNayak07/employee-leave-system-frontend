import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {

    setMsg("Checking...");

    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!data.user) {
      setMsg("❌ Invalid login details");
      return;
    }

    setMsg("✅ Login successful !");
    localStorage.setItem("user", JSON.stringify(data.user));

    setTimeout(() => {
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f6ff"
    }}>

      <div style={{
        width: "350px",
        padding: "30px",
        background: "white",
        boxShadow: "0px 0px 15px rgba(0,0,0,0.2)",
        borderRadius: "10px",
        textAlign: "center"
      }}>

        <h2 style={{ marginBottom: "20px" }}>
          🔒 Login
        </h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #bbb"
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
            border: "1px solid #bbb"
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "10px",
            background: "black",
            color: "white",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer"
          }}
        >
          Login →
        </button>

        {msg && (
          <p style={{
            marginTop: "15px",
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

export default Login;
