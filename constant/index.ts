import { Icons } from "@components/ui/icon";

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
};
