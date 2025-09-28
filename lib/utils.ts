import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IM_REQUEST_URL } from "@constant/index";
import { Enterprise } from "@type/index";
import { utils, writeFile } from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 构建查询参数字符串
 * @param params 查询参数对象
 * @returns 查询参数字符串
 */
export function buildQueryString(params: {
  query?: string;
  status?: number;
  page?: number;
}): string {
  const urlParams = new URLSearchParams();
  
  if (params.query) {
    urlParams.set("query", params.query);
  }
  
  if (params.status !== undefined) {
    urlParams.set("status", params.status.toString());
  }
  
  if (params.page && params.page > 1) {
    urlParams.set("page", params.page.toString());
  }
  
  return urlParams.toString();
}

/**
 * 将原始图片URL转换为代理URL
 * 例如: ${host}/object/imAdmin/logo.png -> /api/proxy-image/object/imAdmin/logo.png
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

/**
 * 导出企业列表到Excel
 * @param enterprises 企业列表
 */
export const exportToExcel = (enterprises: Enterprise[]) => {
  const data = enterprises.map((enterprise, index) => ({
    序号: index + 1,
    企业名称: enterprise.name,
    企业网址: enterprise.website,
    企业地址: enterprise.address,
    企业邮箱: enterprise.email,
    企业电话: enterprise.phoneNumber,
    企业标签: enterprise.tags?.join(",  "),
    企业发票: enterprise.invoice,
    企业备注: enterprise.remark,
  }));

  const wb = utils.book_new();
  const ws = utils.json_to_sheet(data);

  const colWidths = [
    { wch: 4 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 30 },
    { wch: 15 },
    { wch: 30 },
    { wch: 100 },
    { wch: 100 },
  ];
  ws["!cols"] = colWidths;

  utils.book_append_sheet(wb, ws, "企业列表");
  writeFile(wb, "企业列表.xlsx");
};
