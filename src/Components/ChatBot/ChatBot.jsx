import React, { useState, useEffect, useRef } from "react";
import {
  Bot,
  BotMessageSquare,
  Send,
  UserRound,
  X,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import useChatBot from "@hooks/useChatbot";
import { supabase } from "../../Config/Supabase";

export default function Chatbot() {
  const {
    isOpen,
    toggleModal,
    messages,
    inputValue,
    setInputValue,
    handleSubmit,
    isTyping,
    messagesEndRef,
  } = useChatBot();

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Fetch specialties from Supabase
  const fetchSpecialties = async () => {
    try {
      const { data, error } = await supabase
        .from("Specialties")
        .select("specialty")
        .order("specialty");

      if (error) throw error;
      setSpecialties(data?.map((s) => s.specialty) || []);
    } catch (err) {
      console.error("Error fetching specialties:", err.message);
      setSpecialties([]);
    }
  };

  // Load specialties when component mounts
  useEffect(() => {
    fetchSpecialties();
  }, []);

  // Updated specialty extraction function
  const extractSpecialty = (message) => {
    if (!message || !specialties.length) return null;

    // Convert message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase();

    // Find the first matching specialty
    const found = specialties.find((specialty) =>
      lowerMessage.includes(specialty.toLowerCase())
    );

    return found || null;
  };

  // Updated fetchDoctors function
  const fetchDoctors = async (message) => {
    try {
      const specialty = extractSpecialty(message);

      if (!specialty) {
        console.log("No specialty found in message");
        return;
      }

      console.log("Searching for specialty:", specialty);

      const { data, error } = await supabase
        .from("Doctors")
        .select("id, first_name, last_name, image, specialty, rate")
        .ilike("specialty", `%${specialty}%`)
        .order("rate", { ascending: false }) // Sort by highest rate first
        .limit(4);

      if (error) throw error;
      setDoctors(data || []);
      console.log("Doctors fetched:", data);
    } catch (err) {
      console.error("Error fetching doctors:", err.message);
      setDoctors([]);
    }
  };

  // Updated useEffect to handle AI messages
  useEffect(() => {
    if (!Array.isArray(messages) || messages.length === 0) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.sender === "ai") {
      try {
        let messageContent;
        if (typeof lastMessage.content === "string") {
          const parsed = JSON.parse(lastMessage.content);
          messageContent = parsed.message;
        } else {
          messageContent = lastMessage.content.message;
        }

        if (messageContent) {
          console.log("Processing AI message:", messageContent);
          fetchDoctors(messageContent);
        }
      } catch (e) {
        // If JSON parsing fails, try to use the content directly
        if (lastMessage.content) {
          console.log("Processing raw message:", lastMessage.content);
          fetchDoctors(lastMessage.content);
        }
      }
    }
  }, [messages]);

  const formatMessage = (content) => {
    try {
      let cleaned = content
        .replace(/^"+|"+$/g, "")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, " ")
        .trim();

      if (cleaned.startsWith("{") && cleaned.endsWith("}")) {
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
      {/* Floating Button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium border-none rounded-full w-14 h-14 sm:w-16 sm:h-16 bg-[#11319E] hover:bg-[#0e2a85] cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-300 p-0 z-50"
        onClick={toggleModal}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        type="button"
      >
        {isOpen ? (
          <X className="text-white w-6 h-6" aria-hidden="true" />
        ) : (
          <BotMessageSquare className="text-white w-6 h-6" aria-hidden="true" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white p-0 rounded-xl border border-gray-200 w-[90vw] sm:w-[95vw] md:w-[500px] h-[60vh] sm:h-[65vh] md:h-[70vh] min-h-[400px] max-h-[650px] shadow-2xl z-50 transition-all duration-300 overflow-hidden outline-0">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#11319E] to-[#2a43a0] p-5 rounded-t-xl">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-white" />
              <div>
                <h2 className="font-semibold text-lg tracking-tight text-white">
                  Delma Medical Bot
                </h2>
                <p className="text-sm text-gray-200 leading-3 mt-1">
                  Your AI healthcare assistant
                </p>
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="pr-2 h-[calc(100%-180px)] overflow-y-auto mt-20 mb-4 px-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 my-4 text-gray-700 text-sm sm:text-base ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "ai" && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 mt-1">
                    <div className="rounded-full bg-[#eef2ff] border border-[#11319E]/20 p-1.5">
                      <Bot className="h-5 w-5 text-[#11319E]" />
                    </div>
                  </span>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 max-w-[85%] ${
                    message.sender === "ai"
                      ? "bg-gray-200 text-[#00155D]"
                      : "bg-[#11319E] text-white"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {formatMessage(message.content)}
                  </p>
                </div>

                {message.sender === "user" && (
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8 mt-1">
                    <div className="rounded-full bg-[#11319E]/10 border border-[#11319E]/20 p-1.5">
                      <UserRound className="h-5 w-5 text-[#11319E]" />
                    </div>
                  </span>
                )}
              </div>
            ))}

            {/* Doctor Suggestions Grid */}
            {doctors.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Recommended Doctors:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {doctors.map((doc, idx) => (
                    <Link
                      to={`/find_doctor/${doc.id}`}
                      key={idx}
                      className="flex items-center p-2 bg-white border border-gray-100 rounded-lg hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden border-2 border-blue-50 mr-3">
                        <img
                          src={doc.image || "default-doctor-avatar.png"}
                          alt={`${doc.first_name} ${doc.last_name}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium text-[#11319E] text-sm truncate group-hover:text-blue-700 transition-colors">
                          Dr. {doc.first_name} {doc.last_name}
                        </h3>
                        <p className="text-xs text-gray-600 truncate">
                          {doc.specialty}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className="text-amber-500 text-xs">★</span>
                          <span className="ml-1 text-xs font-medium">
                            {doc.rate}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Typing Indicator */}
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

          {/* Input Form */}
          <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
            <form
              className="flex items-center gap-3 w-full"
              onSubmit={handleSubmit}
            >
              <input
                className="flex h-12 w-full rounded-full border border-gray-300 px-5 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#11319E] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 text-gray-900"
                placeholder="Describe your symptoms or ask a question..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-full text-sm font-medium text-white disabled:opacity-50 bg-[#11319E] hover:bg-[#0e2a85] h-12 w-12 transition-colors duration-200 shadow-md"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}