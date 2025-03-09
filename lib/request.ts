import axios from "axios";
import { cookies } from "next/headers";

export const LOGIN_REQUEST_URL = "/account/login";
export const QUERY_ENTERPRISE_REQUEST_URL = "/enterprise/query";
export const GET_ENTERPRISE_REQUEST_URL = "/enterprise/get";
export const ADD_ENTERPRISE_REQUEST_URL = "/enterprise/add";
export const DELETE_ENTERPRISE_REQUEST_URL = "/enterprise/delete";
export const UPDATE_ENTERPRISE_REQUEST_URL = "/enterprise/update";

// 创建axios实例
export const request = axios.create({
  baseURL: "http://43.129.81.231:20009",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    operationID: Date.now().toString(),
    platform: "10",
  },
});

// 请求拦截器
request.interceptors.request.use(async (config) => {
  if (config.url === LOGIN_REQUEST_URL) {
    return config;
  }
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin-token");

    if (token) {
      config.headers["token"] = token.value;
    }
  } catch (error) {
    console.error("获取cookie失败", error);
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    // todo: 如果token过期或者验证失败，就导航到login
    return response;
  },
  () => {
    return Promise.reject(new Error("网络错误，请检查您的网络连接"));
  }
);
