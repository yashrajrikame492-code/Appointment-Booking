const PAGE_META = {
  home:         { title: "Dashboard",       breadcrumb: "Home / Doctors" },
  appointments: { title: "My Appointments", breadcrumb: "Home / Appointments" },
};

export default function Topbar({ page, onLogout }) {
  const meta = PAGE_META[page] || PAGE_META.home;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>{meta.title}</h1>
        <div className="topbar-breadcrumb">{meta.breadcrumb}</div>
      </div>

      <div className="topbar-right">
        <div className="topbar-search">
          <span className="topbar-search-icon">🔍</span>
          Search doctors, slots…
        </div>

        <button className="topbar-icon-btn" title="Notifications">🔔</button>
        <button className="topbar-icon-btn" title="Calendar">📋</button>

        <div className="topbar-avatar" title="My account">JD</div>

        <button className="btn btn-danger btn-sm" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}