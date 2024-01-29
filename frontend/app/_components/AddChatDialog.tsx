"use client";

import { DialogClose, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@shadcn/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@shadcn/dialog";
import { Input } from "@shadcn/input";
import { Label } from "@shadcn/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { addChatDialogQueryParam, scrollToId } from "utils/constants";

export function AddChatDialog() {
  const params = useSearchParams();
  const router = useRouter();
  const location = usePathname();

  const isOpen = params.get(addChatDialogQueryParam) === "true";

  //hack to only render the dialog once it is properly mounted
  //see: https://github.com/radix-ui/primitives/issues/1386
  //this happens when we refresh or open a new page with a route that has the query parameter addChat=true
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  function discardAndCloseDialog() {
    router.push(location);
  }

  return (
    <Dialog open={isMounted && isOpen}>
      <form action={() => console.log("submitted")}>
        <DialogContent
          onPointerDownOutside={discardAndCloseDialog}
          onEscapeKeyDown={discardAndCloseDialog}
          className="max-w-md p-6"
        >
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
          <CardContent className="mt-2 grid gap-6 p-0">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                autoFocus={false}
                required
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
              />
            </div>
          </CardContent>
          <CardFooter className="mt-2 justify-between p-0">
            <Button
              onClick={discardAndCloseDialog}
              variant="destructive"
              type="button"
            >
              Discard
            </Button>
            <Button type="submit">Add user</Button>
          </CardFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
