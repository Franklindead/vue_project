import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { ElLoading, ElMessage } from "element-plus";
//创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 5000,
});
//请求拦截器
service.interceptors.request.use(
  //请求成功
  (config: AxiosRequestConfig) => {
    return config;
  },
  //请求失败
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);
//响应拦截器
service.interceptors.response.use(
  //请求成功
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    } else {
      //请求失败
      return Promise.reject();
    }
  },
  //请求失败
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

/**
 * 上传
 * @param url
 * @param file
 * @param data
 */
export function upload(url: string, file: any, data: any = {}) {
  const formData = new FormData();
  formData.append("file", file);

  // 附加数据
  if (data) {
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
  }

  return new Promise((resolve, reject) => {
    const loading = ElLoading.service({
      text: "正在上传...",
      background: "rgba(0, 0, 0, 0.7)",
    });

    service
      .request({
        url: url,
        method: "post",
        data: formData,
        timeout: 1200000,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(
        (response) => {
          loading.close();
          resolve(response);
        },
        (err) => {
          loading.close();
          reject(err);
        }
      );
  });
}

/**
 * 下载
 * @param url
 * @param data
 * @param fileName
 */
// export function download(url: string, data: any = {}, fileName: string = "") {
//   return new Promise((resolve, reject) => {
//     const loading = ElLoading.service({
//       text: "正在下载...",
//       background: "rgba(0, 0, 0, 0.7)",
//     });

//     service
//       .request({
//         url: url,
//         method: "post",
//         data: data,
//         timeout: 1200000,
//         responseType: "blob",
//       })
//       .then(
//         (response) => {
//           loading.close();
//           // 下载文件
//           const blob = new Blob([response.data], {
//             type: "application/vnd.ms-excel",
//           });
//           //获得文件名
//           const link = document.createElement("a");
//           link.href = window.URL.createObjectURL(blob);
//           link.download = fileName;
//           link.click();
//           // 释放URL 对象
//           window.URL.revokeObjectURL(link.href);
//           ElMessage.success("下载成功");
//           resolve(response);
//         },
//         (err) => {
//           loading.close();
//           reject(err);
//         }
//       );
//   });
// }

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export const post = (
  url: string,
  data: any = {},
  headers?: { [key: string]: string }
) => {
  return new Promise((resolve, reject) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...headers, // 将传入的headers与默认headers合并
      },
    };
    service
      .post(url, data, config)
      .then(
        (response) => {
          resolve(response);
        },
        (err) => {
          reject(err);
        }
      )
      .catch((error) => {
        reject(error);
      });
  });
};

export default service;
