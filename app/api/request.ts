import axios from "axios";

export const request = axios.create({
  baseURL: "https://web.rentsoft.cn/chat",
  timeout: 10000,
});
