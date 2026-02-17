import axios from "axios";

const api = axios.create({
  baseURL: "https://recommendation-backend.railway.internal"
});

export default api;
