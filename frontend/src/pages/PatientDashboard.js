import { useEffect, useState, useCallback } from "react";
import "../App.css";

// ── Components ────────────────────────────────────────────────────────────────
import Sidebar          from "../components/Sidebar";
import Topbar           from "../components/Topbar";
import StatsRow         from "../components/StatsRow";
import DoctorGrid       from "../components/DoctorGrid";
import SlotsPanel       from "../components/SlotsPanel";
import AppointmentList  from "../components/AppointmentList";

// ── Hooks ─────────────────────────────────────────────────────────────────────
import useToast         from "../hooks/useToast";

const API = "http://127.0.0.1:8000/api";

// =============================================================================
// PATIENT DASHBOARD
// =============================================================================
function PatientDashboard({ setIsLoggedIn }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [doctors,        setDoctors]        = useState([]);
  const [slots,          setSlots]          = useState([]);
  const [appointments,   setAppointments]   = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [page,           setPage]           = useState("home");
  const [slotsLoading,   setSlotsLoading]   = useState(false);
  const [apptLoading,    setApptLoading]    = useState(false);
  const [doctorsLoading, setDoctorsLoading] = useState(true);

  // ── Hooks ──────────────────────────────────────────────────────────────────
  const { addToast, ToastContainer } = useToast();

  const token = localStorage.getItem("token");

  // ── Auth Fetch ─────────────────────────────────────────────────────────────
  const authFetch = useCallback(
    async (url, options = {}) => {
      try {
        const res = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data.code === "token_not_valid") {
          localStorage.clear();
          setIsLoggedIn(false);
          return null;
        }

        return data;
      } catch {
        addToast("Network error. Please try again.", "error");
        return null;
      }
    },
    [token, setIsLoggedIn, addToast]
  );

  // ── Load Doctors ───────────────────────────────────────────────────────────
  useEffect(() => {
    const loadDoctors = async () => {
      setDoctorsLoading(true);
      try {
        const data = await fetch(`${API}/doctors/`).then((r) => r.json());
        setDoctors(Array.isArray(data) ? data : []);
      } catch {
        addToast("Failed to load doctors. Check your connection.", "error");
      }
      setDoctorsLoading(false);
    };
    loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logoutUser = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  // ── Fetch Slots ────────────────────────────────────────────────────────────
  const fetchSlots = async (doctorId) => {
    // toggle off if same doctor clicked again
    if (doctorId === selectedDoctor) {
      setSelectedDoctor(null);
      setSlots([]);
      return;
    }

    setSelectedDoctor(doctorId);
    setSlotsLoading(true);

    try {
      const data = await fetch(`${API}/slots/?doctor=${doctorId}`).then((r) =>
        r.json()
      );
      setSlots(Array.isArray(data) ? data : []);
    } catch {
      addToast("Failed to load slots.", "error");
    }

    setSlotsLoading(false);
  };

  // ── Book Appointment ───────────────────────────────────────────────────────
  const bookAppointment = async (slot) => {
    const data = await authFetch(`${API}/book/`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ doctor: slot.doctor, slot: slot.id }),
    });

    if (!data) return;

    if (data.id) {
      addToast("Appointment booked successfully!", "success");
      setSlots((prev) => prev.filter((s) => s.id !== slot.id));
    } else {
      addToast(data.error || "Booking failed. Please try again.", "error");
    }
  };

  // ── Fetch Appointments ─────────────────────────────────────────────────────
  const fetchAppointments = async () => {
    setApptLoading(true);
    const data = await authFetch(`${API}/my-appointments/`);
    if (data) setAppointments(Array.isArray(data) ? data : []);
    setApptLoading(false);
  };

  // ── Cancel Appointment ─────────────────────────────────────────────────────
  const cancelAppointment = async (id) => {
    const data = await authFetch(`${API}/cancel/${id}/`, { method: "POST" });
    if (data !== null) {
      addToast("Appointment cancelled.", "default");
      fetchAppointments();
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const selectedDoctorName =
    doctors.find((d) => d.id === selectedDoctor)?.name || "";

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      {/* ── SIDEBAR ── */}
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={logoutUser}
        fetchAppointments={fetchAppointments}
      />

      {/* ── MAIN ── */}
      <div className="main-content">
        {/* ── TOPBAR ── */}
        <Topbar page={page} onLogout={logoutUser} />

        {/* ── PAGE BODY ── */}
        <div className="page-body">

          {/* ══════════════════════════════════════
              HOME PAGE
          ══════════════════════════════════════ */}
          {page === "home" && (
            <div className="animate-fade-in">

              {/* Stats */}
              <StatsRow
                doctors={doctors}
                appointments={appointments}
              />

              {/* Section heading */}
              <div className="section-header">
                <div>
                  <div className="section-title">Our Specialists</div>
                  <div className="section-subtitle">
                    Select a doctor to view available appointment slots
                  </div>
                </div>
                <span className="section-action">
                  {doctors.length} doctors available
                </span>
              </div>

              {/* Doctors skeleton */}
              {doctorsLoading ? (
                <div className="doctor-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-card" />
                  ))}
                </div>
              ) : (
                <DoctorGrid
                  doctors={doctors}
                  selectedDoctor={selectedDoctor}
                  onSelect={fetchSlots}
                />
              )}

              {/* Slots panel — appears when a doctor is selected */}
              {selectedDoctor && (
                <SlotsPanel
                  slots={slots}
                  loading={slotsLoading}
                  onBook={bookAppointment}
                  doctorName={selectedDoctorName}
                />
              )}
            </div>
          )}

          {/* ══════════════════════════════════════
              APPOINTMENTS PAGE
          ══════════════════════════════════════ */}
          {page === "appointments" && (
            <div className="animate-fade-in">

              {/* Section heading */}
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                  <div className="section-title">My Appointments</div>
                  <div className="section-subtitle">
                    View, manage and cancel your upcoming bookings
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={fetchAppointments}
                >
                  🔄&nbsp; Refresh
                </button>
              </div>

              {/* Loading skeletons */}
              {apptLoading ? (
                <div>
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="skeleton skeleton-row"
                      style={{ marginBottom: 12 }}
                    />
                  ))}
                </div>
              ) : (
                <AppointmentList
                  appointments={appointments}
                  onCancel={cancelAppointment}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST NOTIFICATIONS ── */}
      <ToastContainer />
    </div>
  );
}

export default PatientDashboard;