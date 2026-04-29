const NAV_ITEMS = [
  { id: "home",         label: "Dashboard",      icon: "🏠", section: "Overview" },
  { id: "appointments", label: "My Appointments", icon: "📅" },
];

function getInitials(name = "User") {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Sidebar({ page, setPage, onLogout, fetchAppointments }) {
  const username = localStorage.getItem("username") || "Patient";

  const handleNav = (id) => {
    setPage(id);
    if (id === "appointments") fetchAppointments();
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-mark">⚕️</div>
        <span className="sidebar-logo-text">
          Medi<span>Panel</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item, i) => (
          <div key={item.id}>
            {item.section && (
              <div className="nav-section-label">{item.section}</div>
            )}
            {i === 2 && <div className="nav-section-label">Manage</div>}
            <div
              className={`nav-item${page === item.id ? " active" : ""}`}
              onClick={() => handleNav(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 12 }}>System</div>
        <div className="nav-item">
          <span className="nav-icon">⚙️</span>
          <span>Settings</span>
        </div>
        <div className="nav-item">
          <span className="nav-icon">❓</span>
          <span>Help & Support</span>
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar-sm">{getInitials(username)}</div>
          <div className="user-info-sm">
            <div className="user-name-sm">{username}</div>
            <div className="user-role-sm">Patient</div>
          </div>
        </div>
        <div className="nav-item logout" onClick={onLogout}>
          <span className="nav-icon">🚪</span>
          <span>Log out</span>
        </div>
      </div>
    </aside>
  );
}