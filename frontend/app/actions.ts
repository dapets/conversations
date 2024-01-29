"use server";

import {
  ChatRoomEntity,
  ChatRoomListEntity,
  UserEntity,
} from "utils/dbEntities";
import { cookies } from "next/headers";
import { parse as parseCookie, serialize as serializeCookie } from "cookie";
import { redirect } from "next/navigation";

const aspnetAuthCookieName = ".AspNetCore.Identity.Application";
const cookieHeaderName = "Cookie";

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
async function fetchWithHandleAuth(
  requestInfo: RequestInfo,
  init?: RequestInit
) {
  let request: Request;
  if (typeof requestInfo === "string" || requestInfo instanceof String) {
    request = new Request(requestInfo);
  } else {
    request = requestInfo;
  }

  const browserAspnetAuthCookie = cookies().get(aspnetAuthCookieName);
  if (browserAspnetAuthCookie) {
    request.headers.set(
      cookieHeaderName,
      serializeCookie(
        browserAspnetAuthCookie.name,
        browserAspnetAuthCookie.value
      )
    );
  }

  const response = await fetch(request, init);
  if (response.status === 401 && !request.url.includes("/login")) {
    redirect("/login");
  }

  const serverCookies = response.headers.getSetCookie();
  for (const serverCookie of serverCookies) {
    const parsedCookie = parseCookie(serverCookie);
    if (!parsedCookie[aspnetAuthCookieName]) continue;

    cookies().set({
      name: aspnetAuthCookieName,
      value: parsedCookie[aspnetAuthCookieName],
      expires: new Date(parsedCookie.expires),
      path: parsedCookie.path,
      sameSite: "none",
      secure: true,
    });
  }
  return response;
}

export async function login(loginRequest: FormData) {
  const loginData = {
    email: loginRequest.get("email"),
    password: loginRequest.get("password"),
  };

  const response = await fetchWithHandleAuth(
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

  if (response.ok) redirect("/chats");
}

export async function getChatRoomsList() {
  const result = await fetchWithHandleAuth(process.env.BACKEND_URL + "/chats", {
    cache: "no-store",
  });

  if (!result.ok) return undefined;

  const text = await result.text();
  return JSON.parse(text) as ChatRoomListEntity[];
}

export async function getChatHistoryWithId(chatRoomId: number) {
  const response = await fetchWithHandleAuth(
    `${process.env.BACKEND_URL}/chats/${chatRoomId}`
  );

  if (!response.ok) {
    throw new Error("Failed fetching history");
  }

  return (await response.json()) as ChatRoomEntity;
}

export async function getLoggedInUser() {
  const result = await fetchWithHandleAuth(process.env.BACKEND_URL + "/whoami");

  return (await result.json()) as UserEntity;
}
