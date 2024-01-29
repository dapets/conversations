"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { aspnetAuthCookieName } from "utils/constants";
import { fetchWithAuth } from "./dataFetchers";
import {
  ChatRoomCreatedDto,
  ChatRoomListEntity,
  ProblemDetail,
} from "utils/dbEntities";

export async function revalidateChatHistory(historyId: number) {
  revalidatePath("chats/" + historyId, "page");
}

export async function logout() {
  const result = await fetchWithAuth(process.env.BACKEND_URL + "/logout", {
    method: "POST",
  });
  if (result.ok) {
    cookies().delete(aspnetAuthCookieName);
    redirect("/login");
  }

  throw new Error("Coulnd't log out user");
}

export type AddChatWithUserResponse = {
  ok: boolean;
  result: ProblemDetail | ChatRoomListEntity;
};

export async function addChatWithUser(
  formData: FormData,
): Promise<AddChatWithUserResponse> {
  const email = formData.get("email");
  const result = await fetchWithAuth(process.env.BACKEND_URL + "/chats/", {
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });

  const jsonResult = await result.json();

  if (result.ok) {
    const chatRoomAddedResult = jsonResult as ChatRoomCreatedDto;
    const newChatRoom: ChatRoomListEntity = {
      ...chatRoomAddedResult,
      isUnread: true,
    };

    return { ok: true, result: newChatRoom };
  } else {
    const problem = jsonResult as ProblemDetail;

    return {
      ok: false,
      result: problem,
    };
  }
}
