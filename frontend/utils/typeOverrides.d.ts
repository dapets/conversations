declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BACKEND_URL: string;
      /**In prod: set via env variable in compose.yaml.
       *
       * (passed as args to Dockerfile because compose env variables aren't sent during build) */
      NEXT_PUBLIC_SIGNALR_CONNECTION_URL: string;
      NEXT_PUBLIC_ENV: "development" | "production";
    }
  }
}

export {};
