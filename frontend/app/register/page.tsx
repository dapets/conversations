import GenericForm, { EmailPasswordFormFields } from "@components/GenericForm";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { register } from "app/actions";
import { Metadata } from "next";
import { redirectWithLoginChanged } from "utils/utils";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up a new account",
};

export default function RegisterPage() {
  return (
    <div className="grid place-content-center">
      <GenericForm
        title="Sign up"
        description="Enter your information below to sign up using a new account."
        buttonText={{ idleText: "Sign up", pendingText: "Signing up..." }}
        mutedRedirect={{
          text: "Already have an account? Login instead",
          url: "/login",
        }}
        submitAction={async (_, formData) => {
          "use server";
          const response = await register(formData);
          if (response.ok) {
            redirectWithLoginChanged("/chats");
          }

          return response;
        }}
        formFields={
          <>
            <div className="flex gap-2">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First name</Label>
                <Input
                  required
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="given-name"
                  placeholder="First name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input
                  required
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last name"
                />
              </div>
            </div>
            <EmailPasswordFormFields passwordAutoCompleteValue="off" />
          </>
        }
      />
    </div>
  );
}
