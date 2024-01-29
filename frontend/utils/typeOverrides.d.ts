declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      NEXT_PUBLIC_SIGNALR_CONNECTION_URL: string;
      NEXT_PUBLIC_ENV: "development" | "production";
    }
  }
}

export {};
