'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { getSocket, disconnectSocket } from '../../lib/socket';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const initialPeer = params.get('user') ? parseInt(params.get('user'), 10) : null;

  const [conversations, setConversations] = useState([]);
  const [activePeer, setActivePeer] = useState(initialPeer);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [peerTyping, setPeerTyping] = useState(false);
  const [socketReady, setSocketReady] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Auth gate
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // Load conversations
  const loadConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  useEffect(() => {
    if (user) loadConversations();
  }, [user]);

  // Connect socket
  useEffect(() => {
    if (!user) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    socket.on('connect', () => setSocketReady(true));
    socket.on('disconnect', () => setSocketReady(false));
    socket.on('connected', () => setSocketReady(true));

    socket.on('new_message', (msg) => {
      setMessages((prev) => {
        if (
          activePeer &&
          (msg.sender_id === activePeer || msg.receiver_id === activePeer)
        ) {
          return [...prev, msg];
        }
        return prev;
      });
      loadConversations();
    });

    socket.on('user_typing', ({ sender_id }) => {
      if (sender_id === activePeer) {
        setPeerTyping(true);
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setPeerTyping(false), 2000);
      }
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
    });

    return () => {
      socket.off('new_message');
      socket.off('user_typing');
      socket.off('error');
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connected');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, activePeer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  // Load conversation history when peer changes
  useEffect(() => {
    if (!activePeer || !user) return;

    const loadHistory = async () => {
      try {
        const res = await api.get(`/chat/conversation/${activePeer}`);
        // backend returns newest-first; reverse for chat UI
        setMessages([...(res.data.messages || [])].reverse());
      } catch (err) {
        console.error('Failed to load conversation', err);
      }
    };
    loadHistory();
  }, [activePeer, user]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !activePeer || !socketRef.current) return;

    const token = localStorage.getItem('access_token');
    socketRef.current.emit('send_message', {
      token,
      receiver_id: activePeer,
      content: input.trim(),
    });
    setInput('');
  };

  const handleTyping = () => {
    if (!activePeer || !socketRef.current) return;
    const token = localStorage.getItem('access_token');
    socketRef.current.emit('typing', { token, receiver_id: activePeer });
  };

  if (loading || !user) {
    return <div className="container mx-auto px-4 py-12 text-white">Carregando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 h-[calc(100vh-10rem)]">
      <div className="flex h-full glass-panel rounded-2xl overflow-hidden">
        {/* Sidebar — conversations */}
        <aside className="w-72 border-r border-white/10 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-heading font-bold text-white">Conversas</h2>
            <span
              className={`w-2 h-2 rounded-full ${
                socketReady ? 'bg-green-400' : 'bg-yellow-400'
              }`}
              title={socketReady ? 'Conectado' : 'Conectando...'}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                Nenhuma conversa ainda.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.conversation_id}
                  onClick={() => setActivePeer(c.peer_id)}
                  className={`w-full text-left p-4 hover:bg-white/5 transition-colors border-b border-white/5 ${
                    activePeer === c.peer_id ? 'bg-white/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">Usuário #{c.peer_id}</span>
                    {c.unread_count > 0 && (
                      <span className="bg-accent text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    {c.last_message?.content || 'Sem mensagens'}
                  </p>
                </button>
              ))
            )}
          </div>
          {/* Quick start a conversation */}
          <div className="p-3 border-t border-white/10">
            <input
              type="number"
              placeholder="ID do usuário..."
              className="w-full px-3 py-2 rounded-lg bg-secondary/50 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-primary"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setActivePeer(parseInt(e.target.value, 10));
                  e.target.value = '';
                }
              }}
            />
          </div>
        </aside>

        {/* Main chat */}
        <section className="flex-1 flex flex-col">
          {!activePeer ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-3">
              <MessageCircle className="w-12 h-12 text-gray-500" />
              <p>Selecione uma conversa para começar.</p>
            </div>
          ) : (
            <>
              <header className="p-4 border-b border-white/10">
                <h3 className="font-heading font-bold text-white">Usuário #{activePeer}</h3>
                {peerTyping && (
                  <p className="text-xs text-primary mt-0.5 animate-pulse">digitando...</p>
                )}
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm mt-12">
                    Sem mensagens. Envie a primeira.
                  </div>
                ) : (
                  messages.map((msg) => {
                    const mine = msg.sender_id === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                            mine
                              ? 'bg-primary text-white'
                              : 'bg-white/5 text-white border border-white/10'
                          }`}
                        >
                          <p className="text-sm break-words">{msg.content}</p>
                          <p className="text-[10px] opacity-60 mt-1">
                            {msg.timestamp
                              ? new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Escreva uma mensagem..."
                />
                <Button type="submit" variant="primary" size="md" className="!px-4" disabled={!input.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
