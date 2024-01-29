export function getActiveChatRoomId(pathname: string) {
  const segments = pathname.split("/");
  const activeChatRoomId = +segments[2];

  return activeChatRoomId;
}
