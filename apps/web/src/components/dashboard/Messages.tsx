'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Search, Send, Paperclip, Smile, MoreVertical, MessageCircle, Plus, X, UserPlus, File, Image as ImageIcon } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { chatApi } from '@/lib/api/chat';
import { usersApi } from '@/lib/api/users';
import { uploadApi } from '@/lib/api/upload';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

export function Messages() {
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      
      // Join chat room via socket
      if (socket && isConnected) {
        socket.emit('join-chat', selectedChat.id);
      }
    }
  }, [selectedChat?.id, socket, isConnected]);

  useEffect(() => {
    // Listen for new messages
    if (socket) {
      socket.on('new-message', (message: any) => {
        if (message.chatId === selectedChat?.id) {
          setMessages(prev => [...prev, message]);
          scrollToBottom();
        }
      });

      return () => {
        socket.off('new-message');
      };
    }
  }, [socket, selectedChat?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const data = await chatApi.getConversations();
      setConversations(data || []);
      if (data && data.length > 0) {
        setSelectedChat(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      // Use mock data if API fails
      setConversations(getMockConversations());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const data = await chatApi.getMessages(chatId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages(getMockMessages());
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    setIsSending(true);
    
    try {
      const message = await chatApi.sendMessage({
        chatId: selectedChat.id,
        content: newMessage,
        type: 'TEXT',
      });
      
      // Add message to local state (socket will also broadcast it)
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Emit via socket for real-time
      if (socket && isConnected) {
        socket.emit('send-message', {
          chatId: selectedChat.id,
          content: newMessage,
          senderId: user?.id,
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setIsUploadingFile(true);
    try {
      // Upload file
      const uploadResult = await uploadApi.uploadFile(file);
      
      // Send message with file
      const message = await chatApi.sendMessage({
        chatId: selectedChat.id,
        content: `📎 ${file.name}`,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
      });

      // Update message with file info
      const messageWithFile = {
        ...message,
        fileUrl: uploadResult.url,
        fileName: file.name,
        fileSize: file.size,
      };

      setMessages(prev => [...prev, messageWithFile]);
      toast.success(`File sent (${uploadResult.tokenCost} tokens used)`);
      
      // Emit via socket
      if (socket && isConnected) {
        socket.emit('send-message', {
          chatId: selectedChat.id,
          content: `📎 ${file.name}`,
          senderId: user?.id,
          fileUrl: uploadResult.url,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setIsUploadingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex bg-white rounded-2xl shadow-premium overflow-hidden">
      {/* Chat List */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
              <MessageCircle className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-center">No conversations yet</p>
              <p className="text-sm text-center mt-1">Start chatting with other users!</p>
            </div>
          ) : (
            conversations.map((chat) => (
              <motion.button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                whileHover={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                className={`w-full p-4 text-left border-b border-gray-100 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-gold-50 border-gold-200' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {chat.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    {chat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(chat.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  
                  {chat.unread > 0 && (
                    <div className="w-5 h-5 bg-gold-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {selectedChat.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{selectedChat.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedChat.online ? (
                    <span className="text-emerald-500">Online</span>
                  ) : (
                    'Last seen recently'
                  )}
                </p>
              </div>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <motion.div
                key={message.id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.senderId === user?.id || message.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md rounded-2xl overflow-hidden ${
                  message.senderId === user?.id || message.sender?.id === user?.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {/* File/Image attachment */}
                  {message.fileUrl && (
                    <div className="p-2">
                      {message.type === 'IMAGE' || message.fileUrl?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img
                          src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${message.fileUrl}`}
                          alt="Shared image"
                          className="rounded-lg max-h-48 w-full object-cover cursor-pointer hover:opacity-90"
                          onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${message.fileUrl}`, '_blank')}
                        />
                      ) : (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:3001'}${message.fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 p-2 rounded-lg ${
                            message.senderId === user?.id || message.sender?.id === user?.id
                              ? 'bg-white/20 hover:bg-white/30'
                              : 'bg-gray-200 hover:bg-gray-300'
                          }`}
                        >
                          <File className="w-5 h-5" />
                          <span className="text-sm truncate">{message.fileName || 'Download file'}</span>
                        </a>
                      )}
                    </div>
                  )}
                  {/* Message content */}
                  <div className="px-4 py-2">
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === user?.id || message.sender?.id === user?.id ? 'text-gold-100' : 'text-gray-500'
                    }`}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex items-end gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingFile}
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isUploadingFile ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Paperclip className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none outline-none text-sm"
                    disabled={isUploadingFile}
                  />
                  
                  <button
                    type="button"
                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Smile className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                {isUploadingFile && (
                  <p className="text-xs text-gold-600 mt-1 ml-2">Uploading file...</p>
                )}
              </div>
              
              <motion.button
                type="submit"
                disabled={!newMessage.trim() || isSending || isUploadingFile}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSending ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </motion.button>
            </form>
            
            {/* Connection Status */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Reconnecting...'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Select a conversation</p>
            <p className="text-sm">Choose a chat from the list to start messaging</p>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onStartChat={async (userId: string) => {
            try {
              const chat = await chatApi.startConversation(userId);
              setShowNewChatModal(false);
              await fetchConversations();
              // Find and select the new chat
              const newChat = {
                id: chat.id,
                name: chat.participants?.find((p: any) => p.userId !== user?.id)?.user?.name || 'New Chat',
              };
              setSelectedChat(newChat);
            } catch (error) {
              toast.error('Failed to start conversation');
            }
          }}
          currentUserId={user?.id}
        />
      )}
    </div>
  );
}

// Mock data fallback
function getMockConversations() {
  return [
    {
      id: '1',
      name: 'Sarah Johnson',
      lastMessage: 'Thanks for the insurance advice!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      unread: 2,
      online: true,
    },
    {
      id: '2',
      name: 'Michael Chen',
      lastMessage: 'Can we discuss the policy details?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      unread: 0,
      online: false,
    },
  ];
}

function getMockMessages() {
  return [
    {
      id: '1',
      content: 'Hi! I have a question about auto insurance coverage.',
      senderId: '2',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      content: 'Of course! I\'d be happy to help. What specific aspect would you like to know about?',
      senderId: '1',
      createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      content: 'I\'m particularly interested in comprehensive coverage options.',
      senderId: '2',
      createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
    },
  ];
}

function NewChatModal({ 
  onClose, 
  onStartChat, 
  currentUserId 
}: { 
  onClose: () => void; 
  onStartChat: (userId: string) => void;
  currentUserId?: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) return;
    
    setIsSearching(true);
    try {
      const data = await usersApi.searchUsers(searchQuery);
      // Filter out current user
      setUsers(data.users?.filter((u: any) => u.id !== currentUserId) || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">New Conversation</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              autoFocus
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {isSearching ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">
                  {searchQuery.length < 2 
                    ? 'Type at least 2 characters to search' 
                    : 'No users found'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => onStartChat(user.id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}