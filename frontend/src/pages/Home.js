import { useEffect, useState } from "react";
import { getDoctors, getSlots, bookSlot } from "../api";

function Home() {

  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    getDoctors().then(setDoctors);
    getSlots().then(setSlots);
  }, []);

  const handleBook = (slot) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login first ❌");
      return;
    }

    bookSlot({
      doctor: slot.doctor,
      slot: slot.id
    }, token).then(data => {
      console.log(data);

      if (data.id) {
        alert("Booked ✅");
      } else {
        alert("Failed ❌");
      }
    });
  };

  return (
    <div>
      <h2>Doctors</h2>
      {doctors.map(doc => (
        <div key={doc.id}>{doc.name}</div>
      ))}

      <h2>Slots</h2>
      {slots.map(slot => (
        <div key={slot.id}>
          {slot.date} - {slot.time}
          <button onClick={() => handleBook(slot)}>Book</button>
        </div>
      ))}
    </div>
  );
}

export default Home;