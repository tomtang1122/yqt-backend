"use server";

import { requestIM } from "./request";

interface UploadParams {
  hash: string;
  size: number;
  partSize: number;
  maxParts: number;
  cause: string;
  name: string;
  contentType: string;
}

interface ConfirmData {
  uploadID: string;
  parts: string[];
  cause: string;
  name: string;
  contentType: string;
}

interface UploadData {
  url?: string;
  upload: {
    uploadID: string;
    sign: {
      url: string;
      parts: {
        url: string;
        query?: { key: string; values: string[] }[];
        header?: { key: string; values: string[] }[];
      }[];
      query?: { key: string; values: string[] }[];
      header?: { key: string; values: string[] }[];
    };
  };
}

// api ================================
export const getUploadPartsize = async (size: number) => {
  try {
    const { data } = await requestIM.post<{ data: { size: number } }>(
      "/object/part_size",
      { size }
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};
export const getUploadUrl = async (params: UploadParams) => {
  try {
    const { data } = await requestIM.post<{ data: UploadData }>(
      "/object/initiate_multipart_upload",
      params
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};
export const confirmUpload = async (params: ConfirmData) => {
  try {
    const { data } = await requestIM.post<{ data: { url: string } }>(
      "/object/complete_multipart_upload",
      params
    );
    return data.data;
  } catch (error) {
    throw error;
  }
};
// api ================================
