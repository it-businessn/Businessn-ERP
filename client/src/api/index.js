import axios from "axios";

const BASE_URL_LOCAL = "http://localhost:5000/api";
const BASE_URL_LIVE = "https://crm-backend-874t.onrender.com/api";

export const API = axios.create({
  baseURL: BASE_URL_LIVE,
});
