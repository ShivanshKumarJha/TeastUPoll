import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use(
  config => {
    console.log(`Making API request to: ${config.baseURL}${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Status:', error.response.status);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error message:', error.message);
    }
    return Promise.reject(error);
  }
);

// API methods
export const pollAPI = {
  // Get all past polls
  getPastPolls: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.POLLS);
      return response.data;
    } catch (err) {
      console.error('Error fetching past polls:', err);
      throw new Error(
        'Failed to fetch past polls. Please make sure the server is running.'
      );
    }
  },

  // Get active poll
  getActivePoll: async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.ACTIVE_POLL);
      return response.data;
    } catch (err) {
      console.error('Error fetching active poll:', err);
      throw new Error('Failed to fetch active poll.');
    }
  },
};

export const studentAPI = {
  // Get active students
  getActiveStudents: async () => {
    try {
      const response = await apiClient.get(
        API_CONFIG.ENDPOINTS.ACTIVE_STUDENTS
      );
      return response.data;
    } catch (err) {
      console.error('Error fetching active students:', err);
      throw new Error('Failed to fetch active students.');
    }
  },
};

export default apiClient;
