import ChatGptWindow from ".";

export default function ChatDetail({ params }: { params: { id: string } }) {
  return (
    <ChatGptWindow conversationId={params.id} isNewChat={false} />
  );
}
