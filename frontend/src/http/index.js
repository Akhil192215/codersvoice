import axios from "axios";

const api = axios.create({
  baseURL:" process.env.REACT_APP_API_URL",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
    Accept: "application/json",
  },
});

export const sendOtp = (data) => api.post("/api/send-otp", data);
export const verifyOtp = (data) => api.post("/api/verify-otp", data);
export const activate = (data) => api.post("/api/activate-user", data);
export const logout = () => api.post("/api/logout");
export const createRoom = (data) => api.post("/api/rooms", data);
export const getAllrooms = () => api.get("/api/rooms");

//Interceptors

api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      originalRequest &&
      !originalRequest.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        // eslint-disable-next-line no-unused-vars
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/refresh`,
          {
            withCredentials: true,
          }
        );

        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);

export default api;