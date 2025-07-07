import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../hooks/useSocket';

const ChatPopup = ({ isOpen, onClose, userType, userId, userName }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (socket && isOpen) {
      // Request chat history when opening
      socket.emit('requestChatHistory');

      // Listen for new messages
      const handleNewMessage = message => {
        setMessages(prev => [...prev, message]);
      };

      // Listen for chat history
      const handleChatHistory = history => {
        setMessages(history);
      };

      // Listen for message removal events
      const handleRemoveMessages = ({ senderId }) => {
        setMessages(prev => prev.filter(msg => msg.senderId !== senderId));
      };

      socket.on('newChatMessage', handleNewMessage);
      socket.on('chatHistory', handleChatHistory);
      socket.on('removeUserMessages', handleRemoveMessages);

      return () => {
        socket.off('newChatMessage', handleNewMessage);
        socket.off('chatHistory', handleChatHistory);
        socket.off('removeUserMessages', handleRemoveMessages);
      };
    }
  }, [socket, isOpen]);

  const handleSend = () => {
    if (newMessage.trim() && socket) {
      const messageData = {
        senderType: userType,
        senderId: userId,
        senderName: userName,
        message: newMessage.trim(),
      };

      // Send message via socket
      socket.emit('sendChatMessage', messageData);
      setNewMessage('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    if (socket && userId) {
      socket.emit('logout', userId);
      isOpen = false; 
      onClose(); 
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl z-50 transition-all duration-300 ${
        !isOpen ? 'hidden' : 'block'
      }`}
    >
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Live Chat</h3>
        <div>
          <button
            onClick={handleLogout}
            className="text-white hover:text-gray-200 mr-3 text-sm"
            title="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 inline mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="h-64 overflow-y-auto p-3 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map(msg => {
            // Check if message is from current user
            const isCurrentUser =
              msg.senderType === userType && msg.senderId === userId;

            return (
              <div
                key={msg._id || msg.id}
                className={`mb-3 flex ${
                  isCurrentUser ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 relative ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {/* Sender name for other users */}
                  {!isCurrentUser && (
                    <div className="font-semibold text-xs text-purple-600 mb-1">
                      {msg.senderName}
                    </div>
                  )}

                  {/* Message content */}
                  <div className="text-sm">{msg.message}</div>

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] mt-1 text-right ${
                      isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>

                  {/* Tail indicator */}
                  <div
                    className={`absolute bottom-0 w-3 h-3 ${
                      isCurrentUser
                        ? '-right-3 bg-gradient-to-r from-blue-500 to-purple-500'
                        : '-left-3 bg-white'
                    }`}
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 100%)',
                      transform: isCurrentUser ? 'none' : 'scaleX(-1)',
                    }}
                  ></div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-2xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
