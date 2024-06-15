import axios from 'axios';

const axiosClient = axios.create({
  // baseURL: `${import.meta.env.VITE_APP_URL}/`,
  baseURL:"https://www.api.hiragfashion.com/"
});

export default axiosClient;