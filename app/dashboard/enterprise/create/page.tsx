import { EnterpriseForm } from "@components/business/EnterpriseForm";
import { createEnterpriseAction } from "@lib/action";
import { Metadata } from "next";

export default function EnterpriseCreatePage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">创建企业</h1>
      <EnterpriseForm action={createEnterpriseAction} />
    </div>
  );
}

export const metadata: Metadata = {
  title: "创建企业",
};
