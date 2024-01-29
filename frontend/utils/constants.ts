export const scrollToId = "latest";
export const messageScrollContainerId = "message-scroll-container";
export const aspnetAuthCookieName = ".AspNetCore.Identity.Application";
export const cookieHeaderName = "Cookie";
export const hasLoginChangedQueryParam = "loginChanged";
/**We use this query parameter to tell the SignalRProvider that the auth cookies changed. */
export const addChatDialogQueryParam = "addChat";
export const chatHistoryTag = "history-";
export const maxMessageLength = 300;

/**!!Don't change this value!! It's hardcoded in classNames in /app/chats/layout.tsx
 * Using it as a dynamic values didn't immediately work, I'm sure its possible.
 * If you want to figure it out, here's a starting point:
 * https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 */
export const isChatRoomSelectedData = "isChatRoomSelected";
export const navBarId = "nav";
export const mainId = "main";
