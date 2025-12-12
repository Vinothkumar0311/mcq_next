// // src/api/courseApi.ts
// import axios from "axios";

// const API_BASE_URL = "http://localhost:5000/api"; // 👈 change if needed

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const courseApi = {
//   // Get all courses
//   getCourses: async () => {
//     const res = await api.get("/courses/");
//     return res.data.data;
//   },

//   // Get single course
//   getCourseById: async (id: number | string) => {
//     const res = await api.get(`/courses/${id}`);
//     return res.data;
//   },

//   // Create course
//   createCourse: async (data: any) => {
//     const res = await api.post("/courses", data);
//     return res.data.data;
//   },

//   // Update course
//   updateCourse: async (id: number | string, data: any) => {
//     const res = await api.put(`/courses/${id}`, data);
//     return res.data;
//   },

//   // Delete course
//   deleteCourse: async (id: number | string) => {
//     const res = await api.delete(`/courses/${id}`);
//     return res.data;
//   },

//   // Toggle publish status
//   togglePublished: async (id: number | string) => {
//     const res = await api.patch(`/courses/${id}/toggle`);
//     return res.data;
//   },
// };

// export default courseApi;

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

export const courseApi = {
  getCourses: async () => {
    const res = await api.get("/courses/");
    return res.data.data; // ✅
  },
  getCourseById: async (id: number | string) => {
    const res = await api.get(`/courses/${id}`);
    return res.data.data; // ✅
  },
  createCourse: async (data: any) => {
    const res = await api.post("/courses", data);
    return res.data.data; // ✅
  },
  updateCourse: async (id: number | string, data: any) => {
    const res = await api.put(`/courses/${id}`, data);
    return res.data.data; // ✅
  },
  deleteCourse: async (id: number | string) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data; // message only
  },
  togglePublished: async (id: number | string) => {
    const res = await api.put(`/courses/${id}/toggle-publish`);
    return res.data.data; // ✅
  },
};

export default courseApi;
