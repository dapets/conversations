import { login } from "app/actions";
import { redirectWithLoginChanged } from "utils/utils";

export async function GET() {
  const loginFormData = new FormData();
  loginFormData.append("email", process.env.DEMO_USER_EMAIL);
  loginFormData.append("password", process.env.DEMO_USER_PASSWORD);
  await login(loginFormData);
  redirectWithLoginChanged("/chats");
}
