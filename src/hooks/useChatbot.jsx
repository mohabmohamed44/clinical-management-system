import { useState, useEffect, useRef } from 'react';
import useModal from './useModal';

/**
 * Custom hook for ChatBot functionality
 * @returns {Object} ChatBot state and functions
 */
export default function useChatBot() {
  const { isOpen, openModal, closeModal, toggleModal } = useModal(false);
  const messagesEndRef = useRef(null);
  
  const [messages, setMessages] = useState([
    { sender: 'ai', content: 'Hi, how can I help you today?' }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage = { sender: 'user', content: inputValue.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate AI typing
    setIsTyping(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          content: 'Thank you for your message. Our team will get back to you shortly.' 
        }
      ]);
    }, 1500);
  };

  const clearChat = () => {
    setMessages([
      { sender: 'ai', content: 'Hi, how can I help you today?' }
    ]);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    toggleModal,
    messages,
    inputValue,
    setInputValue,
    handleSubmit,
    clearChat,
    isTyping,
    messagesEndRef
  };
};