"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { aspnetAuthCookieName } from "utils/constants";
import { fetchWithAuth } from "./dataFetchers";
import {
  ApiResponse,
  ChatRoomCreatedDto,
  ChatRoomListEntity,
  LoginResponse,
  ProblemDetail,
  RegisterResponse,
} from "utils/dbEntities";
import { parse as parseCookie } from "cookie";

export async function revalidateChatHistory(historyId: number) {
  revalidatePath("chats/" + historyId, "page");
}

export async function login(
  loginRequest: FormData,
): Promise<ApiResponse<ProblemDetail>> {
  "use server";
  const loginData = {
    email: loginRequest.get("email"),
    password: loginRequest.get("password"),
  };

  const response = await fetchWithAuth(
    process.env.BACKEND_URL +
      "/login?" +
      new URLSearchParams({ useCookies: "true" }),
    {
      method: "POST",
      body: JSON.stringify(loginData),
    },
  );

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

  if (response.ok) {
    redirect("/chats");
  } else {
    const responseBody = (await response.json()) as LoginResponse;
    const descriptiveDetail =
      responseBody.detail === "Failed"
        ? "Email or password incorrect"
        : "Too many attempts. Please try again later.";
    return {
      ok: false,
      result: {
        status: response.status,
        detail: descriptiveDetail,
      },
    };
  }
}

export async function register(
  _: unknown,
  formData: FormData,
): Promise<ApiResponse<ProblemDetail>> {
  const registerRequest = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const registerResponse = await fetchWithAuth(
    process.env.BACKEND_URL + "/register",
    {
      method: "POST",
      body: JSON.stringify(registerRequest),
    },
  );

  if (registerResponse.ok) return { ok: true };

  const body = (await registerResponse.json()) as RegisterResponse;
  const flattenedErrors = Object.values(body.errors)[0][0];
  if (!flattenedErrors) {
    throw new Error(
      "Register failed but error response was not in the expected format",
    );
  }

  console.log(body.errors);
  console.log(flattenedErrors);
  return {
    ok: false,
    result: { status: body.status, detail: flattenedErrors },
  };

  // const loginResponse = login(formData);
  // if(!(await loginResponse).ok)

  // const finishRegistrationResponse = await fetchWithAuth();
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

export async function addChatWithUser(
  formData: FormData,
): Promise<ApiResponse<ChatRoomListEntity>> {
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
