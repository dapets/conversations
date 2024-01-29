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
import { ApiResponse } from "utils/dbEntities";

type SubmitButtonProps = {
  idleText: string;
  pendingText: string;
};

function SubmitLogin({ buttonText }: { buttonText: SubmitButtonProps }) {
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

export default function EnterEmailPasswordForm<State>({
  submitAction,
  title,
  description,
  buttonText,
  showSignupHint,
}: {
  submitAction(
    prevState: ApiResponse<State>,
    formData: FormData,
  ): Promise<ApiResponse<State>>;
  title: string;
  description: string;
  buttonText: SubmitButtonProps;
  showSignupHint?: boolean;
}) {
  const [loginState, loginAction] = useFormState(submitAction, { ok: true });

  return (
    <form action={loginAction}>
      <Card className="rounded-xl bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="leading-8">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 pt-0">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              required
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              autoComplete="password"
              name="password"
              type="password"
              required
            />
          </div>
          {!loginState.ok && (
            <p className="leading-7 text-destructive">
              {loginState.message ?? "Login failed"}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <SubmitLogin buttonText={buttonText} />
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
