"use server";

import { HistoryEntity, UserEntity } from "utils/dbEntities";

export async function login(loginRequest: FormData) {
  const loginData = {
    email: loginRequest.get("email"),
    password: loginRequest.get("password"),
  };

  const response = await fetch(
    process.env.BACKEND_URL +
      "/login?" +
      new URLSearchParams({ useCookies: "true" }),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
  );

  return response.ok;
}

export async function getChatList() {
  const result = await fetch(process.env.BACKEND_URL + "/chats", {
    cache: "no-store",
  });

  if (!result.ok) return undefined;

  const text = await result.text();
  return JSON.parse(text) as UserEntity[][];
}

export async function getChatHistoryWithId(userId: number) {
  const result = await fetch(process.env.BACKEND_URL + "/chats/" + userId);
  return JSON.parse(await result.text()) as HistoryEntity[];
}

export async function getLoggedInUser() {
  const result = await fetch(process.env.BACKEND_URL + "/whoami");

  return JSON.parse(await result.text()) as UserEntity;
}
