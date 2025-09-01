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
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    socket.emit("message:list", {
      limit: 50,
    });
    const onList = (list: Message[]) => setMessages(list.slice().reverse());
    const onNew = (m: Message) => setMessages((prev) => [...prev, m]);
    socket.on("message:list", onList);
    socket.on("message:new", onNew);
    socket.on("error", (e) => console.warn("[ws error]", e));
    return () => {
      socket.off("message:list", onList);
      socket.off("message:new", onNew);
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
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chat</h1>
        <div className="text-sm opacity-70">
          {connected ? "Online" : "Offline"} • {user?.name}
        </div>
      </header>

      <ScrollArea className="flex-1 border rounded p-3 max-h-[80vh]">
        <div className="space-y-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex w-full justify-between text-sm hover:bg-slate-100 p-1 pl-1.5 pr-1.5 rounded"
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
