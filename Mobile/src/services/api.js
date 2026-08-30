import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
  baseURL: 'http://192.168.0.106:3000',
  headers: { 'Content-Type': 'application/json' },
});

// এখানে ইন্টারসেপ্টর যুক্ত করা হচ্ছে - যেকোনো রিকোয়েস্টের আগে টোকেন বসাবে
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