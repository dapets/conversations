import { HistoryEntity, UserEntity } from "./types/dbEntities";

export async function getChatList() {
  const result = await fetch(process.env.BACKEND_URL + "/chats", {
    cache: "no-store",
  });
  const text = await result.text();
  return JSON.parse(text) as UserEntity[][];
}

export async function getChatHistoryWithId(userId: number) {
  const result = await fetch(process.env.BACKEND_URL + "/chats/" + userId);
  return JSON.parse(await result.text()) as HistoryEntity[];
}
