import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3334/',
});

export default axiosClient;