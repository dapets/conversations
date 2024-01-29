import { useRouter } from "next/navigation";
import { addChatDialogQueryParam, scrollToId } from "utils/constants";

export default function useOpenAddChatDialog() {
  const router = useRouter();

  return () =>
    router.push(
      "?" +
        new URLSearchParams({ [addChatDialogQueryParam]: "true" }) +
        "#" +
        scrollToId,
    );
}
