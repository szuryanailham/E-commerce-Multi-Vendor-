import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Redirect ke login (hindari loop)
const handleLogout = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Tambahkan request ke queue
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Jalankan ulang semua request setelah refresh sukses
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// REQUEST interceptor (biarkan default)
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// RESPONSE interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const isAuthCheckEndpoint = originalRequest?.url?.includes(
      '/api/logged-in-user',
    );

    // Tangani 401
    if (status === 401 && !originalRequest._retry) {
      // ❌ Jangan refresh token untuk endpoint check user
      if (isAuthCheckEndpoint) {
        return Promise.reject(error);
      }

      // Jika refresh sedang berlangsung → queue request
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/refresh-token`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        onRefreshSuccess();

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
