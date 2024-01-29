export function getActiveChatRoomId(pathname: string) {
  const segments = pathname.split("/");
  const activeChatRoomId = +segments[2];
  if (!activeChatRoomId) {
    throw Error("Can't extract chatRoomId from pathname: invalid pathname");
  }
  return activeChatRoomId;
}
