const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#6366f1,#3b82f6)",
  "linear-gradient(135deg,#0891b2,#06b6d4)",
  "linear-gradient(135deg,#7c3aed,#a855f7)",
  "linear-gradient(135deg,#059669,#10b981)",
  "linear-gradient(135deg,#d97706,#f59e0b)",
  "linear-gradient(135deg,#db2777,#f472b6)",
];

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function DoctorGrid({ doctors, selectedDoctor, onSelect }) {
  if (!doctors.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon">🏥</span>
        <div className="empty-state-title">No doctors available</div>
        <div className="empty-state-desc">Check back soon for available specialists.</div>
      </div>
    );
  }

  return (
    <div className="doctor-grid">
      {doctors.map((doc, i) => (
        <div
          key={doc.id}
          className={`doctor-card${selectedDoctor === doc.id ? " selected" : ""}`}
          onClick={() => onSelect(doc.id)}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <div
            className="doctor-avatar"
            style={{ background: AVATAR_GRADIENTS[i % AVATAR_GRADIENTS.length] }}
          >
            {getInitials(doc.name)}
          </div>

          <div className="doctor-name">{doc.name}</div>
          <div className="doctor-spec">{doc.specialization || "General Physician"}</div>

          <div className="doctor-meta">
            <span className="badge badge-success">
              <span className="badge-dot" />
              Available
            </span>
            <div className="doctor-rating">
              <span className="stars">★★★★★</span>
              <span>4.9</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}