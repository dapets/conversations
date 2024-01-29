import LoginForm from "app/login/LoginForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { fetchWithAuth } from "app/dataFetchers";
import { parse as parseCookie } from "cookie";
import { cookies } from "next/headers";
import {
  aspnetAuthCookieName,
  hasLoginChangedQueryParam,
} from "utils/constants";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

async function login(loginRequest: FormData) {
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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    }
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

  return response.ok;
}

export default function LoginPage() {
  return (
    <div className="grid place-content-center h-[100svh]">
      <LoginForm
        login={async (_, formData) => {
          "use server";
          const result = await login(formData);

          if (result) {
            redirect("/chats");
          } else {
            return {
              success: false,
              message: "Email or password incorrect.",
            };
          }
        }}
      />
    </div>
  );
}
