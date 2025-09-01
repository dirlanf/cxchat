import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoginPage } from "@/features/auth/pages/login-page";
import { RegisterPage } from "@/features/auth/pages/register-page";
import { ChatPage } from "@/features/chat/pages/chat-page";
import { useAuth } from "./providers/auth-provider";
import type { JSX } from "react";
import { SocketProvider } from "./providers/socket-provider";

function Protected({ children }: { children: JSX.Element }) {
  const { loading, user } = useAuth();
  if (loading) return <div className="p-6">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/chat" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/chat",
    element: (
      <Protected>
        <SocketProvider>
          <ChatPage />
        </SocketProvider>
      </Protected>
    ),
  },
]);
