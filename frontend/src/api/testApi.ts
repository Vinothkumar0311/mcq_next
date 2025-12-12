import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // change if deployed

// ✅ Get all tests for a specific module
export const getTestsByModule = async (moduleId: number) => {
  const res = await axios.get(`${API_BASE_URL}/tests/module/${moduleId}`);
  return res.data.data;
};

// ✅ Get test details by ID
export const getTestById = async (testId: number) => {
  const res = await axios.get(`${API_BASE_URL}/tests/${testId}/`);
  return res.data.data;
};

// ✅ Create new test
export const createTest = async (moduleId: number, testData: any) => {
  console.log("API - Creating test with data:", { moduleId, ...testData });
  const res = await axios.post(`${API_BASE_URL}/tests/modules/${moduleId}/tests`, testData);
  return res.data.data;
};

// ✅ Update test
export const updateTest = async (testId: number, testData: any) => {
  const res = await axios.put(`${API_BASE_URL}/tests/${testId}`, testData);
  return res.data.data;
};

// ✅ Delete test
export const deleteTest = async (testId: number) => {
  const res = await axios.delete(`${API_BASE_URL}/tests/${testId}`);
  return res.data;
};

// ✅ Toggle publish status
export const toggleTestStatus = async (testId: number) => {
  const res = await axios.patch(`${API_BASE_URL}/tests/${testId}/toggle-status`);
  return res.data.data;
};
