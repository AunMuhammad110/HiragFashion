import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_URL}/`,
  baseURL:"http://localhost:3334/"
});

export default axiosClient;