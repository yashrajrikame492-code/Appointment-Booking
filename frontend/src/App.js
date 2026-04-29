import { useState } from "react";
import Auth from "./pages/Auth";
import PatientDashboard from "./pages/PatientDashboard";

export const API = "http://127.0.0.1:8000/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  return isLoggedIn ? (
    <PatientDashboard setIsLoggedIn={setIsLoggedIn} />
  ) : (
    <Auth setIsLoggedIn={setIsLoggedIn} />
  );
}