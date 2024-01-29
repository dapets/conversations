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
import { useState } from "react";
import Link from "next/link";

function SubmitLogin() {
  const status = useFormStatus();

  if (!status.pending) {
    return (
      <Button className="w-full" type="submit">
        Login
      </Button>
    );
  } else {
    return (
      <Button disabled className="w-full" type="button">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Logging in...
      </Button>
    );
  }
}

type LoginFormResult = {
  success: boolean;
  message?: string;
};

export default function LoginForm({
  login,
}: {
  login: (
    result: LoginFormResult,
    loginRequest: FormData,
  ) => Promise<LoginFormResult>;
}) {
  const [loginState, loginAction] = useFormState(login, { success: true });

  return (
    <form action={loginAction}>
      <Card className="rounded-xl bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="leading-8">Log in</CardTitle>
          <CardDescription>
            Enter your information below to log into your account.
          </CardDescription>
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
          {!loginState.success && (
            <p className="leading-7 text-destructive">
              {loginState.message ?? "Login failed"}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <div className="w-full">
            <SubmitLogin />
            <p className="mt-4 text-center text-sm text-muted-foreground">
              <Link
                href="/register"
                className="hover:text-brand underline underline-offset-4"
              >
                Don&apos;t have an account? Sign Up
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
