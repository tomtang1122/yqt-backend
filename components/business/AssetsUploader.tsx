"use client";

import React, { useState, useRef, useTransition } from "react";
import Image from "next/image";
import { Button } from "@components/ui/button";
import {
  getUploadPartsize,
  getUploadUrl,
  confirmUpload,
} from "@lib/uploadAtIMAction";
import { md5 } from "js-md5";
import { mimeTypesMap } from "@constant/index";
import { getCookieValue } from "@lib/commonAction";
import { Icons } from "@components/ui/icon";

export const getMimeType = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return mimeTypesMap[extension] || "application/octet-stream";
};

const splitUpload = async (
  file: File
): Promise<{ url?: string; error?: Error }> => {
  try {
    const imUserID = await getCookieValue("im-user-id");
    const fileName = `${imUserID}/${Date.now().toString()}_${file.name}`;
    const contentType = getMimeType(file.name);
    const { size: partSize } = await getUploadPartsize(file.size);
    const chunks = Math.ceil(file.size / partSize);
    const chunkGapList: { start: number; end: number }[] = [];
    const chunkHashList: string[] = [];
    let currentChunk = 0;

    while (currentChunk < chunks) {
      const start = currentChunk * partSize;
      const end = Math.min(start + partSize, file.size);
      const chunk = file.slice(start, end);
      chunkGapList.push({ start, end });

      const chunkHash = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk);
        reader.onload = (e) => {
          if (e.target) {
            const hash = md5(new Uint8Array(e.target.result as ArrayBuffer));
            resolve(hash);
          }
        };
        reader.onerror = (err) => reject(err);
      });
      chunkHashList.push(chunkHash);
      currentChunk++;
    }

    const totalFileHash = chunkHashList.join(",");
    const fileHash = md5(totalFileHash);

    const { url: finishUrl, upload } = await getUploadUrl({
      hash: fileHash,
      size: file.size,
      partSize,
      maxParts: -1,
      cause: "",
      name: fileName,
      contentType,
    });

    if (finishUrl) {
      return {
        url: finishUrl,
      };
    }

    const uploadParts = upload.sign.parts;
    const signQuery = upload.sign.query;
    const signHeader = upload.sign.header;

    // Use Promise.all to wait for all PUT operations to complete
    await Promise.all(
      uploadParts.map(async (part, idx) => {
        const url = part.url || upload.sign.url;
        const rawUrl = new URL(url);
        if (signQuery) {
          const params = new URLSearchParams(rawUrl.search);
          signQuery.forEach((item) => {
            params.set(item.key, item.values[0]);
          });
          rawUrl.search = params.toString();
        }
        if (part.query) {
          const params = new URLSearchParams(rawUrl.search);
          part.query.forEach((item) => {
            params.set(item.key, item.values[0]);
          });
          rawUrl.search = params.toString();
        }
        const putUrl = rawUrl.toString();
        const headers = new Headers();
        if (signHeader) {
          signHeader.forEach((item) => {
            headers.set(item.key, item.values[0]);
          });
        }
        if (part.header) {
          part.header.forEach((item) => {
            headers.set(item.key, item.values[0]);
          });
        }
        headers.set(
          "Content-Length",
          (chunkGapList[idx].end - chunkGapList[idx].start).toString()
        );

        // Ensure correct content type is set for the chunk
        headers.set("Content-Type", contentType);

        const response = await fetch(putUrl, {
          method: "PUT",
          headers,
          body: file.slice(chunkGapList[idx].start, chunkGapList[idx].end),
        });

        if (!response.ok) {
          throw new Error(`Failed to upload chunk ${idx + 1}`);
        }
      })
    );

    const { url } = await confirmUpload({
      uploadID: upload.uploadID,
      parts: chunkHashList,
      cause: "",
      name: fileName,
      contentType,
    });
    return { url };
  } catch (error) {
    throw error;
  }
};

interface AssetsFile {
  file: File;
  preview: string;
  name: string;
}

interface AssetsUploaderProps {
  defaultAssetsUrl?: string;
  onUploadSuccess?: (url: string) => void;
  acceptTypes?: string;
  title?: string;
  isImage?: boolean;
}

export const AssetsUploader: React.FC<AssetsUploaderProps> = ({
  defaultAssetsUrl,
  onUploadSuccess,
  acceptTypes,
  isImage = true,
}) => {
  const [assetsUrl, setAssetsUrl] = useState<string | undefined>();
  const [assets, setAssets] = useState<AssetsFile | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setAssets(undefined);
    setAssetsUrl(undefined);
    onUploadSuccess?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newAssets: AssetsFile[] = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setAssets(newAssets[0]);
  };

  const handleUpload = () => {
    if (assets?.file) {
      startTransition(async () => {
        try {
          const { url } = await splitUpload(assets.file);
          reset();
          setAssetsUrl(url);
          if (url && onUploadSuccess) {
            onUploadSuccess(url);
          }
        } catch (error) {
          throw error;
        }
      });
    }
  };

  return (
    <div className="upload-container">
      <label htmlFor="fileInput" className="hidden" />
      <input
        id="fileInput"
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={acceptTypes}
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={!!assets || !!fileInputRef.current?.value}
          type="button"
        >
          <Icons.Upload className="w-4 h-4 mr-2" />
          选择资源
        </Button>
        <Button
          variant="outline"
          onClick={handleUpload}
          disabled={!assets}
          type="button"
        >
          上传
        </Button>
      </div>
      <div className="mt-2">
        {isPending && (
          <div className="flex items-center gap-2 border rounded-md p-2 justify-center">
            <Icons.Loader className="w-10 h-10 animate-spin" />
          </div>
        )}
        {assets && !isPending && (
          <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
            <div className="flex items-center gap-2">
              {isImage ? (
                <>
                  <span>预览：</span>
                  <Image
                    src={assets.preview}
                    alt="上传预览"
                    width={60}
                    height={60}
                  />
                </>
              ) : (
                <p>
                  文件名称：<span className="font-bold">{assets.name}</span>
                </p>
              )}
            </div>
            <Button onClick={reset} variant="outline" size="icon" type="button">
              <Icons.Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
        {(assetsUrl || defaultAssetsUrl) && !isPending && (
          <div className="flex items-center justify-between gap-2 border rounded-md p-2">
            <p className="text-sm text-gray-800 font-bold">
              资源路径：{assetsUrl || defaultAssetsUrl}
            </p>
            <Button onClick={reset} variant="outline" size="icon" type="button">
              <Icons.Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
