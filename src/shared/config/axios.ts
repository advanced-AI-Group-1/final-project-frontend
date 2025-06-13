import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버 주소
  withCredentials: true, // 쿠키 인증이 필요할 경우 true
});

export default api;