"use client";

import { Button } from "@/components/ui/button";
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

export default function LoginForm() {
  return (
    <Card className="rounded-xl bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col space-y-1.5 p-6">
        <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="">
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="max@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Login</Button>
      </CardFooter>
    </Card>
  );
}
