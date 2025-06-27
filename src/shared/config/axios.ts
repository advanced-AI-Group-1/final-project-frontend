// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8080", // 백엔드 서버 주소
//   withCredentials: true, // 쿠키 인증이 필요할 경우 true
// });

// export default api;


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
});

// ✅ 요청 보낼 때마다 JWT 자동으로 붙이기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
