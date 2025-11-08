import axios from 'axios';

// baseURL can be changed later when backend is ready
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // change this to your backend later
  headers: {
    'Content-Type': 'application/json',
  },
});

// You can add interceptors later for auth tokens
export default api;
