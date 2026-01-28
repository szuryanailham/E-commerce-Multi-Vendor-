import axios, { AxiosError } from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let refreshSubscribers: (() => void)[] = [];

// Handle logout and prevent infinite loops
const handleLogout = () => {
  if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  }
};

// Subscribe to token refresh
const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

// Execute queued requests after refresh
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((callback) => callback());
  refreshSubscribers = [];
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Optional: log requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle expired tokens and refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const originalRequest: any = error.config;

    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.log('❌ Response Error:', {
        status: error.response?.status,
        url: originalRequest?.url,
        error: error.response?.data?.error,
      });
    }
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (error.response?.data?.error === 'TOKEN_EXPIRED' ||
        error.response?.data?.message?.toLowerCase().includes('expired'))
    ) {
      console.log('🔄 Access token expired, attempting refresh...');

      if (isRefreshing) {
        console.log('⏳ Refresh in progress, queuing request...');
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            console.log('✅ Retrying queued request');
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('🔑 Calling refresh token endpoint...');
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/refresh-token`,
          {},
          { withCredentials: true },
        );

        console.log('✅ Token refreshed successfully');

        isRefreshing = false;
        onRefreshSuccess();
        return axiosInstance(originalRequest);
      } catch (refreshError: any) {
        console.error('❌ Token refresh failed:', refreshError.response?.data);

        isRefreshing = false;
        refreshSubscribers = [];

        if (refreshError.response?.status === 401) {
          console.log('🚪 Refresh token invalid, logging out...');
          handleLogout();
        }

        return Promise.reject(refreshError);
      }
    }

    if (
      error.response?.status === 401 &&
      originalRequest._retry &&
      error.response?.data?.error !== 'TOKEN_EXPIRED'
    ) {
      console.log(
        '❌ Authentication failed (not token expiry), redirecting to login...',
      );
      handleLogout();
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
