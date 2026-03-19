import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProfileAnalysis = async (username: string) => {
  try {
    const response = await api.get(`/analyze/${username}`);
    return response.data;
  } catch (error: any) {
    console.error('API call error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch analysis');
  }
};

export default api;
