import axios from 'axios';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'https://api-reservas-828e.onrender.com/api',
});

// Add request interceptor to include the token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth service
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
};

// Reservations service
export const reservationService = {
  getAll: async () => {
    const response = await api.get('/reservas');
    return response.data;
  },
  create: async (reservation: any) => {
    const response = await api.post('/reservas', reservation);
    return response.data;
  }
};

export default api;