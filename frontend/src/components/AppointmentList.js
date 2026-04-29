import { useState } from "react";

const AVATAR_COLORS = [
  "linear-gradient(135deg,#6366f1,#3b82f6)",
  "linear-gradient(135deg,#0891b2,#06b6d4)",
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#059669,#10b981)",
];

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "short", day: "numeric",
  });
}

function getInitials(name = "Dr") {
  return name.replace(/^Dr\.?\s*/i, "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function AppointmentList({ appointments, onCancel }) {
  const [cancelling, setCancelling] = useState(null);

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancelling(id);
    await onCancel(id);
    setCancelling(null);
  };

  if (!appointments.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">📭</span>
        <div className="empty-state-title">No appointments yet</div>
        <div className="empty-state-desc">
          Book a slot with a doctor to see your appointments here.
        </div>
      </div>
    );
  }

  return (
    <div className="appt-list">
      {appointments.map((appt, i) => {
        const name = appt.doctor_name || "Unknown Doctor";
        return (
          <div key={appt.id} className="appt-card" style={{ animationDelay: `${i * 40}ms` }}>
            <div className="appt-left">
              <div
                className="appt-avatar"
                style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
              >
                {getInitials(name)}
              </div>
              <div>
                <div className="appt-doctor-name">{name}</div>
                <div className="appt-datetime">
                  📅 {formatDate(appt.slot_date)}
                  &nbsp;&nbsp;•&nbsp;&nbsp;
                  🕐 {formatTime(appt.slot_time)}
                </div>
              </div>
            </div>

            <div className="appt-right">
              <span className="badge badge-success">
                <span className="badge-dot" />
                Confirmed
              </span>
              <button
                className="btn btn-danger btn-xs"
                onClick={() => handleCancel(appt.id)}
                disabled={cancelling === appt.id}
              >
                {cancelling === appt.id ? "Cancelling…" : "Cancel"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}