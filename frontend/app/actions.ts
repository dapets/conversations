"use server";

import { revalidatePath } from "next/cache";

export async function revalidateChatHistory(historyId: number) {
  revalidatePath("chats/" + historyId, "page");
}
