import { motion } from "framer-motion";

function DoctorCard({ doctor, onSelectDoctor }) {
  return (
    <motion.div
      className="card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <h3>{doctor.name}</h3>

      <p>
        <b>Specialty:</b> {doctor.specialty}
      </p>

      <p className="exp">
        <b>Experience:</b> {doctor.experience} years
      </p>

      <motion.button
        className="book-btn"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelectDoctor(doctor.id)}  // ✅ FIX
      >
        View Slots
      </motion.button>
    </motion.div>
  );
}

export default DoctorCard;