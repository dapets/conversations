declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      NEXT_PUBLIC_ENV: "development" | "production";
      NEXT_PUBLIC_BACKEND_PORT: number;
    }
  }
}

export {};
