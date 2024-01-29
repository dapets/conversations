"use client";

import { Button } from "@shadcn/button";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import { Dialog, DialogContent } from "@shadcn/dialog";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { addChatWithUser } from "app/actions";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { addChatDialogQueryParam, scrollToId } from "utils/constants";
import { ProblemDetail } from "utils/projectTypes";

function AddChatDialogSubmitButton() {
  const status = useFormStatus();

  if (!status.pending) {
    return <Button type="submit">Add user</Button>;
  } else {
    return (
      <Button disabled type="button">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Adding user...
      </Button>
    );
  }
}

export function AddChatDialog() {
  const router = useRouter();
  const location = usePathname();

  const discardAndCloseDialog = useCallback(() => {
    const segment = location.endsWith("/chats") ? "" : "#" + scrollToId;
    router.push(location + segment);
  }, [location, router]);

  const [formProblem, setFormProblem] = useState<ProblemDetail | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await addChatWithUser(formData);
    if (response.ok) {
      discardAndCloseDialog();
    } else {
      setFormProblem(response.result as ProblemDetail);
    }

    return response;
  }

  const params = useSearchParams();
  const isOpen = params.get(addChatDialogQueryParam) === "true";

  //hack to only render the dialog once it is properly mounted
  //see: https://github.com/radix-ui/primitives/issues/1386
  //this happens when we refresh or open a new page with a route that has the query parameter addChat=true
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  return (
    <Dialog open={isMounted && isOpen} onOpenChange={discardAndCloseDialog}>
      <DialogContent className="max-w-md p-6">
        <form action={handleSubmit} className="grid gap-4">
          <CardHeader className="space-y-1 p-0">
            <CardTitle className="leading-8">
              Add a chat with a new user
            </CardTitle>
            <CardDescription>
              Chat with another user by entering their email below.
              <br />
              Click &apos;Add User&apos; when you&apos;re done.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 grid gap-2 p-0">
            <Label htmlFor="email">Email</Label>
            <Input
              autoFocus={false}
              required
              id="email"
              name="email"
              type="email"
              placeholder="user@example.com"
            />
            {formProblem && (
              <p className="leading-7 text-destructive">
                {formProblem.detail ?? "Unkown error. Please try again."}
              </p>
            )}
          </CardContent>
          <CardFooter className="mt-2 justify-between p-0">
            <Button
              variant="destructive"
              type="button"
              onClick={discardAndCloseDialog}
            >
              Discard
            </Button>
            <AddChatDialogSubmitButton />
          </CardFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
