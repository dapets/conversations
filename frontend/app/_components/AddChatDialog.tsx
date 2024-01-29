"use client";

import { useSetAddedRooms } from "@providers/AddedChatRoomsContext";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { addChatDialogQueryParam, scrollToId } from "utils/constants";

function AddChatDialogSubmitButton({ disabled }: { disabled?: boolean }) {
  const status = useFormStatus();

  if (!status.pending) {
    return (
      <Button disabled={disabled} type="submit">
        Add user
      </Button>
    );
  } else {
    return <Button disabled>Adding user...</Button>;
  }
}

export function AddChatDialog() {
  const params = useSearchParams();
  const isOpen = params.get(addChatDialogQueryParam) === "true";

  const router = useRouter();
  const location = usePathname();

  function discardAndCloseDialog() {
    router.push(location + "#" + scrollToId);
  }

  const [addChatDialogState, addChatDialogAction] = useFormState(
    addChatWithUser,
    null,
  );

  //hack to only render the dialog once it is properly mounted
  //see: https://github.com/radix-ui/primitives/issues/1386
  //this happens when we refresh or open a new page with a route that has the query parameter addChat=true
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const [isFormValid, setIsFormValid] = useState(false);
  const setAddedRooms = useSetAddedRooms();

  return (
    <Dialog open={isMounted && isOpen} onOpenChange={discardAndCloseDialog}>
      <DialogContent className="max-w-md p-6">
        <form
          action={addChatDialogAction}
          onChange={(e) => setIsFormValid(e.currentTarget.checkValidity())}
          className="grid gap-4"
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
          </CardContent>
          <CardFooter className="mt-2 justify-between p-0">
            <Button
              variant="destructive"
              type="button"
              onClick={discardAndCloseDialog}
            >
              Discard
            </Button>
            <AddChatDialogSubmitButton disabled={!isFormValid} />
          </CardFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
