"use client";

import LoginForm from "@components/LoginForm";
import { LoggedInUserContext } from "@providers/LoggedInUserProvider";
import { getLoggedInUser, login } from "app/actions";
import { useRouter } from "next/navigation";
import { useContext } from "react";

const doNothing = () => {};

export default function LoginPage() {
  const router = useRouter();
  const loggedInUserContext = useContext(LoggedInUserContext);
  let setLoggedInUser = loggedInUserContext?.setLoggedInUser ?? doNothing;

  return (
    <LoginForm
      login={async (formData) => {
        const loginSuccess = await login(formData);
        const loggedInUser = await getLoggedInUser();
        if (loggedInUser) {
          setLoggedInUser(loggedInUser);
        }
        if (loginSuccess) {
          router.push("/chats");
        }
      }}
    />
  );
}
