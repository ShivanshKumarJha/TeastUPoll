import React, { useState } from 'react';

const ChatPopup = ({ isOpen, onClose, userType }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: userType,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  return (
    <div
      className={`fixed bottom-6 right-6 w-80 bg-white rounded-lg shadow-xl z-50 ${
        !isOpen && 'hidden'
      }`}
    >
      <div className="bg-blue-600 text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-bold">Live Chat</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>

      <div className="h-64 overflow-y-auto p-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No messages yet</p>
        ) : (
          messages.map(msg => (
            <div
              key={msg.id}
              className={`mb-3 ${msg.sender === userType ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block p-2 rounded-lg max-w-xs ${
                  msg.sender === userType
                    ? 'bg-blue-100 text-blue-900 rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t flex">
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyPress={e => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
