// src/api/codingSessionAPI.js
import axios from 'axios';
// const BASEURL = import.meta.env.VITE_BASE_URL
// const API = axios.create({
//   baseURL: BASEURL,
//   withCredentials: true, // if using cookie/session auth
// });

export const getSessions = () => axios.get(`/api/sessions/`);
// eslint-disable-next-line @typescript-eslint/no-explicit-any 
export const createSession = (data: any) => axios.post('/api/sessions/', data);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateSession = (id: any, data: any) => axios.put(`/api/sessions/${id}/`, data);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteSession = (id: any) => axios.delete(`/api/sessions/${id}/`);

export const logOut = () => axios.delete(`/api/logout`);