import LoginForm from "@components/LoginForm";
import { login } from "app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid place-content-center h-[100svh]">
      <LoginForm login={login} />
    </div>
  );
}
