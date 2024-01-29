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
} from "utils/projectTypes";
import { parse as parseCookie } from "cookie";

export async function revalidateChatHistory(historyId: number) {
  revalidatePath("chats/" + historyId, "page");
}

export async function login(
  loginRequest: FormData,
): Promise<ApiResponse<undefined>> {
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
    return { ok: true };
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
  formData: FormData,
): Promise<ApiResponse<undefined>> {
  const firstName = formData.get("first-name")?.toString();
  const lastName = formData.get("last-name")?.toString();

  if (!firstName || !lastName) {
    return {
      ok: false,
      result: { status: 400, detail: "Must enter a first and last name" },
    };
  }

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

  if (!registerResponse.ok) {
    const body = (await registerResponse.json()) as RegisterResponse;
    const flattenedErrors = Object.values(body.errors)[0][0];
    if (!flattenedErrors) {
      throw new Error(
        "Register failed but error response was not in the expected format",
      );
    }

    return {
      ok: false,
      result: { status: body.status, detail: flattenedErrors },
    };
  }

  const loginResponse = login(formData);
  if (!(await loginResponse).ok) {
    return loginResponse;
  }

  const completeRegistrationDto = {
    firstName,
    lastName,
  };
  const completeRegistrationResponse = completeRegistration(
    completeRegistrationDto,
  );

  return completeRegistrationResponse;
}

export async function completeRegistration(completeRegistrationDto: {
  firstName: string;
  lastName: string;
}): Promise<ApiResponse<undefined>> {
  const completeRegistrationResponse = await fetchWithAuth(
    process.env.BACKEND_URL + "/complete-registration",
    {
      method: "POST",
      body: JSON.stringify(completeRegistrationDto),
    },
  );

  if (completeRegistrationResponse.ok) {
    return { ok: true };
  }

  const error = (await completeRegistrationResponse.json()) as ProblemDetail;
  return {
    ok: false,
    result: {
      status: error.status,
      detail: error.detail,
    },
  };
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
