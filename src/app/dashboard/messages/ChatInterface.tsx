'use client';

import { useState, useEffect, useRef } from 'react';

interface Sender {
  id: string;
  name: string;
  role: string;
  image?: string;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: Sender;
}

interface Project {
  id: string;
  title: string;
  createdAt: string;
}

export default function ChatInterface({
  projects,
  currentUserId,
  currentUserInitials,
}: {
  projects: Project[];
  currentUserId: string;
  currentUserInitials: string;
}) {
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0]?.id || '');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages when project changes
  useEffect(() => {
    if (!activeProjectId) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages?projectId=${activeProjectId}`);
        if (res.ok) {
          const data = await res.ok ? await res.json() : [];
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Setup polling every 8 seconds for a responsive feel without high DB overhead
    const interval = setInterval(fetchMessages, 8000);
    return () => clearInterval(interval);
  }, [activeProjectId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const activeProject = projects.find((p) => p.id === activeProjectId);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending || !activeProjectId) return;

    const messageText = inputMessage;
    setInputMessage('');
    setSending(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProjectId,
          content: messageText,
        }),
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => [...prev, newMessage]);
      } else {
        setInputMessage(messageText);
        alert('Failed to transmit message.');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
      {/* Project Selector sidebar */}
      <div className="md:col-span-1 flex flex-col gap-md">
        <h2 className="text-lg font-heading text-secondary mb-xs">Active Channels</h2>
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          return (
            <div
              key={project.id}
              onClick={() => setActiveProjectId(project.id)}
              className={`bg-card border rounded-xl p-md cursor-pointer transition-all relative overflow-hidden hover:border-primary ${
                isActive ? 'border-primary bg-primary-subtle/10' : 'border-subtle'
              }`}
            >
              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
              <h3 className="font-heading text-primary truncate">{project.title}</h3>
              <p className="text-xs text-tertiary mt-xs">
                Channel opened: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main chat viewport */}
      <div className="md:col-span-2 bg-card border border-subtle rounded-xl flex flex-col h-[600px] overflow-hidden shadow-md">
        {activeProject ? (
          <>
            {/* Header */}
            <div className="p-md border-b border-subtle bg-primary-subtle/5 flex justify-between items-center">
              <div>
                <h3 className="font-heading text-primary text-lg truncate max-w-[320px] md:max-w-none">
                  {activeProject.title}
                </h3>
                <p className="text-xs text-secondary">Encrypted comm channel</p>
              </div>
              <span className="badge badge-success">Online</span>
            </div>

            {/* Message Viewport */}
            <div ref={scrollRef} className="flex-1 p-lg overflow-y-auto flex flex-col gap-lg bg-primary/20">
              <div className="text-center">
                <span className="text-xs text-tertiary bg-tertiary/20 px-sm py-xs rounded-full">
                  Channel established: {new Date(activeProject.createdAt).toLocaleDateString()}
                </span>
              </div>

              {loading && messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <span className="spinner spinner-sm"></span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-center p-xl">
                  <p className="text-sm text-tertiary">No transmissions sent yet. Type a message below to start.</p>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  const senderInitials = message.sender.name ? message.sender.name.charAt(0) : '?';
                  const isSystemSender = message.sender.role === 'ADMIN' || message.sender.role === 'OWNER';

                  return (
                    <div
                      key={message.id}
                      className={`flex flex-col gap-xs max-w-[85%] ${
                        isCurrentUser ? 'self-end' : 'self-start'
                      }`}
                    >
                      <div
                        className={`flex items-end gap-sm ${
                          isCurrentUser ? 'flex-row-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrentUser
                              ? 'bg-gradient-primary text-inverse shadow-glow-primary'
                              : 'bg-secondary border border-subtle text-primary'
                          }`}
                        >
                          {isCurrentUser ? currentUserInitials : senderInitials}
                        </div>
                        <div
                          className={`p-md rounded-2xl border text-sm ${
                            isCurrentUser
                              ? 'bg-primary-subtle border-primary/20 rounded-br-none text-primary'
                              : 'bg-card border-subtle rounded-bl-none text-secondary'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] text-tertiary ${
                          isCurrentUser ? 'text-right mr-10' : 'ml-10'
                        }`}
                      >
                        {isSystemSender && !isCurrentUser ? 'Admin • ' : ''}
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input Form */}
            <div className="p-md border-t border-subtle bg-primary-subtle/5">
              <form className="flex gap-md" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Transmit message..."
                  disabled={sending}
                  className="flex-1 bg-input border border-subtle rounded-md px-md py-sm text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={sending || !inputMessage.trim()}
                  className="btn btn-primary btn-sm px-lg h-9"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-tertiary flex-col gap-md">
            <span className="text-4xl">📡</span>
            <p>Select a channel to transmit</p>
          </div>
        )}
      </div>
    </div>
  );
}
