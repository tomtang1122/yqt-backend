import { NextResponse } from "next/server";
import { IM_REQUEST_URL } from "@constant/index";

async function proxyImage(url: string) {
  const response = await fetch(url);
  const contentType = response.headers.get("Content-Type") || "image/png";
  const imageBuffer = await response.arrayBuffer();
  return { imageBuffer, contentType };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
  const imageUrl = `${IM_REQUEST_URL}/${path}`;

  try {
    const { imageBuffer, contentType } = await proxyImage(imageUrl);
    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("代理图片失败:", error);
    return NextResponse.json({ error: "获取图片失败" }, { status: 500 });
  }
}
