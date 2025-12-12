//src/api/moduleApi.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

// Fetch all modules by course
export const getModulesByCourse = async (courseId: number) => {
  const res = await axios.get(`${API_BASE_URL}/modules/course/${courseId}`);
  console.log("the res is ",res)
  return res.data.data;
};

// Get single module by ID
export const getModuleById = async (id: number) => {
  console.log("the id is ",id)
  const res = await axios.get(`${API_BASE_URL}/modules/${id}`);
  return res.data.data;
};

// Create new module
export const createModule = async (courseId: number, moduleData: any) => {
  const res = await axios.post(`${API_BASE_URL}/modules/course/${courseId}`, moduleData);
  return res.data.data;
};

// Create module with file uploads
export const createModuleWithFiles = async (courseId: number, formData: FormData) => {
  const res = await axios.post(`${API_BASE_URL}/modules/course/${courseId}/with-files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data.data;
};

// Update module
export const updateModule = async (id: number, moduleData: any) => {
  const res = await axios.put(`${API_BASE_URL}/modules/${id}`, moduleData);
  return res.data.data;
};

// Delete module
export const deleteModule = async (id: number) => {
  const res = await axios.delete(`${API_BASE_URL}/modules/${id}`);
  return res.data;
};

// Toggle publish status
export const toggleModulePublish = async (id: number) => {
  const res = await axios.patch(`${API_BASE_URL}/modules/${id}/toggle-publish`);
  return res.data.data;
};

// Download topic document
export const downloadTopicDocument = async (moduleId: number, filename: string) => {
  const res = await axios.get(`${API_BASE_URL}/uploads/modules/${moduleId}/topics/${filename}`, {
    responseType: 'blob'
  });
  return res.data;
};
