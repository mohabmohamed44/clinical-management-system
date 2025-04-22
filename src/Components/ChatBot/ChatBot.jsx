import React from 'react';
import { Bot, BotMessageSquare, Send, UserRound, X } from 'lucide-react';
import useChatBot from '../../hooks/useChatbot';

export default function Chatbot() {
  const {
    isOpen,
    toggleModal,
    messages,
    inputValue,
    setInputValue,
    handleSubmit,
    isTyping,
    messagesEndRef
  } = useChatBot();

  const formatMessage = (content) => {
    try {
      // Handle multiple levels of encoding
      let cleaned = content
        .replace(/^"+|"+$/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, ' ')
        .trim();
  
      // Check if content is a JSON string
      if (cleaned.startsWith('{') && cleaned.endsWith('}')) {
        const parsed = JSON.parse(cleaned);
        return parsed.message || content;
      }
      return content;
    } catch (e) {
      return content;
    }
  };

  return (
    <>
      <button
        className="fixed bottom-6 right-6 inline-flex items-center justify-center text-sm font-medium border-none rounded-full w-16 h-16 bg-[#11319E] hover:bg-[#0e2a85] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 p-0 z-50"
        onClick={toggleModal}
        aria-expanded={isOpen}
        type="button"
      >
        {isOpen ? <X className="text-white w-6 h-6" /> : <BotMessageSquare className="text-white w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-0 mr-4 bg-white p-0 rounded-xl border border-gray-200 w-[95vw] max-w-[500px] h-[70vh] min-h-[500px] max-h-[700px] shadow-2xl z-50 transition-all duration-300 overflow-hidden outline-0">
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#11319E] to-[#2a43a0] p-5 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-white" />
              <div>
                <h2 className="font-semibold text-lg tracking-tight text-white">Delma Medical Bot</h2>
                <p className="text-sm text-gray-200 leading-3 mt-1">Your AI healthcare assistant</p>
              </div>
            </div>
          </div>

          <div className="pr-2 h-[calc(100%-150px)] overflow-y-auto mt-20 mb-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex gap-3 my-4 text-gray-700 text-sm sm:text-base ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 mt-1">
                    <div className="rounded-full bg-[#eef2ff] border border-[#11319E]/20 p-1.5">
                      <Bot className="h-5 w-5 text-[#11319E]" />
                    </div>
                  </span>
                )}
                
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                  message.sender === 'ai' 
                    ? 'bg-gray-200 text-gray-800' 
                    : 'bg-[#11319E] text-white'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {formatMessage(message.content)}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 mt-1">
                    <div className="rounded-full bg-[#11319E]/10 border border-[#11319E]/20 p-1.5">
                      <UserRound className="h-5 w-5 text-[#11319E]" />
                    </div>
                  </span>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 my-4">
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 mt-1">
                  <div className="rounded-full bg-[#eef2ff] border border-[#11319E]/20 p-1.5">
                    <Bot className="h-5 w-5 text-[#11319E] animate-pulse" />
                  </div>
                </span>
                <div className="rounded-2xl px-4 py-3 bg-gray-50">
                  <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
            <form className="flex items-center gap-3 w-full" onSubmit={handleSubmit}>
              <input
                className="flex h-12 w-full rounded-full border border-gray-300 px-5 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#11319E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                placeholder="Describe your symptoms or ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-full text-sm font-medium text-white disabled:opacity-50 bg-[#11319E] hover:bg-[#0e2a85] h-12 w-12 transition-colors duration-200 shadow-md"
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