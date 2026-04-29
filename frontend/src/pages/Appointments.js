import { useEffect, useState } from "react";
import { getAppointments, cancelAppointment } from "../api";

function Appointments() {

  const [appointments, setAppointments] = useState([]);

  const fetchData = () => {
    const token = localStorage.getItem("token");

    getAppointments(token).then(data => {
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCancel = (id) => {
    const token = localStorage.getItem("token");

    cancelAppointment(id, token).then(() => {
      alert("Cancelled ❌");
      fetchData();
    });
  };

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.length === 0 && <p>No data</p>}

      {appointments.map(appt => (
        <div key={appt.id}>
          Doctor: {appt.doctor} <br />
          Slot: {appt.slot}
          <button onClick={() => handleCancel(appt.id)}>
            Cancel
          </button>
        </div>
      ))}
    </div>
  );
}

export default Appointments;