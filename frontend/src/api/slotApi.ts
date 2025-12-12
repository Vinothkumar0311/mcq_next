// // src/api/slotApi.ts
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api"; // adjust if your backend uses a different port

// // ✅ VENUE API
// export const getVenues = async () => {
//   const response = await axios.get(`${API_BASE_URL}/venues`);
//   return response.data.data;
// };

// export const createVenue = async (venueData: any) => {
//   const response = await axios.post(`${API_BASE_URL}/venues`, venueData);
//   return response.data.data;
// };

// export const updateVenue = async (id: number, venueData: any) => {
//   const response = await axios.put(`${API_BASE_URL}/venues/${id}`, venueData);
//   return response.data.data;
// };

// export const deleteVenue = async (id: number) => {
//   const response = await axios.delete(`${API_BASE_URL}/venues/${id}`);
//   return response.data;
// };

// // ✅ SLOT API
// export const getSlots = async () => {
//   const response = await axios.get(`${API_BASE_URL}/slots`);
//   return response.data.data;
// };

// export const createSlot = async (slotData: any) => {
//   const response = await axios.post(`${API_BASE_URL}/slots`, slotData);
//   return response.data.data;
// };

// export const updateSlot = async (id: number, slotData: any) => {
//   const response = await axios.put(`${API_BASE_URL}/slots/${id}`, slotData);
//   return response.data.data;
// };

// export const deleteSlot = async (id: number) => {
//   const response = await axios.delete(`${API_BASE_URL}/slots/${id}`);
//   return response.data;
// };


// src/api/slotApi.ts
import axios from "axios";

export const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance with token
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* ======================
      VENUE API
====================== */
export const getVenues = async () => {
  const response = await axiosInstance.get(`/venues`);
  return response.data.data;
};

export const createVenue = async (venueData: any) => {
  const response = await axiosInstance.post(`/venues`, venueData);
  return response.data.data;
};

export const updateVenue = async (id: number, venueData: any) => {
  const response = await axiosInstance.put(`/venues/${id}`, venueData);
  return response.data.data;
};

export const deleteVenue = async (id: number) => {
  const response = await axiosInstance.delete(`/venues/${id}`);
  return response.data;
};

/* ======================
      SLOT API
====================== */
export const getSlots = async () => {
  const response = await axiosInstance.get(`/slots`);
  return response.data.data;
};

export const createSlot = async (slotData: any) => {
  const response = await axiosInstance.post(`/slots`, slotData);
  return response.data.data;
};

export const updateSlot = async (id: number, slotData: any) => {
  const response = await axiosInstance.put(`/slots/${id}`, slotData);
  return response.data.data;
};

export const deleteSlot = async (id: number) => {
  const response = await axiosInstance.delete(`/slots/${id}`);
  return response.data;
};

/* ======================
  STUDENT BOOKING API
====================== */

// GET available slots
export const getAvailableSlots = async () => {
  const response = await axiosInstance.get(`/slots/`);
  return response.data; // return full list
};

// BOOK a slot
export const bookSlotApi = async (studentId: number, slotId: number) => {
  const response = await axiosInstance.post(`/slot-booking/book`, {
    studentId,
    slotId,
  });
  return response.data;
};

// get student bookings
export const getStudentBookings = async (studentId: number) => {
  const response = await axiosInstance.get(
    `/slot-booking/student/${studentId}`
  );
  return response.data.data;
};

// cancel a booking
export const cancelBooking = async (bookingId: number) => {
  const response = await axiosInstance.delete(
    `/slot-booking/cancel/${bookingId}`
  );
  return response.data;
};
