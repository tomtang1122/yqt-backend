import { Metadata } from "next";
import { ContentBannerImageForm } from "@components/business/ContentBannerImageForm";
import { fetchClientConfig } from "@lib/fetchData";
import { CLIENT_CONFIG_FIELD_NAME } from "@constant/index";

// 为什么要强行将本页面作为动态：
//     因为页面的动态获取会依赖cookie中的token，如果作为静态页面，项目会在构建的时候进行网络请求，但是
//     构建的时候cookie为空，所以会报错。所以需要强行将本页面作为动态页面，让页面在构建的时候不进行网络请求

export const dynamic = "force-dynamic";

export default async function ContentManagementPage() {
  const { config } = (await fetchClientConfig()) || {};

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">网站内容管理</h1>
      <div className="mt-6 mb-8">
        <p className="mb-2 text-lg">1. 移动端广告横幅：</p>
        <ContentBannerImageForm
          configValue={config?.[CLIENT_CONFIG_FIELD_NAME.MOBILE_BANNER]}
          filedName={CLIENT_CONFIG_FIELD_NAME.MOBILE_BANNER}
        />
      </div>
      <div className="mb-8">
        <p className="mb-2 text-lg">2. PC端广告横幅：</p>
        <ContentBannerImageForm
          configValue={config?.[CLIENT_CONFIG_FIELD_NAME.PC_BANNER]}
          filedName={CLIENT_CONFIG_FIELD_NAME.PC_BANNER}
        />
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "网站内容管理",
};
