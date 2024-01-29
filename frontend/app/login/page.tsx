import GenericForm, { EmailPasswordFormFields } from "@components/GenericForm";
import { login } from "app/actions";
import { Metadata } from "next";
import { redirectWithLoginChanged } from "utils/utils";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="grid place-content-center">
      <GenericForm
        title="Log in"
        description="Enter your information below to log into your account."
        buttonText={{ idleText: "Login", pendingText: "Logging in..." }}
        mutedRedirect={{
          text: "Don't have an account? Sign Up",
          url: "/register",
        }}
        submitAction={async (_, formData) => {
          "use server";
          const response = await login(formData);
          if (response.ok) {
            redirectWithLoginChanged("/chats");
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
