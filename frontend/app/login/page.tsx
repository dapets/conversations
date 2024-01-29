import LoginForm from "@components/LoginForm";
import { login } from "app/actions";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid place-content-center h-[100svh]">
      <LoginForm
        login={async (formData) => {
          const loginSuccess = await login(formData);
          if (loginSuccess) {
            redirect("/chats");
          }
        }}
      />
    </div>
  );
}
