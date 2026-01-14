'use client'

import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface QAItem {
  keywords: string[];
  response: string;
}

interface QADatabase {
  [key: string]: QAItem;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      text: "Hello! Welcome to TrueNorth Materials. Humanity advances with materials, and we are here to help you accelerate that future.\n\nAsk me about our Marketplace, or meet our AI Employees, Max and Colette.", 
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced Q&A database for Marketplace & AI Agents
  const qaDatabase: QADatabase = {
    'marketplace': {
      keywords: ['marketplace', 'buy', 'shop', 'store', 'platform', 'what is truenorth', 'what do you do'],
      response: "**The Advanced Materials Marketplace:**\n\nTrueNorth Materials is the premier marketplace for advanced materials. We bridge the gap between material science innovations and industrial adoption.\n\nOur platform supports the adoption of advanced materials because we believe **humanity advances with materials**.\n\nWe connect suppliers of cutting-edge materials with the industries that need them to build the future."
    },
    'max': {
      keywords: ['max', 'market analysis', 'analysis agent'],
      response: "**Meet Max - Market Analysis Agent:**\n\nMax is one of our AI employees. He specializes in:\n• Analyzing advanced materials against market demand\n• Mapping materials to industries and applications\n• Identifying revenue opportunities\n\nMax ensures you understand exactly where your product fits in the global value chain."
    },
    'colette': {
      keywords: ['colette', 'collaboration', 'partner', 'research agent'],
      response: "**Meet Colette - Collaboration Agent:**\n\nColette is our AI employee focused on connections. She:\n• Connects materials with research institutions\n• Unlocks R&D collaboration paths\n• Discovers partnership potentials\n\nColette helps you build the network necessary to scale your innovation."
    },
    'selling': {
      keywords: ['sell', 'supplier', 'vendor', 'list', 'distribution'],
      response: "**Sell on TrueNorth:**\n\nAre you a producer of advanced materials? We help you reach the right buyers.\n\nBy listing on our marketplace, you get access to our AI Employees (Max and Colette) to help position your product and find the right partners.\n\nContact us at tobias@truenorthmaterials.com to start listing."
    },
    'ai_employees': {
      keywords: ['ai employees', 'agents', 'team', 'staff', 'intelligence', 'ai'],
      response: "**Our AI Team:**\n\nUnlike traditional platforms, TrueNorth employs autonomous AI agents to work for you:\n\n1. **Max** (Market Analysis)\n2. **Colette** (Collaboration)\n\nThey continuously scan the landscape to build a Knowledge Graph that accelerates the adoption of your materials."
    },
    'mission': {
      keywords: ['mission', 'vision', 'why', 'humanity', 'goal'],
      response: "**Our Mission:**\n\nHumanity advances with materials. From the Stone Age to the Silicon Age, materials define our progress.\n\nTrueNorth Materials exists to accelerate this progress by removing the friction in discovering, buying, and adopting advanced materials."
    },
    'contact': {
      keywords: ['contact', 'email', 'phone', 'support', 'reach', 'talk'],
      response: "**Get in Touch:**\n\nReady to advance with us?\n\nEmail: tobias@truenorthmaterials.com\n\nWe are happy to discuss how our marketplace and AI agents can serve your specific needs."
    }
  };

  const findBestResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    // Check each Q&A category
    for (const [category, qa] of Object.entries(qaDatabase)) {
      for (const keyword of qa.keywords) {
        if (lowerInput.includes(keyword)) {
          return qa.response;
        }
      }
    }
    
    // General conversational fallbacks
    if (lowerInput.match(/^(hi|hello|hey|greetings)/)) {
      return "Hello! I'm ready to help you explore our Advanced Materials Marketplace. Would you like to meet Max and Colette, or learn how to sell on our platform?";
    }

    // Default response
    return "I'm not sure about that specific detail, but I can tell you about:\n\n• **Our Marketplace** - The hub for advanced materials\n• **Max** - Our Market Analysis AI\n• **Colette** - Our Collaboration AI\n• **Selling** - How to list your materials\n\nHumanity advances with materials—how can we help you advance today?";
  };

  const handleSendMessage = (): void => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: findBestResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-slate-800 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-white rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open chat"
      >
        <img 
          src="/favicon-32x32.png" 
          alt="TrueNorth Logo" 
          className="w-8 h-8"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[400px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 z-50 overflow-hidden border border-slate-200 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } ${isMinimized ? 'h-16' : 'h-[600px]'}`}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center relative overflow-hidden">
            {/* Background decorative gradient */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-900/20 to-slate-900 z-0"></div>
            
          <div className="flex items-center gap-3 relative z-10">
            <img 
              src="/favicon-32x32.png" 
              alt="TrueNorth Logo" 
              className="w-8 h-8"
            />
            <div>
              <h3 className="font-bold text-lg text-white">TrueNorth AI</h3>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                Materials Intelligence
              </p>
            </div>
          </div>
          <div className="flex gap-2 relative z-10">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-white/10 rounded-lg p-1.5 transition-colors text-slate-300 hover:text-white"
              aria-label="Minimize chat"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/10 rounded-lg p-1.5 transition-colors text-slate-300 hover:text-white"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-slate-200 border border-slate-300 rounded-full flex items-center justify-center flex-shrink-0">
                        <img 
                          src="/favicon-32x32.png" 
                          alt="Bot" 
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-br-sm'
                            : 'bg-white text-slate-700 rounded-bl-sm border border-slate-200 shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className={`text-[10px] text-slate-400 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                        <img 
                          src="/favicon-32x32.png" 
                          alt="Bot" 
                          className="w-5 h-5"
                        />
                    </div>
                    <div className="bg-white p-3 rounded-2xl rounded-bl-sm border border-slate-200 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-white border-t border-slate-100">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Suggested Topics:</p>
              <div className="flex flex-wrap gap-2">
                {['Meet Max & Colette', 'About Marketplace', 'Sell Materials'].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInputValue(action);
                      handleSendMessage();
                    }}
                    className="text-xs bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-600 hover:text-emerald-700 px-3 py-1.5 rounded-full transition-all duration-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about materials, Max, or Colette..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-200 text-white p-2.5 rounded-xl transition-colors duration-200"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;