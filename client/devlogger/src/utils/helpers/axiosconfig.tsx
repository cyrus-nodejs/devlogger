// api/axiosConfig.js
import axios from 'axios';
import { getAccessToken, getRefreshToken , saveAccessToken, removeAccessToken } from './storage';
import { getCsrfToken } from './csrftokenconfig'


const BASEURL = import.meta.env.VITE_APP_BASE_URL

//Set CSRF token in the default headers
const csrfToken = getCsrfToken();
if (csrfToken) {
  axios.defaults.headers.common['X-CSRFToken'] = csrfToken;
}
//Configure Axios to include credentials (cookies)

axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL
axios.defaults.withCredentials = true;  // This will send cookies in cross-origin requests

// Intercept requests to attach the token from Redux state
axios.interceptors.request.use(
  (config) => {
    // Get the token from Redux state
    const token = getAccessToken();

    // If the token exists, attach it to the Authorization header
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Cleanup bad token
      localStorage.removeItem('access_token');
      // Optionally notify user or redirect to login
      console.warn('Unauthorized: Token/session expired or invalid');
    }
    return Promise.reject(error);
  }
);



// Response Interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${BASEURL}/api/token/refresh/`, {
          refresh: getRefreshToken(),
        });

        const newAccessToken = response.data.access;
        
        saveAccessToken(newAccessToken)  // update storage
        axios.defaults.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return axios(originalRequest); // retry original request
      } catch (refreshError) {
       
        removeAccessToken()
        console.error('Token refresh failed:', refreshError);
        // Optional: redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);





export default axios;
