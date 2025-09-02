import { memo, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

type MessageInputProps = {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
};

function MessageInputComponent({
  onSendMessage,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  }, [text, onSendMessage]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleSend();
      }
    },
    [handleSend]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setText(e.target.value);
    },
    []
  );

  return (
    <div className="flex gap-2">
      <Input
        placeholder="Digite uma mensagem..."
        value={text}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <Button onClick={handleSend} disabled={disabled || !text.trim()}>
        <Send /> Enviar
      </Button>
    </div>
  );
}

export const MessageInput = memo(MessageInputComponent);
