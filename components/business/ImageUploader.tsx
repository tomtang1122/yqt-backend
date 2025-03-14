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
    const fileName = `${imUserID}/${file.name}`;
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

interface ImageFile {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  defaultImageUrl?: string;
  onUploadSuccess?: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  defaultImageUrl,
  onUploadSuccess,
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [images, setImages] = useState<ImageFile | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setImages(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const newImages: ImageFile[] = files.map((file) => ({
      file: file,
      preview: URL.createObjectURL(file),
    }));

    setImages(newImages[0]);
  };

  const handleUpload = () => {
    if (images?.file) {
      startTransition(async () => {
        try {
          const { url } = await splitUpload(images.file);
          reset();
          setImageUrl(url);
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
        accept="image/*"
        onChange={handleFileChange}
      />
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={handleClick}
          disabled={!!images || !!fileInputRef.current?.value}
          type="button"
        >
          <Icons.Upload className="w-4 h-4 mr-2" />
          选择图片
        </Button>
        <Button
          variant="outline"
          onClick={handleUpload}
          disabled={!images}
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
        {images && !isPending && (
          <div className="flex items-center gap-2 border rounded-md p-2 justify-between">
            <Image src={images.preview} alt="上传预览" width={60} height={60} />
            <Button onClick={reset} variant="outline" size="icon" type="button">
              <Icons.Trash className="w-4 h-4" />
            </Button>
          </div>
        )}
        {(imageUrl || defaultImageUrl) && !isPending && (
          <div className="flex items-center gap-2 border rounded-md p-2">
            <p className="text-sm text-gray-800 font-bold">
              {imageUrl || defaultImageUrl}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
