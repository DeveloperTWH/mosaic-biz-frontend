import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/", // e.g. https://api.mosaic-biz-hub.com
  withCredentials: true,
});
