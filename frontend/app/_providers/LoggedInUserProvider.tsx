"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useMemo,
  useState,
} from "react";
import { UserEntity } from "utils/dbEntities";

type LoggedInUserContex = {
  loggedInUser: UserEntity;
  setLoggedInUser: Dispatch<SetStateAction<UserEntity | null>>;
};

export const LoggedInUserContext = createContext<LoggedInUserContex | null>(
  null
);

export function LoggedInUserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedInUser, setLoggedInUser] = useState<UserEntity | null>(null);

  const contextValue = useMemo(() => {
    if (loggedInUser) {
      return { loggedInUser, setLoggedInUser };
    } else {
      return null;
    }
  }, [loggedInUser, setLoggedInUser]);

  return (
    <LoggedInUserContext.Provider value={contextValue}>
      {children}
    </LoggedInUserContext.Provider>
  );
}
