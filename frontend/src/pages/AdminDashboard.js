import { useEffect, useState } from "react";
import "./Dashboard.css";

const API = "http://127.0.0.1:8000/api";

function AdminDashboard({ setIsLoggedIn }) {
  const [page, setPage] = useState("dashboard");

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);

  const token = localStorage.getItem("token");

  const logoutUser = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  // 🔐 Auth fetch
  const authFetch = async (url) => {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    return data;
  };

  // 🔥 Load Data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const docs = await authFetch(`${API}/doctors/`);
    const appts = await authFetch(`${API}/all-appointments/`);
    const slts = await authFetch(`${API}/slots/`);

    setDoctors(Array.isArray(docs) ? docs : []);
    setAppointments(Array.isArray(appts) ? appts : []);
    setSlots(Array.isArray(slts) ? slts : []);
  };

  // 🔥 Stats
  const totalDoctors = doctors.length;
  const totalAppointments = appointments.length;
  const totalSlots = slots.length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  return (
    <div className="layout">
      
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Admin Panel</h2>

        <ul>
          <li onClick={() => setPage("dashboard")}>📊 Dashboard</li>
          <li onClick={() => setPage("doctors")}>🧑‍⚕️ Doctors</li>
          <li onClick={() => setPage("slots")}>🕒 Slots</li>
          <li onClick={() => setPage("appointments")}>📅 Appointments</li>
        </ul>
      </div>

      {/* Main */}
      <div className="main">

        <div className="topbar">
          <h1>Admin Dashboard</h1>
          <button className="logout" onClick={logoutUser}>Logout</button>
        </div>

        {/* ================= DASHBOARD ================= */}
        {page === "dashboard" && (
          <div className="stats-grid">

            <div className="card">
              <h3>Total Doctors</h3>
              <p>{totalDoctors}</p>
            </div>

            <div className="card">
              <h3>Total Appointments</h3>
              <p>{totalAppointments}</p>
            </div>

            <div className="card">
              <h3>Total Slots</h3>
              <p>{totalSlots}</p>
            </div>

            <div className="card">
              <h3>Cancelled</h3>
              <p>{cancelled}</p>
            </div>

          </div>
        )}

        {/* ================= DOCTORS ================= */}
        {page === "doctors" && (
          <>
            <h2>All Doctors</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                </tr>
              </thead>

              <tbody>
                {doctors.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.name}</td>
                    <td>{doc.specialization}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= SLOTS ================= */}
        {page === "slots" && (
          <>
            <h2>All Slots</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {slots.map((s) => (
                  <tr key={s.id}>
                    <td>{s.doctor}</td>
                    <td>{s.date}</td>
                    <td>{s.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* ================= APPOINTMENTS ================= */}
        {page === "appointments" && (
          <>
            <h2>All Appointments</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Slot</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a) => (
                  <tr key={a.id}>
                    <td>{a.doctor_name || a.doctor}</td>
                    <td>{a.slot_date} {a.slot_time}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;