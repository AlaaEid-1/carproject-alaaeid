'use client';

import { useEffect, useState, useRef } from 'react';
import { Realtime } from 'ably';

interface Message {
  text: string;
  timestamp: Date;
  user: string;
  id: string;
}

interface TypingUser {
  user: string;
  timestamp: Date;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Load messages from localStorage
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages).map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        id: msg.id || Math.random().toString(36).substr(2, 9)
      })));
    }

    if (!process.env.NEXT_PUBLIC_ABLY_API_KEY) {
      console.error('Ably API key not found');
      return;
    }

    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY });
    const channel = ably.channels.get('Alaa-Explorion-chat');

    channel.subscribe('message', (msg) => {
      const newMsg = {
        text: msg.data.text,
        timestamp: new Date(),
        user: msg.data.user,
        id: Math.random().toString(36).substr(2, 9)
      };
      setMessages((prev) => {
        const updated = [...prev, newMsg];
        localStorage.setItem('chat-messages', JSON.stringify(updated.slice(-50))); // Keep last 50 messages
        return updated;
      });
    });

    channel.subscribe('typing', (msg) => {
      setTypingUsers((prev) => {
        const existing = prev.find(t => t.user === msg.data.user);
        if (existing) {
          return prev.map(t => t.user === msg.data.user ? { ...t, timestamp: new Date() } : t);
        }
        return [...prev, { user: msg.data.user, timestamp: new Date() }];
      });
    });

    ably.connection.on('connected', () => setIsConnected(true));
    ably.connection.on('failed', () => setIsConnected(false));

    return () => {
      channel.unsubscribe();
      if (ably.connection.state === 'connected') ably.close();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      setTypingUsers((prev) => prev.filter(t => Date.now() - t.timestamp.getTime() < 3000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTyping = () => {
    if (!user.trim()) return;
    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY! });
    const channel = ably.channels.get('Alaa-Explorion-chat');
    channel.publish('typing', { user });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      // Typing stopped
    }, 1000);
  };



  const sendMessage = () => {
    if (!newMessage.trim() || !user.trim()) return;
    const ably = new Realtime({ key: process.env.NEXT_PUBLIC_ABLY_API_KEY! });
    const channel = ably.channels.get('Alaa-Explorion-chat');
    channel.publish('message', { text: newMessage, user });

    setNewMessage('');
  };

  const getUserColor = (username: string) => {
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="bg-[#F5F3FF] dark:bg-[#1F1F2E] rounded-lg shadow-lg p-6 h-96 flex flex-col">
      <h3 className="text-xl font-bold text-[#6D28D9] dark:text-[#EDE9FE] mb-4">Live Chat</h3>

      <div className="flex-1 overflow-y-auto mb-4 p-4 border border-[#DDD6FE] dark:border-[#2B2B3D] rounded-md bg-gradient-to-b from-[#EDE9FE]/20 to-[#D8B4FE]/10 space-y-3">
        {messages.map((msg) => {
          const isOwnMessage = msg.user === user;
          return (
            <div key={msg.id} className={`animate-fade-in ${isOwnMessage ? 'flex justify-end' : ''}`}>
              <div className={`flex items-start space-x-3 max-w-[80%] ${isOwnMessage ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: getUserColor(msg.user) }}
                >
                  {msg.user.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`flex items-baseline space-x-2 mb-1 ${isOwnMessage ? 'justify-end' : ''}`}>
                    <span className="font-semibold" style={{ color: getUserColor(msg.user) }}>
                      {msg.user}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={`${isOwnMessage ? 'bg-[#C084FC] text-white' : 'bg-white dark:bg-[#2B2B3D]'} rounded-lg px-3 py-2 shadow-sm max-w-full`}>
                    <p className={`${isOwnMessage ? 'text-white' : 'text-gray-800 dark:text-[#EDE9FE]'} break-words`}>{msg.text}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {messages.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center">No messages yet. Start the conversation!</p>
        )}
        {typingUsers.length > 0 && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">
              {typingUsers.map(t => t.user).join(', ')} {typingUsers.length === 1 ? 'is typing' : 'are typing'}...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Your name"
          className="flex-1 px-3 py-2 border border-[#DDD6FE] dark:border-[#2B2B3D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C084FC] dark:bg-[#2B2B3D] dark:text-[#EDE9FE]"
        />
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-[#DDD6FE] dark:border-[#2B2B3D] rounded-md focus:outline-none focus:ring-2 focus:ring-[#C084FC] dark:bg-[#2B2B3D] dark:text-[#EDE9FE]"
        />
        <button
          onClick={sendMessage}
          disabled={!isConnected || !newMessage.trim() || !user.trim()}
          className="px-4 py-2 bg-gradient-to-r from-[#C084FC] to-[#A78BFA] text-white rounded-md hover:from-[#A78BFA] hover:to-[#8B5CF6] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          Send
        </button>
      </div>

      {!isConnected && (
        <p className="text-red-500 text-sm mt-2">Connecting to chat...</p>
      )}
    </div>
  );
}
