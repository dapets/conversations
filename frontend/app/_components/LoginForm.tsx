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

export default function LoginForm({
  login,
}: {
  login: (loginRequest: FormData) => Promise<void>;
}) {
  return (
    <form action={login}>
      <Card className="rounded-xl bg-card text-card-foreground shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="leading-8">Log in</CardTitle>
          <CardDescription className="">
            Enter your information below to log into your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0 grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="max@example.com"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="">
          <Button className="w-full" type="submit">
            Login
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
