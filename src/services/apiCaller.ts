import axios from "axios";
const API_URL = "https://tr-cafe.onrender.com/api";
const config = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const publicGet = async (endpoint: string) => {
  try {
    console.log(`Making GET request to: ${API_URL}${endpoint}`);
    const response = await axios.get(`${API_URL}${endpoint}`, config);
    console.log(`GET response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const publicPost = async (endpoint: string, data: any) => {
  try {
    console.log(`Making POST request to: ${API_URL}${endpoint}`, data);
    const response = await axios.post(`${API_URL}${endpoint}`, data, config);
    console.log(`POST response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Private requests (require token)
export const privateGet = async (endpoint: string, token: string) => {
  try {
    const authConfig = {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` }
    };
    console.log(`Making private GET request to: ${API_URL}${endpoint}`);
    const response = await axios.get(`${API_URL}${endpoint}`, authConfig);
    console.log(`Private GET response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Private GET request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const privatePost = async (endpoint: string, token: string, data: any) => {
  try {
    const authConfig = {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` }
    };
    console.log(`Making private POST request to: ${API_URL}${endpoint}`, data);
    const response = await axios.post(`${API_URL}${endpoint}`, data, authConfig);
    console.log(`Private POST response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Private POST request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const privatePut = async (endpoint: string, token: string, data: any) => {
  try {
    const authConfig = {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` }
    };
    console.log(`Making private PUT request to: ${API_URL}${endpoint}`, data);
    const response = await axios.put(`${API_URL}${endpoint}`, data, authConfig);
    console.log(`Private PUT response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Private PUT request failed for ${endpoint}:`, error);
    throw error;
  }
};

export const privateDelete = async (endpoint: string, token: string) => {
  try {
    const authConfig = {
      ...config,
      headers: { ...config.headers, Authorization: `Bearer ${token}` }
    };
    console.log(`Making private DELETE request to: ${API_URL}${endpoint}`);
    const response = await axios.delete(`${API_URL}${endpoint}`, authConfig);
    console.log(`Private DELETE response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Private DELETE request failed for ${endpoint}:`, error);
    throw error;
  }
};