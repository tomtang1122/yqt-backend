import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IM_REQUEST_URL } from "@constant/index";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 将原始图片URL转换为代理URL
 * 例如: http://43.129.81.231:10002/object/imAdmin/logo.png -> /api/proxy-image/object/imAdmin/logo.png
 * @param url 原始图片URL
 * @returns 代理后的图片URL
 */
export function getProxyImageUrl(url: string): string {
  if (!url || typeof url !== "string") {
    return url;
  }

  if (url.startsWith(IM_REQUEST_URL)) {
    const path = url.substring(IM_REQUEST_URL.length);
    const cleanPath = path.startsWith("/") ? path.substring(1) : path;
    return `/api/proxy-image/${cleanPath}`;
  }

  // 如果不是IM服务器的URL，则返回原始URL
  return url;
}
