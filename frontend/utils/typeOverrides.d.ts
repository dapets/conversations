declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
    }
  }
}

export {};
