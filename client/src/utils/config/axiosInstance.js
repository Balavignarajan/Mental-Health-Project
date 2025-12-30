import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../auth';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// REQUEST INTERCEPTOR - Runs before every API call
axiosInstance.interceptors.request.use(
  (config) => {
    // Get access token from localStorage
    const token = getAccessToken();
    
    // If token exists, add it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // Log if no token is found (for debugging)
      console.warn('No access token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE INTERCEPTOR - Runs after every API response
axiosInstance.interceptors.response.use(
  (response) => {
    // If request succeeds, just return the response
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Skip refresh for auth endpoints (login, signup, refresh itself)
      if (originalRequest.url?.includes('/auth/refresh') || 
          originalRequest.url?.includes('/auth/login') ||
          originalRequest.url?.includes('/auth/signup') ||
          originalRequest.url?.includes('/admin/login')) {
        return Promise.reject(error);
      }
      
      console.log('401 error detected, attempting token refresh for:', originalRequest.url);
      
      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          // No refresh token, redirect to login
          clearTokens();
          // Check if this is an admin route and redirect accordingly
          const isAdminRoute = originalRequest.url?.includes('/admin/');
          window.location.href = isAdminRoute ? '/admin-login' : '/login';
          return Promise.reject(error);
        }
        
        // Call refresh endpoint to get new tokens
        console.log('Attempting to refresh token...');
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/auth/refresh`,
          { refreshToken }
        );
        
        // Backend returns: { success: true, message: "Refreshed", data: { accessToken, refreshToken } }
        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          
          // Store new tokens
          setTokens(accessToken, newRefreshToken);
          console.log('Token refreshed successfully');
          
          // Update the failed request with new token and retry
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error('Token refresh failed: Invalid response');
        }
        
      } catch (refreshError) {
        // Refresh failed, logout user
        console.error('Token refresh failed:', refreshError.response?.data || refreshError.message);
        clearTokens();
        // Check if this is an admin route and redirect accordingly
        const isAdminRoute = originalRequest.url?.includes('/admin/');
        if (isAdminRoute) {
          console.log('Redirecting to admin login due to auth failure');
        }
        window.location.href = isAdminRoute ? '/admin-login' : '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;