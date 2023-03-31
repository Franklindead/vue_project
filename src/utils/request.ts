import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";

const service: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

export default service;
