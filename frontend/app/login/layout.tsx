import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage({ children }: { children: React.ReactNode }) {
  return <div className="grid place-content-center h-[100svh]">{children}</div>;
}
