import React, { useState, useRef, useEffect } from 'react';
import { Bot, BotMessageSquare, MessageSquare, Send, UserRound, X } from 'lucide-react';
import useModal from '../../hooks/useModal';
import { FaUserMd } from 'react-icons/fa';

export default function Chatbot() {
  const { isOpen, toggleModal } = useModal(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hi, how can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { sender: 'user', content: inputValue }];
    setMessages(newMessages);
    setInputValue('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          sender: 'ai', 
          content: 'Thank you for your message. Our team will get back to you shortly.' 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border-none rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-[#11319E] hover:bg-[#0e2a85] cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 p-0 z-50"
        onClick={toggleModal}
        aria-expanded={isOpen}
        type="button"
      >
        {isOpen ? (
          <X className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <BotMessageSquare className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-[calc(3rem+1rem)] right-0 mr-4 bg-white p-4 rounded-xl border border-gray-100 w-[90vw] max-w-[390px] h-[400px] shadow-xl z-50 transition-all duration-300 overflow-hidden">
          {/* Heading with gradient background */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#11319E] to-[#2a43a0] p-4 rounded-t-xl">
            <h2 className="font-semibold text-base tracking-tight text-white">Delma Chatbot</h2>
            <p className="text-xs text-gray-200 leading-3 mt-1">How can we help you today?</p>
          </div>

          {/* Chat Container - adjusted for header space */}
          <div className="pr-2 h-[290px] overflow-y-auto mt-16 mb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-2 my-3 text-gray-600 text-xs sm:text-sm ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-7 h-7 sm:w-7 sm:h-7">
                    <div className="rounded-full bg-[#eef2ff] border border-[#11319E]/20 p-1">
                      <Bot className="h-4 w-4 text-[#11319E]" />
                    </div>
                  </span>
                )}
                
                <div className={`rounded-2xl px-3 py-2 max-w-[80%] ${
                  message.sender === 'ai' 
                    ? 'bg-gray-100 text-gray-800' 
                    : 'bg-[#11319E] text-white'
                }`}>
                  <p className="leading-relaxed">
                    {message.content}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-6 h-6 sm:w-7 sm:h-7">
                    <div className="rounded-full bg-[#11319E]/10 border border-[#11319E]/20 p-1">
                      <UserRound className="h-4 w-4 text-[#11319E]" />
                    </div>
                  </span>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input box - positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-gray-100">
            <form className="flex items-center justify-center w-full space-x-2" onSubmit={handleSubmit}>
              <input
                className="flex h-9 w-full rounded-full border border-gray-200 px-4 py-1 text-xs sm:text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#11319E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-3xl text-xs font-medium text-white disabled:opacity-50 bg-[#11319E] hover:bg-[#0e2a85] h-10 w-10 transition-colors duration-200"
              >
                <Send className="h-5 w-5"/>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}