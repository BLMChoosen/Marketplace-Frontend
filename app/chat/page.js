'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';
import { getSocket, disconnectSocket } from '../../lib/socket';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

function ChatContent() {
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

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const loadConversations = useCallback(async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  }, []);

  useEffect(() => {
    if (!user) return undefined;
    const timer = window.setTimeout(() => {
      loadConversations();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [user, loadConversations]);

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
  }, [user, activePeer, loadConversations]);

  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  useEffect(() => {
    if (!activePeer || !user) return;

    const loadHistory = async () => {
      try {
        const res = await api.get(`/chat/conversation/${activePeer}`);
        setMessages([...(res.data.messages || [])].reverse());
      } catch (err) {
        console.error('Failed to load conversation', err);
      }
    };
    loadHistory();
  }, [activePeer, user]);

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
    return <div className="bm-container py-12 text-white">Carregando...</div>;
  }

  return (
    <div className="bm-page bm-container py-8 min-h-[calc(100vh-10rem)]">
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-12rem)] bg-[rgb(17,17,20)] border border-[rgba(163,0,21,0.18)] rounded-md overflow-hidden">
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-[rgba(163,0,21,0.15)] flex flex-col bg-black max-h-72 lg:max-h-none">
          <div className="p-4 border-b border-[rgba(163,0,21,0.15)] flex items-center justify-between">
            <h2 className="font-heading font-black text-white uppercase text-sm">Conversas</h2>
            <span
              className={`w-2 h-2 rounded-full ${
                socketReady ? 'bg-[#A30015] shadow-[0_0_10px_rgba(163,0,21,0.8)]' : 'bg-[rgb(120,120,125)]'
              }`}
              title={socketReady ? 'Conectado' : 'Conectando...'}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-[rgb(161,161,170)] text-sm">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#A30015]" />
                Nenhuma conversa ainda.
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.conversation_id}
                  onClick={() => setActivePeer(c.peer_id)}
                  className={`w-full text-left p-4 hover:bg-[rgba(163,0,21,0.08)] transition-colors border-b border-[rgba(255,255,255,0.04)] ${
                    activePeer === c.peer_id ? 'bg-[rgba(163,0,21,0.12)] border-l-2 border-l-[#A30015]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-bold">Usuário #{c.peer_id}</span>
                    {c.unread_count > 0 && (
                      <span className="bg-[#A30015] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(163,0,21,0.7)]">
                        {c.unread_count}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[rgb(161,161,170)] truncate">
                    {c.last_message?.content || 'Sem mensagens'}
                  </p>
                </button>
              ))
            )}
          </div>
          <div className="p-3 border-t border-[rgba(163,0,21,0.15)]">
            <input
              type="number"
              placeholder="ID do usuário..."
              className="w-full px-3 py-2 rounded-md bg-[rgb(17,17,20)] border border-[rgba(255,255,255,0.06)] text-white text-sm placeholder:text-[rgb(120,120,125)] focus:outline-none focus:border-[#A30015]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.target.value) {
                  setActivePeer(parseInt(e.target.value, 10));
                  e.target.value = '';
                }
              }}
            />
          </div>
        </aside>

        <section className="flex-1 flex flex-col min-h-[28rem]">
          {!activePeer ? (
            <div className="flex-1 flex items-center justify-center text-[rgb(161,161,170)] flex-col gap-3">
              <MessageCircle className="w-12 h-12 text-[#A30015]" />
              <p>Selecione uma conversa para começar.</p>
            </div>
          ) : (
            <>
              <header className="p-4 border-b border-[rgba(163,0,21,0.15)] bg-black">
                <h3 className="font-heading font-black text-white uppercase">Usuário #{activePeer}</h3>
                {peerTyping && (
                  <p className="text-xs text-[#A30015] mt-0.5 animate-pulse">digitando...</p>
                )}
              </header>

              <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-[rgb(17,17,20)]">
                {messages.length === 0 ? (
                  <div className="text-center text-[rgb(161,161,170)] text-sm mt-12">
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
                          className={`max-w-[70%] rounded-md px-4 py-2 ${
                            mine
                              ? 'bg-[#A30015] text-white shadow-[0_8px_20px_-8px_rgba(163,0,21,0.7)]'
                              : 'bg-black text-white border border-[rgba(255,255,255,0.06)]'
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

              <form onSubmit={sendMessage} className="p-4 border-t border-[rgba(163,0,21,0.15)] flex gap-2 bg-black">
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

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="bm-container py-12 text-white">Carregando chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}
