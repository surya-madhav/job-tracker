'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, X, Minimize2, Maximize2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export function ChatWindow() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hi! I can help you with your job search. Ask me anything about the current page or your tracked data.',
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: message,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: crypto.randomUUID(),
        content: 'I understand your question. Let me help you with that...',
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "fixed right-4 bg-background border rounded-lg shadow-lg transition-all duration-200",
        isMinimized ? "bottom-4 h-12 w-80" : "bottom-4 h-[500px] w-80"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="h-[400px] p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex gap-2 max-w-[80%]",
                    msg.isBot ? "mr-auto" : "ml-auto flex-row-reverse"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-3",
                      msg.isBot ? "bg-muted" : "bg-primary text-primary-foreground"
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}