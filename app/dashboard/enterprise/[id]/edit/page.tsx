import { EnterpriseForm } from "@components/business/EnterpriseForm";
import { fetchEnterpriseById } from "@lib/fetchData";
import { updateEnterpriseAction } from "@lib/action";
import { Metadata } from "next";
export default async function EnterpriseEditPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const id = params.id;
  const enterprise = await fetchEnterpriseById(id);

  if (!enterprise) {
    return <div>企业不存在</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">更新企业信息</h1>
      <EnterpriseForm
        action={updateEnterpriseAction.bind(null, id)}
        defaultValues={enterprise}
        isEdit
      />
    </div>
  );
}

export const metadata: Metadata = {
  title: "更新企业信息",
};
