"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { aspnetAuthCookieName } from "utils/constants";
import { fetchWithAuth } from "./dataFetchers";

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
