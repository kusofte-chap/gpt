import ChatGptWindow from ".";

export default function ChatDetail({ params }: { params: { chat_id: string } }) {
  return (
    <ChatGptWindow conversationId={params.chat_id} isNewChat={false} />
  );
}
