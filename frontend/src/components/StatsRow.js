export default function StatsRow({ doctors, appointments }) {
  const available = doctors.length;
  const total     = appointments.length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-card-icon icon-blue">👨‍⚕️</div>
        <div className="stat-card-label">Available Doctors</div>
        <div className="stat-card-value">{available}</div>
        <div className="stat-card-delta delta-up">↑ Active today</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon icon-green">📅</div>
        <div className="stat-card-label">My Appointments</div>
        <div className="stat-card-value">{total}</div>
        <div className="stat-card-delta delta-up">↑ All time</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon icon-amber">⏱️</div>
        <div className="stat-card-label">Avg. Wait Time</div>
        <div className="stat-card-value">12m</div>
        <div className="stat-card-delta delta-up">↑ 3m faster</div>
      </div>

      <div className="stat-card">
        <div className="stat-card-icon icon-purple">⭐</div>
        <div className="stat-card-label">Satisfaction</div>
        <div className="stat-card-value">4.9</div>
        <div className="stat-card-delta delta-up">↑ 0.2 this month</div>
      </div>
    </div>
  );
}