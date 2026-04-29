const BASE_URL = "http://127.0.0.1:8000/api";

export const loginAPI = (data) => {
  return fetch(`${BASE_URL}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const getDoctors = () => {
  return fetch(`${BASE_URL}/doctors/`)
    .then(res => res.json());
};

export const getSlots = () => {
  return fetch(`${BASE_URL}/slots/`)
    .then(res => res.json());
};

export const bookSlot = (data, token) => {
  return fetch(`${BASE_URL}/book/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const getAppointments = (token) => {
  return fetch(`${BASE_URL}/my-appointments/`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }).then(res => res.json());
};

export const cancelAppointment = (id, token) => {
  return fetch(`${BASE_URL}/cancel/${id}/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  }).then(res => res.json());
};