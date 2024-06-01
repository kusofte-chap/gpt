
import { useRequest } from "ahooks";
import ChatContent from ".";

export default function ChatDetail({ params }: { params: { id: string } }) {
  return (
    <ChatContent />
  );
}
