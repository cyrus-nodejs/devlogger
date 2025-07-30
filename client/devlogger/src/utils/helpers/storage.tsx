// src/utils/auth.js
export const saveAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
  };
  
  export const getAccessToken = () => {
    return localStorage.getItem('access_token');
  };
  
  export const removeAccessToken = () => {
    localStorage.removeItem('access_token');
  };
  
  // src/utils/auth.js
export const saveRefreshToken = (token: string) => {
    localStorage.setItem('refresh_token', token);
  };
  
  export const getRefreshToken = () => {
    return localStorage.getItem('refresh_token');
  };
  
  export const removeRefreshToken = () => {
    localStorage.removeItem('refresh_token');
  };
  
  