import {
  ChatRoomEntity,
  ChatRoomListEntity,
  UserEntity,
} from "utils/projectTypes";
import { cookies } from "next/headers";
import { serialize as serializeCookie } from "cookie";
import { aspnetAuthCookieName, cookieHeaderName } from "utils/constants";
import { redirectWithLoginChanged } from "utils/utils";
import "server-only";

/** Cookie flow
 *
 * Obtaining auth information
 *1. POST /login
 *
 *2. cookies() is emtpy, request.headers['Cookie'] is empty
 *
 *3. If login information was valid request resolves and a response.headers['set-cookie] contains auth information
 *
 *4. Set browser cookies via cookies().set() to response.headers['set-cookie'][AspNetAuthCookieName]
 *
 * The browser now has the (auth) cookies the backend api returned.
 *
 * On every subsequent request we 'forward' the browser (auth) cookies to nextjs' fetch.
 */
export async function fetchWithAuth(
  requestInfo: RequestInfo,
  init?: RequestInit,
) {
  if (typeof requestInfo === "string" || requestInfo instanceof String) {
    requestInfo = new Request(requestInfo);
  } else {
    requestInfo = requestInfo;
  }

  const browserAspnetAuthCookie = cookies().get(aspnetAuthCookieName);
  if (browserAspnetAuthCookie) {
    requestInfo.headers.set(
      cookieHeaderName,
      serializeCookie(
        browserAspnetAuthCookie.name,
        browserAspnetAuthCookie.value,
      ),
    );
  }

  if (init?.method === "POST" || init?.method === "PUT") {
    requestInfo.headers.append("Content-Type", "application/json");
  }

  const response = await fetch(requestInfo, init);
  if (response.status === 401 && !requestInfo.url.includes("/login")) {
    redirectWithLoginChanged("/login");
  } else if (response.status === 403) {
    //This indicates that the registration has not fully completed (FirstName or LastName null in the db).
    //This should not be possible because the `register` server action should've verified it.
    //We might want figure out a better way of handling this, but for now we just redirect to login.
    redirectWithLoginChanged("/login");
  }

  return response;
}

export async function getChatRoomsList() {
  const result = await fetchWithAuth(process.env.BACKEND_URL + "/chats");

  if (!result.ok) {
    throw new Error(`Error fetching chat rooms ${result}`);
  }

  const text = await result.text();
  return JSON.parse(text) as ChatRoomListEntity[];
}

export async function getChatHistoryById(chatRoomId: number) {
  const result = await fetchWithAuth(
    `${process.env.BACKEND_URL}/chats/${chatRoomId}`,
  );

  if (!result.ok) {
    throw new Error("Failed fetching history");
  }

  return (await result.json()) as ChatRoomEntity;
}

export async function getLoggedInUser() {
  const result = await fetchWithAuth(process.env.BACKEND_URL + "/whoami");
  if (!result.ok) {
    throw new Error("Failed fetching user");
  }

  return (await result.json()) as UserEntity;
}
