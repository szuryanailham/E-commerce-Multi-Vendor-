import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Handle logout and prevent infinite loops
const handleLogout = () => {
  if (window.location.pathname !== '/login') {
    // Clear any stored auth data
    localStorage.removeItem('isAuthenticated');
    sessionStorage.clear();

    window.location.href = '/login';
  }
};

// Check if user is authenticated
export const checkAuth = async (): Promise<boolean> => {
  try {
    const response = await axiosInstance.get('/api/auth/check');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

// Redirect to login if not authenticated (for dashboard pages)
export const requireAuth = async () => {
  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    handleLogout();
    return false;
  }

  return true;
};

// Handle adding a new access token to queued request
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Execute queue requests after refresh
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
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

    // Prevents infinity retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
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
      } catch (error) {
        isRefreshing = false;
        refreshSubscribers = [];
        handleLogout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
