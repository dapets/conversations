import { redirect } from "next/navigation";
import { UserEntity } from "./projectTypes";
import {
  hasLoginChangedQueryParam,
  isChatRoomSelectedData,
  mainId,
  navBarId,
} from "./constants";

export function getActiveChatRoomId(pathname: string) {
  const segments = pathname.split("/");
  const activeChatRoomId = +segments[2];

  return activeChatRoomId;
}

/** Currently assuming we only have chat rooms with two (logged in + additional) member*/
export function getOtherChatUser(
  chatRoomMembers: UserEntity[],
  loggedInUserId: string,
) {
  const otherChatUser = chatRoomMembers.filter(
    (member) => member.id !== loggedInUserId ?? Number.NaN,
  )[0];

  return otherChatUser;
}

export function getUserDisplayName(user: UserEntity) {
  return user.firstName + " " + user.lastName;
}

export function getUserInitials(user: UserEntity) {
  return user.firstName[0] + user.lastName[0];
}

export function redirectWithLoginChanged(url: string) {
  redirect(url + `?${hasLoginChangedQueryParam}=true`);
}

/**Set data-[isChatRoomVisible] on the main and nav elements.
 * This makes certain content (in)visible on small screens. */
export function handleIsChatRoomSelected(isChatRoomSelected: boolean) {
  if (typeof window !== "object") return;

  const main = document.getElementById(mainId);
  const nav = document.getElementById(navBarId);

  if (!main || !nav) {
    //we might be on the server.
    return;
  }

  main.dataset[isChatRoomSelectedData] = isChatRoomSelected.toString();
  nav.dataset[isChatRoomSelectedData] = (!isChatRoomSelected).toString();
}

export function getSignalRUrl() {
  if (!process.env.NEXT_PUBLIC_SIGNALR_PORT) {
    return window.location.origin + "/chatHub";
  }

  const signalRUrl =
    window.location.protocol +
    "//" +
    window.location.hostname +
    ":" +
    process.env.NEXT_PUBLIC_SIGNALR_PORT +
    "/chatHub";

  return signalRUrl;
}
