import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveList from "./pages/LeaveList";
import ManageLeaves from "./pages/ManageLeaves";
import Dashboard from "./pages/Dashboard";
import CalendarView from "./pages/CalendarView";
import AdminPanel from "./pages/AdminPanel";

function AppWrapper() {
  const location = useLocation();

  // Hide navbar only on login page
  const hideNavbar = location.pathname === "/";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/apply" element={<ApplyLeave />} />
        <Route path="/list" element={<LeaveList />} />
        <Route path="/manage" element={<ManageLeaves />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
