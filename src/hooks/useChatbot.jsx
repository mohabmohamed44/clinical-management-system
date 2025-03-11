import { useState } from "react";

export default function useChatbot() {
    const [messages, setMessages] = useState([
        {role: 'bot', text: "Hello !, I am Delma Chatbot how Can I help you?"}
    ])

    const sendMessages = (text) =>  {
        const userMessage = {role: "user", text};
        setMessages((prev) => [...prev, userMessage]);

        const botResponse =  {
            role: 'bot',
            text: text.toLowerCase().includes("hello") ? "Hi there!" : "I am a medical Chatbot..."
        }

        setTimeout(() => {
            setMessages((prev) => [...prev, botResponse]);
        }, 1000);
    }
    return {messages, sendMessages};
}