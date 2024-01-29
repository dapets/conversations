declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      NEXT_PUBLIC_SIGNALR_PORT: number;
    }
  }
}

export { };
