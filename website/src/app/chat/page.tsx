import type { Metadata } from "next";
import ChatInterface from "@/components/chat/ChatInterface";

export const metadata: Metadata = {
  title: "Chat with Ben",
  description:
    "Talk to an AI clone of Ben Gregory — trained on his writing and a profile he wrote. Voice in, voice out.",
  robots: { index: false, follow: false },
};

export default function ChatPage() {
  return <ChatInterface />;
}
