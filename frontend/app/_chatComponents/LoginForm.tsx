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
      <CardHeader className="space-y-1">
        <CardTitle className="leading-8">Log in</CardTitle>
        <CardDescription className="">
          Enter your email below to log into your account
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="">
        <Button className="w-full">Login</Button>
      </CardFooter>
    </Card>
  );
}
