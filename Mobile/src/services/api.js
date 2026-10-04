import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'https://fixmate-a-home-services-platform.onrender.com', // Render-er live URL
  headers: { 'Content-Type': 'application/json' },
  timeout: 40000, // Render-er cold start (40 second) handle korar jonno
});

// ekhane interceptor jukto kora hocche - je kono request er age token bosabe
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token');
    console.log('Token fetched from storage:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;