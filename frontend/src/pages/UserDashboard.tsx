import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  FileText, 
  Music, 
  Video, 
  Languages, 
  Mic, 
  LogOut, 
  Plus, 
  MessageSquare,
  Search,
  MoreVertical,
  X,
  Loader2,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ParticleField from '@/components/ParticleField';
import NotificationBell from '@/components/NotificationBell';
import { ScrollArea } from '@/components/ui/scroll-area';
import tejaLogo from '@/assets/teja-logo.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Attachment {
  fileUrl: string;
  fileType: 'image' | 'video' | 'audio' | 'document';
  fileName: string;
}

interface Message {
  _id: string;
  chat: string;
  sender: string;
  content: string;
  role: 'user' | 'model';
  attachments?: Attachment[];
  createdAt: string;
}

interface Chat {
  _id: string;
  title: string;
  lastMessage?: string;
  updatedAt: string;
}

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch Chats
  const { data: chats = [], isLoading: isLoadingChats } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      const { data } = await api.get('/chat');
      return data;
    },
  });

  // Fetch Messages
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', activeChatId],
    queryFn: async () => {
      if (!activeChatId) return [];
      const { data } = await api.get(`/chat/${activeChatId}`);
      return data;
    },
    enabled: !!activeChatId,
  });

  // Create Chat Mutation
  const createChatMutation = useMutation({
    mutationFn: async (title?: string) => {
      const { data } = await api.post('/chat', { title });
      return data;
    },
    onSuccess: (newChat) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setActiveChatId(newChat._id);
      toast({ title: 'New chat started' });
    },
  });

  // Delete Chat Mutation
  const deleteChatMutation = useMutation({
    mutationFn: async (chatId: string) => {
      await api.delete(`/chat/${chatId}`);
    },
    onSuccess: (_, deletedChatId) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      if (activeChatId === deletedChatId) {
        setActiveChatId(null);
      }
      setIsDeleteOpen(false);
      toast({ title: 'Chat deleted' });
    },
    onError: () => {
      toast({ variant: 'destructive', title: 'Failed to delete chat' });
    }
  });

  // Rename Chat Mutation
  const renameChatMutation = useMutation({
    mutationFn: async ({ chatId, title }: { chatId: string, title: string }) => {
      await api.patch(`/chat/${chatId}`, { title });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      setIsRenameOpen(false);
      toast({ title: 'Chat renamed' });
    },
  });

  // Send Message Mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (payload: { chatId: string, content: string, attachments: Attachment[] }) => {
      const { data } = await api.post('/chat/message', payload);
      return data;
    },
    onMutate: async (payload) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['messages', activeChatId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData<Message[]>(['messages', activeChatId]);

      // Optimistically update to the new value
      if (previousMessages) {
        queryClient.setQueryData<Message[]>(['messages', activeChatId], [
          ...previousMessages,
          {
            _id: `temp-${Date.now()}`,
            chat: activeChatId!,
            sender: user?._id || '',
            content: payload.content,
            role: 'user',
            attachments: payload.attachments,
            createdAt: new Date().toISOString(),
          }
        ]);
      }

      // Clear input immediately for a responsive feel
      setInputText('');
      setPendingAttachments([]);

      return { previousMessages };
    },
    onError: (err, payload, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', activeChatId], context.previousMessages);
      }
      // Restore input text so the user doesn't lose it
      setInputText(payload.content);
      toast({ 
        variant: 'destructive', 
        title: 'Communication lost',
        description: 'Failed to sync with AI Node. Your message was restored.'
      });
    },
    onSettled: () => {
      // Always refetch after error or success to sync with the server's final data
      queryClient.invalidateQueries({ queryKey: ['messages', activeChatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    },
  });

  // AI Actions Mutations (Translate/Transcribe)
  const aiActionMutation = useMutation({
    mutationFn: async ({ action, payload }: { action: 'translate' | 'transcribe', payload: any }) => {
      const { data } = await api.post(`/chat/${action}`, payload);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'AI Action Complete',
        description: data.translatedText || data.transcription,
        duration: 10000,
      });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data } = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPendingAttachments([...pendingAttachments, data]);
      toast({ title: 'File uploaded successfully' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Upload failed' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputText.trim() && pendingAttachments.length === 0) || !activeChatId) return;

    sendMessageMutation.mutate({
      chatId: activeChatId,
      content: inputText,
      attachments: pendingAttachments,
    });
  };

  const getAttachmentIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="text-blue-400" size={16} />;
      case 'video': return <Video className="text-purple-400" size={16} />;
      case 'audio': return <Music className="text-green-400" size={16} />;
      default: return <FileText className="text-orange-400" size={16} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <ParticleField />
      
      {/* Sidebar - Chat History */}
      <aside className="w-80 glass border-r border-border/50 flex flex-col z-20">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <img src={tejaLogo} alt="Teja" className="h-8 w-auto" />
          <Button 
            onClick={() => createChatMutation.mutate(undefined)} 
            size="icon" 
            variant="ghost" 
            className="rounded-full hover:bg-primary/10 text-primary"
          >
            <Plus size={20} />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input 
              placeholder="Search chats..." 
              className="pl-10 bg-white/5 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50" 
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {chats.map((chat: Chat) => (
              <motion.div
                key={chat._id}
                whileHover={{ x: 5 }}
                onClick={() => setActiveChatId(chat._id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all flex items-start gap-3 group ${
                  activeChatId === chat._id ? 'bg-primary/20 shadow-lg shadow-primary/5' : 'hover:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-xl ${activeChatId === chat._id ? 'bg-primary/20' : 'bg-muted/10'}`}>
                  <MessageSquare size={18} className={activeChatId === chat._id ? 'text-primary' : 'text-muted-foreground'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${activeChatId === chat._id ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {chat.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate opacity-60">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${activeChatId === chat._id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-primary transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass border-white/10">
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChat(chat);
                          setEditTitle(chat.title);
                          setIsRenameOpen(true);
                        }}
                        className="focus:bg-primary/20 gap-2"
                      >
                        <FileText size={14} /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedChat(chat);
                          setIsDeleteOpen(true);
                        }}
                        className="focus:bg-destructive/10 text-destructive gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 border-t border-border/50 bg-black/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-hero-gradient p-[1px]">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center font-bold text-xs uppercase">
                {user?.name?.[0]}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{user?.name}</p>
              <p className="text-[10px] text-muted-foreground truncate uppercase tracking-tighter">Verified User</p>
            </div>
            <Button onClick={logout} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative z-20">
        {/* Navbar */}
        <header className="h-20 glass border-b border-border/50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="md:hidden">
               {/* Mobile menu trigger could go here */}
            </div>
            {activeChatId && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                <h2 className="text-lg font-bold">
                  {chats.find((c: Chat) => c._id === activeChatId)?.title || 'Current Session'}
                </h2>
              </motion.div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-[1px] bg-border/50 mx-2" />
            <Button variant="hero" size="sm" className="hidden sm:flex items-center gap-2">
              <Mic size={16} /> Voice Mode
            </Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-8">
          {!activeChatId ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-150" />
                <div className="w-32 h-32 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary shadow-2xl relative z-10">
                  <MessageSquare size={64} className="drop-shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                </div>
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-4xl font-black tracking-tight">
                  Teja: Your <span className="gradient-text">Intelligent</span> Workspace
                </h3>
                <p className="max-w-md mx-auto text-muted-foreground text-lg leading-relaxed font-medium">
                  Experience high-performance AI inference. Select a conversation or start a new one to begin.
                </p>
              </div>
              <Button 
                onClick={() => createChatMutation.mutate(undefined)} 
                variant="hero" 
                size="lg"
                className="px-10 py-8 text-xl rounded-2xl shadow-[0_20px_50px_rgba(var(--primary),0.2)] hover:shadow-[0_20px_50px_rgba(var(--primary),0.4)] transition-all relative z-10"
              >
                Start your first chat
              </Button>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-8">
              {messages.map((msg: Message) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col max-w-[80%] gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`p-6 rounded-3xl shadow-xl transition-all ${
                      msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'glass border border-white/10 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.attachments.map((att, index) => (
                            <div key={index} className="group relative rounded-xl overflow-hidden glass border border-white/20 p-2 flex items-center gap-2 hover:bg-white/10 transition-colors">
                              {getAttachmentIcon(att.fileType)}
                              <span className="text-xs truncate max-w-[120px]">{att.fileName}</span>
                              <a href={att.fileUrl} target="_blank" rel="noreferrer" className="absolute inset-0 z-10 opacity-0" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Message Meta / Actions */}
                    <div className="flex items-center gap-3 px-2">
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {msg.role === 'model' && (
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full text-muted-foreground hover:text-primary transition-colors"
                            onClick={() => aiActionMutation.mutate({ 
                              action: 'translate', 
                              payload: { text: msg.content, targetLanguage: 'Spanish' } 
                            })}
                          >
                            <Languages size={12} />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground">
                                <MoreVertical size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="glass border-white/10">
                              <DropdownMenuItem className="focus:bg-primary/20 gap-2">
                                <Languages size={14} /> Translate to Hindi
                              </DropdownMenuItem>
                              <DropdownMenuItem className="focus:bg-primary/20 gap-2">
                                <Languages size={14} /> Translate to French
                              </DropdownMenuItem>
                              {msg.attachments?.some(a => a.fileType === 'audio' || a.fileType === 'video') && (
                                <DropdownMenuItem 
                                  className="focus:bg-primary/20 gap-2 font-bold text-primary"
                                  onClick={() => {
                                    const att = msg.attachments?.find(a => a.fileType === 'audio' || a.fileType === 'video');
                                    if (att) aiActionMutation.mutate({ 
                                      action: 'transcribe', 
                                      payload: { fileUrl: att.fileUrl, fileType: att.fileType } 
                                    });
                                  }}
                                >
                                  <Mic size={14} /> Transcribe Media
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {sendMessageMutation.isPending && (
                <div className="flex justify-start">
                  <div className="glass border border-white/10 p-4 rounded-3xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={16} />
                    <span className="text-xs font-medium text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        {activeChatId && (
          <footer className="p-8">
            <div className="max-w-4xl mx-auto flex flex-col gap-4">
              {/* Pending Attachments Preview */}
              <AnimatePresence>
                {pendingAttachments.length > 0 && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {pendingAttachments.map((att, i) => (
                      <div key={i} className="glass rounded-xl p-2 flex items-center gap-2 border border-primary/30">
                        {getAttachmentIcon(att.fileType)}
                        <span className="text-xs font-medium max-w-[100px] truncate">{att.fileName}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-4 w-4 rounded-full" 
                          onClick={() => setPendingAttachments(pendingAttachments.filter((_, idx) => idx !== i))}
                        >
                          <X size={10} />
                        </Button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSendMessage} className="relative group">
                <div className="absolute left-4 bottom-4 flex items-center gap-2">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className={`rounded-full hover:bg-primary/10 transition-colors ${isUploading ? 'animate-pulse' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <Loader2 className="animate-spin" size={20} /> : <Paperclip size={20} />}
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileUpload} 
                  />
                </div>
                
                <textarea
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask anything or upload media..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-16 pr-16 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none max-h-40 min-h-[56px] transition-all scrollbar-hide text-sm overflow-y-auto"
                />

                <div className="absolute right-4 bottom-4">
                  <Button 
                    type="submit" 
                    disabled={(!inputText.trim() && pendingAttachments.length === 0) || sendMessageMutation.isPending}
                    size="icon" 
                    className="rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-accent transition-all active:scale-95"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </form>
              <p className="text-[10px] text-center text-muted-foreground/50 font-medium">
                Teja AI can make mistakes. Check important info. High-performance inference enabled.
              </p>
            </div>
          </footer>
        )}
      </main>

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="glass border-white/10 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Rename <span className="gradient-text">Chat</span></DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter new chat title..."
              className="bg-white/5 border-white/10 py-6 text-lg focus-visible:ring-primary h-14"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && editTitle.trim()) {
                  renameChatMutation.mutate({ chatId: selectedChat?._id || '', title: editTitle });
                }
              }}
            />
          </div>
          <DialogFooter className="sm:justify-between gap-4">
            <Button variant="ghost" className="flex-1 py-6 h-14" onClick={() => setIsRenameOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-primary text-white py-6 h-14 font-black"
              disabled={!editTitle.trim() || renameChatMutation.isPending}
              onClick={() => {
                if (editTitle.trim() && selectedChat) {
                  renameChatMutation.mutate({ chatId: selectedChat._id, title: editTitle });
                }
              }}
            >
              {renameChatMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent className="glass border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-destructive">Wait a <span className="text-foreground">minute!</span></AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground text-lg pt-4 leading-relaxed font-medium">
              Are you absoluteley sure? This will permanently delete your conversation with <span className="text-foreground font-black">"{selectedChat?.title}"</span> and all its message history. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-8 flex sm:flex-row flex-col gap-4">
            <AlertDialogCancel asChild>
              <Button variant="ghost" className="flex-1 py-6 h-14">
                Keep Chat
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                variant="destructive" 
                className="flex-1 py-6 h-14 font-black shadow-lg shadow-destructive/20"
                onClick={() => {
                  if (selectedChat) deleteChatMutation.mutate(selectedChat._id);
                }}
                disabled={deleteChatMutation.isPending}
              >
                {deleteChatMutation.isPending ? 'Deleting...' : 'Yes, Delete it'}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserDashboard;
