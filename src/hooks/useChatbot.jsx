import { useState, useEffect, useRef } from 'react';
import useModal from './useModal';
import { useTranslation } from 'react-i18next';
import { getMedicalBotResponse, resetMedicalBotConversation } from '../utils/GeminiConfig';
export default function useChatBot() {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal, toggleModal } = useModal(false);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { sender: 'ai', content: JSON.stringify({ type: "Message", message: t("ChatbotMessage") }) }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isOpen) resetConversation();
  }, [isOpen]);

  const resetConversation = () => {
    setMessages([
      { sender: 'ai', content: JSON.stringify({ type: "Message", message: t("ChatbotMessage") }) }
    ]);
    resetMedicalBotConversation();
    setQuestionCount(0);
  };

  const cleanJsonResponse = (jsonString) => {
    // Early safety check
    if (!jsonString || typeof jsonString !== 'string') {
      return { type: "Message", message: "I encountered an error processing your request" };
    }

    let cleaned = '';
    try {
      // Step 1: Basic cleaning and remove potential markdown code blocks
      cleaned = jsonString
        .replace(/```json|```/g, '') // Remove markdown code blocks
        .trim();
      
      // Try to detect if we're dealing with escaped JSON within JSON
      if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
        try {
          // This might be a JSON string inside another JSON string
          cleaned = JSON.parse(cleaned);
        } catch (e) {
          // Not a valid JSON string, continue with original
        }
      }
      
      // Additional cleaning if still a string
      if (typeof cleaned === 'string') {
        cleaned = cleaned
          .replace(/\\"/g, '"')     // Unescape quotes
          .replace(/\\n/g, ' ')     // Replace newlines
          .replace(/\\\\/g, '\\');  // Unescape backslashes
      }

      // Now parse the cleaned string if it's still a string
      let parsedJson;
      if (typeof cleaned === 'string') {
        try {
          parsedJson = JSON.parse(cleaned);
        } catch (e) {
          // If parsing fails, this might be a plain message, not JSON
          return {
            type: "Message",
            message: cleaned || "I encountered an error processing your request"
          };
        }
      } else {
        // If cleaned is already an object (from earlier parsing)
        parsedJson = cleaned;
      }

      // Validate required fields
      if (parsedJson && parsedJson.type && parsedJson.message) {
        return parsedJson;
      } else if (parsedJson) {
        // If we have valid JSON but missing required fields
        return {
          type: "Message",
          message: JSON.stringify(parsedJson)
        };
      } else {
        throw new Error('Invalid JSON structure');
      }
    } catch (e) {
      console.error('JSON parsing error:', e);
      
      // Fallback: Try to extract message content using regex
      try {
        // First attempt: Look for message in JSON format
        const messageMatch = typeof cleaned === 'string' && cleaned.match(/"message"\s*:\s*"([^"]+)"/);
        if (messageMatch) {
          return {
            type: "Message",
            message: messageMatch[1].replace(/\\"/g, '"')
          };
        }
        
        // Return cleaned string as message if it's not empty
        if (cleaned && typeof cleaned === 'string' && cleaned.trim().length > 0) {
          return {
            type: "Message",
            message: cleaned.trim()
          };
        }
        
        // Final fallback
        return {
          type: "Message",
          message: "I encountered an error processing your request"
        };
      } catch (fallbackError) {
        return {
          type: "Message",
          message: "I encountered an error processing your request"
        };
      }
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = { sender: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      const rawResponse = await getMedicalBotResponse(inputValue.trim());
      // Safety check for rawResponse
      if (!rawResponse) throw new Error("Empty response received");
      
      const parsedResponse = cleanJsonResponse(rawResponse);
      
      if (parsedResponse.type === "Question") {
        setQuestionCount(prev => prev + 1);
      }
      
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        content: JSON.stringify(parsedResponse)
      }]);
      
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { 
        sender: 'ai', 
        content: JSON.stringify({
          type: "Message",
          message: "Sorry, I encountered an error. Please try again."
        })
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return {
    isOpen,
    toggleModal,
    messages,
    inputValue,
    setInputValue,
    handleSubmit,
    isTyping,
    messagesEndRef,
    questionCount
  };
}