import { useState, useEffect, useRef } from 'react';
import useModal from './useModal';
import { getMedicalBotResponse, resetMedicalBotConversation } from '../utils/GeminiConfig';

export default function useChatBot() {
  const { isOpen, openModal, closeModal, toggleModal } = useModal(false);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { sender: 'ai', content: '{"type": "Message", "message": "Hello! Delma here, ready to assist with your health concerns."}' }
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
      { sender: 'ai', content: '{"type": "Message", "message": "Hello! Delma here, ready to assist with your health concerns."}' }
    ]);
    resetMedicalBotConversation();
    setQuestionCount(0);
  };

  const cleanJsonResponse = (jsonString) => {
    try {
      // Step 1: Basic cleaning
      let cleaned = jsonString
        .replace(/^"+|"+$/g, '') // Remove surrounding quotes
        .replace(/\\"/g, '"')     // Unescape quotes
        .replace(/\\n/g, ' ')     // Replace newlines
        .replace(/\\\\/g, '\\')   // Unescape backslashes
        .trim();
  
      // Step 2: Remove JSON markdown formatting if present
      cleaned = cleaned.replace(/```json/g, '').replace(/```/g, '').trim();
  
      // Step 3: Handle multiple nested JSON strings
      let parseAttempts = 0;
      while (parseAttempts < 3) {
        try {
          return JSON.parse(cleaned);
        } catch (innerError) {
          // If parsing fails, check for nested stringification
          if (cleaned.startsWith('{') && cleaned.endsWith('}')) break;
          cleaned = cleaned.replace(/^"{/, '{').replace(/}"$/, '}');
          parseAttempts++;
        }
      }
  
      // Step 4: Validate JSON structure
      if (!/^\s*\{.*\}\s*$/.test(cleaned)) {
        throw new Error('Invalid JSON structure');
      }
  
      // Step 5: Final parse attempt with error positions
      const json = JSON.parse(cleaned);
      
      // Step 6: Validate required fields
      if (!json.type || !json.message) {
        throw new Error('Missing required fields');
      }
  
      return json;
    } catch (e) {
      console.error('JSON parsing error:', e);
      console.log('Original string:', jsonString);
      console.log('Cleaned string:', cleaned);
      
      // Fallback: Extract message content
      const messageMatch = jsonString.match(/"message":\s*"([^"]+)"/);
      const fallbackMessage = messageMatch 
        ? messageMatch[1].replace(/\\"/g, '"')
        : 'I encountered an error processing your request';
  
      return {
        type: "Message",
        message: fallbackMessage
      };
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