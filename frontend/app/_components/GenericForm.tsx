"use client";

import { Button } from "@shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { Label } from "@shadcn/label";
import { Input } from "@shadcn/input";
import { useFormState, useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { ApiResponse, ProblemDetail } from "utils/projectTypes";
import { useState } from "react";

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

function SubmitForm({ buttonText }: { buttonText: SubmitButtonProps }) {
  const status = useFormStatus();

  if (!status.pending) {
    return (
      <Button className="w-full" type="submit">
        {buttonText.idleText}
      </Button>
    );
  } else {
    return (
      <Button disabled className="w-full" type="button">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {buttonText.pendingText}
      </Button>
    );
  }
}

export function EmailPasswordFormFields({
  passwordAutoCompleteValue,
}: {
  passwordAutoCompleteValue?: string;
}) {
  const [isEmailValid, setIsEmailvalid] = useState(true);
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          required
          id="email"
          name="email"
          type="email"
          autoComplete="Email"
          placeholder="name@example.com"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          onChange={(e) => {
            setIsEmailvalid(e.currentTarget.reportValidity());
          }}
          id="password"
          autoComplete={passwordAutoCompleteValue}
          name="password"
          type="password"
          minLength={6}
          placeholder="Password"
          required
        />
        {!isEmailValid && (
          <p className="italic text-destructive">
            Password needs to be at least 6 characters long.
          </p>
        )}
      </div>
    </>
  );
}

export default function GenericForm<State>({
  submitAction,
  title,
  description,
  buttonText,
  formFields,
  showSignupHint,
}: {
  submitAction(
    prevState: ApiResponse<State>,
    formData: FormData,
  ): Promise<ApiResponse<State>>;
  title: string;
  description: string;
  buttonText: SubmitButtonProps;
  formFields: React.ReactNode;
  showSignupHint?: boolean;
}) {
  const [actionState, loginAction] = useFormState(submitAction, { ok: true });

  return (
    <form action={loginAction}>
      <Card className="rounded-xl bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="leading-8">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0">
          {formFields}
          {!actionState.ok && (
            <p className="leading-7 text-destructive">
              {(actionState.result as ProblemDetail | undefined)?.detail ??
                "Submission failed"}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <SubmitForm buttonText={buttonText} />
            {showSignupHint && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                <Link
                  href="/register"
                  className="hover:text-brand underline underline-offset-4"
                >
                  Don&apos;t have an account? Sign Up
                </Link>
              </p>
            )}
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
