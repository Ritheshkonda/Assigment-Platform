import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // use your actual IP here
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;