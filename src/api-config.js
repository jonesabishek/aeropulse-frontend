import axios from 'axios';

export const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

axios.defaults.baseURL = API_ORIGIN;
