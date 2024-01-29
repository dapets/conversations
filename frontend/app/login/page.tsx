import GenericForm, { EmailPasswordFormFields } from "@components/GenericForm";
import { login } from "app/actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid h-[100svh] place-content-center">
      <GenericForm
        title="Log in"
        description="Enter your information below to log into your account."
        buttonText={{ idleText: "Login", pendingText: "Logging in..." }}
        showSignupHint
        submitAction={async (_, formData) => {
          "use server";
          const loginResponse = await login(formData);
          if (!loginResponse.ok) {
            return loginResponse;
          } else {
            redirect("/chats");
          }
        }}
        formFields={<EmailPasswordFormFields />}
      />
    </div>
  );
}
