"use server";

import { HistoryEntity, UserEntity } from "utils/dbEntities";

type LoginRequest = { email: string; password: string };

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
