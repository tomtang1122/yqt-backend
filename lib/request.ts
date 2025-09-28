import axios from "axios";
import { RECAPTCHA_ERROR } from "@constant/index";
import { getCookieValue } from "@lib/commonAction";
import { GLOBAL_REQUEST_URL, IM_REQUEST_URL } from "@constant/index";

export const LOGIN_REQUEST_URL = "/account/login";
export const QUERY_ENTERPRISE_REQUEST_URL = "/enterprise/query";
export const GET_ENTERPRISE_REQUEST_URL = "/enterprise/get";
export const ADD_ENTERPRISE_REQUEST_URL = "/enterprise/add";
export const DELETE_ENTERPRISE_REQUEST_URL = "/enterprise/delete";
export const UPDATE_ENTERPRISE_REQUEST_URL = "/enterprise/update";
export const GET_CLIENT_CONFIG_URL = "/client_config/get";
export const SET_CLIENT_CONFIG_URL = "/client_config/set";
export const QUERY_PROCUREMENT_REQUEST_URL = "/procurement/query";
export const DELETE_PROCUREMENT_REQUEST_URL = "/procurement/delete";
export const QUERY_REBATE_REQUEST_URL = "/rebate/query";
export const DELETE_REBATE_REQUEST_URL = "/rebate/delete";
export const GET_PROCUREMENT_REQUEST_URL = "/procurement/get";
export const GET_REBATE_REQUEST_URL = "/rebate/get";
export const UPDATE_PROCUREMENT_REQUEST_URL = "/procurement/update";
export const UPDATE_REBATE_REQUEST_URL = "/rebate/update";

// 创建通用请求实例
export const request = axios.create({
  baseURL: GLOBAL_REQUEST_URL,
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
    const token = await getCookieValue("admin-token");

    if (token) {
      config.headers["token"] = token;
    }
  } catch {
    return Promise.reject(new Error("获取cookie失败"));
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data?.errCode || data?.errMsg) {
      return Promise.reject(new Error(RECAPTCHA_ERROR));
    }
    return response;
  },
  (error) => {
    const message = "网络错误，请检查您的网络连接";
    return Promise.reject(
      new Error(`${error?.response?.status ?? "500"}: ${message}`)
    );
  }
);

// 创建IM请求实例
export const requestIM = axios.create({
  baseURL: IM_REQUEST_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    operationID: Date.now().toString(),
    platform: "10",
  },
});
requestIM.interceptors.request.use(async (config) => {
  if (config.url === LOGIN_REQUEST_URL) {
    return config;
  }
  try {
    const token = await getCookieValue("im-token");

    if (token) {
      config.headers["token"] = token;
    }
  } catch {
    return Promise.reject(new Error("获取cookie失败"));
  }
  return config;
});
requestIM.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data?.errCode || data?.errMsg) {
      return Promise.reject(new Error(RECAPTCHA_ERROR));
    }
    return response;
  },
  (error) => {
    const message = "网络错误，请检查您的网络连接";
    return Promise.reject(
      new Error(`${error?.response?.status ?? "500"}: ${message}`)
    );
  }
);
