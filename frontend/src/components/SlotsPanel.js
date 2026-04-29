import { useState } from "react";

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    weekday: "short", month: "short", day: "numeric",
  });
}

export default function SlotsPanel({ slots, loading, onBook, doctorName }) {
  const [booking, setBooking] = useState(null);

  const handleBook = async (slot) => {
    setBooking(slot.id);
    await onBook(slot);
    setBooking(null);
  };

  return (
    <div className="slots-panel animate-slide-up">
      <div className="slots-panel-header">
        <div>
          <div className="slots-panel-title">
            📋 Available Slots {doctorName && `— ${doctorName}`}
          </div>
        </div>
        <span className="badge badge-info">{slots.length} open</span>
      </div>

      <div className="slots-panel-body">
        {loading ? (
          <>
            <div className="skeleton skeleton-row" />
            <div className="skeleton skeleton-row" />
            <div className="skeleton skeleton-row" />
          </>
        ) : slots.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon">📭</span>
            <div className="empty-state-title">No slots available</div>
            <div className="empty-state-desc">
              This doctor has no open slots right now.
            </div>
          </div>
        ) : (
          slots.map((slot) => (
            <div key={slot.id} className="slot-item">
              <div className="slot-info">
                <div className="slot-time">
                  🕐 {formatTime(slot.time)}
                </div>
                <div className="slot-date">{formatDate(slot.date)}</div>
              </div>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleBook(slot)}
                disabled={booking === slot.id}
              >
                {booking === slot.id ? "Booking…" : "Book Slot"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}