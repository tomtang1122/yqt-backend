import { Icons } from "@components/ui/icon";
import { ClientConfig } from "@type/common";

export const items = [
  {
    title: "信息面板",
    url: "/dashboard",
    icon: Icons.LayoutDashboard,
  },
  {
    title: "企业列表",
    url: "/dashboard/enterprise",
    icon: Icons.Monitor,
  },
  {
    title: "网站内容管理",
    url: "/dashboard/content-management",
    icon: Icons.BookA,
  },
];

export const RECAPTCHA_ERROR = "recaptcha_error";

export const GLOBAL_REQUEST_URL = "https://yunquetai.com/complete_admin";
export const IM_REQUEST_URL = "https://yunquetai.com/api";

export const CLIENT_CONFIG_FIELD_NAME: Record<string, keyof ClientConfig> = {
  MOBILE_BANNER: "mobileBanner",
  PC_BANNER: "pcBanner",
  APP_VERSION: "appVersion",
  APP_FILE: "appFile",
  MOBILE_BANK_QR_CODE: "mobileBankQRCode",
  PC_BANK_QR_CODE: "pcBankQRCode",
};
export const CLIENT_CONFIG_PLACEHOLDER: Record<keyof ClientConfig, string> = {
  mobileBanner: "移动端广告横幅",
  pcBanner: "桌面端广告横幅",
  appVersion: "APP版本号,示例:1.0.0",
  appFile: "",
  mobileBankQRCode: "移动端银行二维码",
  pcBankQRCode: "桌面端银行二维码",
};

export const TAG_TYPES = ["标签1", "标签2", "标签3", "标签4", "标签5"];

export const mimeTypesMap: Record<string, string> = {
  txt: "text/plain",
  html: "text/html",
  css: "text/css",
  js: "text/javascript",
  json: "application/json",
  csv: "text/csv",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  bmp: "image/bmp",
  svg: "image/svg+xml",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  wav: "audio/wav",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xml: "application/xml",
  zip: "application/zip",
  tar: "application/x-tar",
  "7z": "application/x-7z-compressed",
  rar: "application/vnd.rar",
  ogg: "audio/ogg",
  midi: "audio/midi",
  webm: "audio/webm",
  avi: "video/x-msvideo",
  mpeg: "video/mpeg",
  ts: "video/mp2t",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  mkv: "video/x-matroska",
  webp: "image/webp",
  heic: "image/heic",
  psd: "image/vnd.adobe.photoshop",
  ai: "application/postscript",
  eps: "application/postscript",
  ttf: "font/ttf",
  otf: "font/otf",
  woff: "font/woff",
  woff2: "font/woff2",
  jsonld: "application/ld+json",
  ics: "text/calendar",
  sh: "application/x-sh",
  php: "application/x-httpd-php",
  jar: "application/java-archive",
  apk: "application/vnd.android.package-archive",
};
