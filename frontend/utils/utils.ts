import { UserEntity } from "./dbEntities";

export function getActiveChatRoomId(pathname: string) {
  const segments = pathname.split("/");
  const activeChatRoomId = +segments[2];

  return activeChatRoomId;
}

/** Currently assuming we only have chat rooms with two (logged in + additional) member*/
export function getOtherChatUser(
  chatRoomMembers: UserEntity[],
  loggedInUserId: string
) {
  const otherChatUser = chatRoomMembers.filter(
    (member) => member.id !== loggedInUserId ?? Number.NaN
  )[0];

  return otherChatUser;
}

export function getUserDisplayName(user: UserEntity) {
  return user.firstName + " " + user.lastName;
}
