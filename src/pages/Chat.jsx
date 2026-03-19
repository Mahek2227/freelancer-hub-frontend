import React, { useState, useEffect, useRef } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000); // Polling every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      // Mock conversations for now
      const mockConversations = [
        {
          id: '1',
          participantId: '507f1f77bcf86cd799439011',
          participantName: 'John Doe',
          participantAvatar: 'https://via.placeholder.com/40',
          lastMessage: 'Sounds good! Let me start working on it.',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
          unread: 2,
        },
        {
          id: '2',
          participantId: '507f1f77bcf86cd799439012',
          participantName: 'Jane Smith',
          participantAvatar: 'https://via.placeholder.com/40',
          lastMessage: 'When can you deliver the first version?',
          lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
          unread: 0,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedConversation) return;
    try {
      const token = localStorage.getItem('token');
      // Mock messages
      const mockMessages = [
        {
          id: '1',
          senderId: selectedConversation.participantId,
          senderName: selectedConversation.participantName,
          text: 'Hi! I am interested in your project.',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        },
        {
          id: '2',
          senderId: user._id,
          senderName: user.name,
          text: 'Great! Can you start this week?',
          timestamp: new Date(Date.now() - 23 * 60 * 60 * 1000),
        },
        {
          id: '3',
          senderId: selectedConversation.participantId,
          senderName: selectedConversation.participantName,
          text: 'Sounds good! Let me start working on it.',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      senderId: user._id,
      senderName: user.name,
      text: messageText,
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessageText('');

    try {
      const token = localStorage.getItem('token');
      // This would send to backend
      // await axios.post(
      //   `http://localhost:5000/api/messages`,
      //   {
      //     conversationId: selectedConversation.id,
      //     text: messageText,
      //   },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-full sm:w-80 bg-white border-r flex flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-600">
              <p>No conversations yet</p>
            </div>
          ) : (
            <div>
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`w-full p-4 border-b hover:bg-gray-50 transition text-left ${
                    selectedConversation?.id === conv.id ? 'bg-indigo-50 border-l-4 border-l-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900">{conv.participantName}</h3>
                        <span className="text-xs text-gray-500">
                          {conv.lastMessageTime.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                      {conv.unread > 0 && (
                        <span className="inline-block mt-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">
                          {conv.unread} new
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="hidden sm:flex flex-1 flex-col bg-white">
          {/* Header */}
          <div className="p-6 border-b flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3">
              <img
                src={selectedConversation.participantAvatar}
                alt={selectedConversation.participantName}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <h2 className="font-semibold text-gray-900">
                  {selectedConversation.participantName}
                </h2>
                <p className="text-xs text-gray-600">Active now</p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/profile/${selectedConversation.participantId}`)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              View Profile
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user._id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-4 py-3 rounded-2xl ${
                    message.senderId === user._id
                      ? 'bg-indigo-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.senderId === user._id ? 'text-indigo-100' : 'text-gray-600'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="px-6 py-3 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden sm:flex flex-1 items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-gray-600">Select a conversation to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
}
