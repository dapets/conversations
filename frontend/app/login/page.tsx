import GenericForm, { EmailPasswordFormFields } from "@components/GenericForm";
import { login } from "app/actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { hasLoginChangedQueryParam } from "utils/constants";

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
          const response = await login(formData);
          if (response.ok) {
            redirect("/chats?" + `${hasLoginChangedQueryParam}=true`);
          }

          return response;
        }}
        formFields={
          <EmailPasswordFormFields passwordAutoCompleteValue="current-password" />
        }
      />
    </div>
  );
}
