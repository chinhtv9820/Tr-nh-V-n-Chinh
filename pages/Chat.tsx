import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, User, Hash } from 'lucide-react';
import { ChatMessage } from '../types';

// Mocking socket behavior inside component since we can't run a real server
const Chat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [roomId, setRoomId] = useState('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fake initial data
  useEffect(() => {
    setMessages([
      { id: '1', senderId: 'system', content: 'Welcome to EduMatch Global Chat!', roomId: 'general', timestamp: Date.now() },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      content: input,
      roomId,
      timestamp: Date.now()
    };

    // Optimistic UI update
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate receiving a reply from a "bot" or another user after a delay
    if (roomId === 'general') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'bot',
          content: 'This is a mock response from the system.',
          roomId: 'general',
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, reply]);
      }, 1000);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex">
      {/* Rooms List */}
      <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 font-bold text-slate-700 border-b border-slate-200">
          Active Rooms
        </div>
        <div className="p-2 space-y-1">
          <button 
            onClick={() => setRoomId('general')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${roomId === 'general' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Hash size={18} />
            <span className="font-medium">General</span>
          </button>
          <button 
            onClick={() => setRoomId('research-help')}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${roomId === 'research-help' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <Hash size={18} />
            <span className="font-medium">Research Help</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
           <h3 className="font-bold text-slate-700 flex items-center gap-2">
             <Hash size={20} className="text-indigo-500"/>
             {roomId}
           </h3>
           <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full font-medium">Online</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map(msg => {
            const isMe = msg.senderId === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isMe ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-800'} rounded-2xl px-4 py-2 shadow-sm`}>
                  {!isMe && <div className="text-xs opacity-70 mb-1 font-bold">{msg.senderId === 'bot' ? 'EduBot' : 'User ' + msg.senderId}</div>}
                  <p>{msg.content}</p>
                  <div className={`text-[10px] mt-1 ${isMe ? 'text-indigo-200' : 'text-slate-400'} text-right`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-slate-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button type="submit" className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
              <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;