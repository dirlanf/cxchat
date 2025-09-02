import { useEffect, useState, useRef } from "react";
import { useSocket } from "@/providers/socket-provider";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

type Message = {
  id: string;
  userName: string;
  text: string;
  createdAt: string;
};

export function ChatPage() {
  const { socket, connected } = useSocket();
  const { user } = useAuth();
  const [messages, setMessages] = useState<
    (Message & { isSystemMessage?: boolean })[]
  >([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit("message:list", {
      limit: 50,
    });
    const onMessageList = (list: Message[]) =>
      setMessages(list.slice().reverse());
    const onMessageNew = (m: Message) => setMessages((prev) => [...prev, m]);
    const onUserJoined = (m: { userName: string; joinedAt: string }) =>
      setMessages((prev) => [
        ...prev,
        {
          id: "-1",
          userName: m.userName,
          createdAt: m.joinedAt,
          text: "Entrou na sala",
          isSystemMessage: true,
        },
      ]);
    const onUserLeft = (m: { userName: string; leftAt: string }) =>
      setMessages((prev) => [
        ...prev,
        {
          id: "-1",
          userName: m.userName,
          createdAt: m.leftAt,
          text: "Deixou a sala",
          isSystemMessage: true,
        },
      ]);

    socket.on("message:list", onMessageList);
    socket.on("message:new", onMessageNew);
    socket.on("user:joined", onUserJoined);
    socket.on("user:left", onUserLeft);
    socket.on("error", (e) => console.warn("[ws error]", e));

    return () => {
      socket.off("message:list", onMessageList);
      socket.off("message:new", onMessageNew);
      socket.off("user:joined", onUserJoined);
      socket.off("user:left", onUserLeft);
    };
  }, [socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const send = () => {
    if (!text.trim() || !socket) return;
    socket.emit("message:send", { text });
    setText("");
  };

  return (
    <div className="max-w-3xl mx-auto p-4 grid gap-4 h-dvh">
      <header className="flex items-center justify-between max-h-10">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="text-sm opacity-70">
          {connected ? "Online" : "Offline"} • {user?.name}
        </div>
      </header>

      <ScrollArea className="flex-1 border rounded p-3 max-h-[80vh] h-full">
        <div className="space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex w-full justify-between text-sm ${m.isSystemMessage ? "bg-slate-200" : "bg-white"} hover:bg-slate-100 p-1 pl-1.5 pr-1.5 rounded`}
            >
              <span className="w-full overflow-x-hidden">
                <span className="font-medium">{m.userName}</span>: {m.text}
              </span>
              <span className="ml-2 opacity-60 text-xs">
                {new Date(m.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>

      <div className="flex gap-2">
        <Input
          placeholder="Digite uma mensagem..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <Button onClick={send}>
          {" "}
          <Send /> Enviar
        </Button>
      </div>
    </div>
  );
}
