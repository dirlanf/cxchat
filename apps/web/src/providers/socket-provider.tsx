import { io, Socket } from "socket.io-client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL;

type SocketCtx = { socket: Socket | null; connected: boolean };
const SocketContext = createContext<SocketCtx>({
  socket: null,
  connected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(`${API_URL}/chat`, {
      withCredentials: true,
      transports: ["websocket"],
      autoConnect: true,
    });

    s.on("connect", () => {
      toast.success("Conectado ao chat");
      setConnected(true);
    });
    s.on("disconnect", () => {
      toast.warning("Desconectado do chat");
      setConnected(false);
    });
    s.on("error", (err) => {
      toast.error(`Erro no socket: ${err?.message ?? err}`);
      setConnected(false);
    });

    setSocket(s);
    return () => {
      s.disconnect();
      setConnected(false);
    };
  }, []);

  const value = useMemo(() => ({ socket, connected }), [socket, connected]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
