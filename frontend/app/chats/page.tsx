import { HandleIsChatRoomSelected } from "@components/HandleIsChatRoomSelected";

export default function NoChatSelected() {
  return (
    <>
      <HandleIsChatRoomSelected />
      <p className="row-start-2 place-self-center">No chat selected</p>
    </>
  );
}
