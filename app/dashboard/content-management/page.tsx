import { Metadata } from "next";
import { ContentManageForm } from "@components/business/ContentManageForm";
import { fetchClientConfig } from "@lib/fetchData";

export default async function ContentManagementPage() {
  const clientConfig = await fetchClientConfig();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">网站内容管理</h1>
      {clientConfig && <ContentManageForm clientConfig={clientConfig.config} />}
    </div>
  );
}

export const metadata: Metadata = {
  title: "网站内容管理",
};
