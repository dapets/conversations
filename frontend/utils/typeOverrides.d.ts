declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      NEXT_PUBLIC_SIGNALR_PORT: number;
      DEMO_USER_EMAIL: string;
      DEMO_USER_PASSWORD: string;
    }
  }
}

export {};
