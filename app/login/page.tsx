import { LoginForm } from "@components/business/LoginForm";
import { Metadata } from "next";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}

export const metadata: Metadata = {
  title: "登录",
};
