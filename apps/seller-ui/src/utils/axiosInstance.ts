import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubsribers: (() => void)[] = [];

// Handle logout and prevent infinite loops
const handleLogout = () => {
  if (window.location.pathname != '/login') {
    window.location.href = '/login';
  }
};

// Handle adding a new access token to queued request
const subcribeTokenRefresh = (callback: () => void) => {
  refreshSubsribers.push(callback);
};

// Execute queue requests after refresh
const onRefreshSuccess = () => {
  refreshSubsribers.forEach((callback) => callback());
  refreshSubsribers = [];
};

// Handle API request
axiosInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

// Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevents infinity retery loops
    if (error.response?.status == 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subcribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER}/auth/api/refresh-token`,
          {},
          { withCredentials: true },
        );

        isRefreshing = false;
        onRefreshSuccess();

        return axiosInstance(originalRequest);
      } catch (error) {
        isRefreshing = false;
        refreshSubsribers = [];
        handleLogout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
