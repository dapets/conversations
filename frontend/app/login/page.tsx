import EnterEmailPasswordForm from "@components/EnterEmailPasswordForm";
import { login } from "app/actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid h-[100svh] place-content-center">
      <EnterEmailPasswordForm
        title="Log in"
        description="Enter your information below to log into your account."
        buttonText={{ idleText: "Login", pendingText: "Logging in..." }}
        showSignupHint
        submitAction={login}
      />
    </div>
  );
}
