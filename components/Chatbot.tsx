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
      text: "Hello! I'm here to help you learn about TrueNorth Materials. What would you like to know?", 
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

  // Enhanced Q&A database with more comprehensive responses
  const qaDatabase: QADatabase = {
    'services': {
      keywords: ['services', 'offer', 'provide', 'what do you do', 'solutions', 'help', 'capabilities'],
      response: "TrueNorth Materials provides AI-driven materials intelligence solutions. We transform sensor data and big data into actionable insights for sustainable innovation.\n\n🔬 **Our Focus:**\n• Materials data analytics\n• Sensor integration and monitoring\n• AI-powered analysis\n• Sustainable materials innovation\n\n2025 is the year of AI agents putting vast materials data to work. We're here to help you harness this potential.\n\nWould you like to learn more about any specific aspect of our services?"
    },
    'ai': {
      keywords: ['ai', 'artificial intelligence', 'machine learning', 'agents', 'algorithm', 'model'],
      response: "🤖 **Our AI Technology:**\n\nTrueNorth Materials leverages advanced AI and machine learning to transform materials data into actionable intelligence.\n\n• **AI Agents** - Putting vast materials data to work\n• **Big Data Processing** - Turning sensor data into insights\n• **Predictive Analytics** - Forecasting material behavior\n• **Intelligent Analysis** - Extracting meaningful patterns\n\n2025 is the year of AI agents revolutionizing materials innovation. Our platform is at the forefront of this transformation.\n\nFor more details about our specific AI capabilities, contact us at jason.deacon@truenorthmaterials.com"
    },
    'sustainability': {
      keywords: ['sustainable', 'sustainability', 'environment', 'green', 'eco', 'carbon', 'emissions'],
      response: "🌱 **Sustainability Focus:**\n\nTrueNorth Materials is committed to driving sustainable innovation in the materials industry.\n\nOur AI-driven platform helps organizations:\n• Make data-driven decisions for sustainable materials\n• Transform sensor and big data into environmental insights\n• Support sustainable innovation initiatives\n• Optimize material selection for environmental impact\n\nWe believe that intelligent use of materials data is key to building a more sustainable future.\n\nTo learn more about how we can support your sustainability goals, contact us at jason.deacon@truenorthmaterials.com"
    },
    'contact': {
      keywords: ['contact', 'reach', 'email', 'phone', 'talk', 'speak', 'get in touch', 'support'],
      response: "📧 **Get in Touch:**\n\nYou can reach us at:\n\n📧 jason.deacon@truenorthmaterials.com\n\nWe'd love to hear from you about how our AI-driven materials intelligence platform can help transform your business.\n\nFeel free to email us with any questions about our services, technology, or to schedule a discussion about your specific needs."
    },
    'demo': {
      keywords: ['demo', 'trial', 'try', 'test', 'free', 'poc', 'pilot', 'proof of concept'],
      response: "🚀 **See TrueNorth in Action:**\n\nInterested in seeing how our AI-driven materials intelligence platform can transform your business?\n\nWe'd be happy to arrange a demonstration tailored to your specific needs and use cases.\n\n📧 Contact us at: jason.deacon@truenorthmaterials.com\n\nLet us know about your materials challenges and we'll show you how our platform can help!"
    },
    'industries': {
      keywords: ['industries', 'sectors', 'who uses', 'clients', 'applications', 'use cases', 'customers'],
      response: "🏭 **Industries & Applications:**\n\nTrueNorth Materials' AI-driven platform can benefit organizations across various sectors working with materials data and innovation.\n\nOur platform is designed to help any industry that:\n• Works with materials and sensors\n• Needs data-driven insights\n• Focuses on sustainable innovation\n• Requires intelligent materials analysis\n\nWhether you're in manufacturing, construction, electronics, energy, or any other materials-intensive industry, our platform can transform your data into actionable intelligence.\n\nTo discuss your specific industry needs, reach out to jason.deacon@truenorthmaterials.com"
    },
    'pricing': {
      keywords: ['price', 'pricing', 'cost', 'how much', 'plans', 'packages', 'subscription', 'payment'],
      response: "💰 **Pricing Information:**\n\nFor pricing information tailored to your specific needs and use case, please reach out to us at:\n\n📧 jason.deacon@truenorthmaterials.com\n\nWe'll be happy to discuss how our AI-driven materials intelligence platform can meet your requirements and provide you with relevant pricing details."
    },
    'data': {
      keywords: ['data', 'security', 'privacy', 'safe', 'protect', 'encryption', 'compliance'],
      response: "🔒 **Data Security:**\n\nAt TrueNorth Materials, we take data security seriously. Our platform is designed with security in mind to protect your valuable materials data and insights.\n\nWe implement industry-standard security practices to ensure your data remains safe and confidential.\n\nFor specific questions about our security measures and data handling practices, please contact us at jason.deacon@truenorthmaterials.com"
    },
    'integration': {
      keywords: ['integration', 'api', 'connect', 'integrate', 'erp', 'systems', 'software'],
      response: "🔗 **Platform Integration:**\n\nOur AI-driven materials intelligence platform is designed to work with your existing systems and data sources.\n\nWe can help you:\n• Connect sensor networks\n• Integrate materials databases\n• Work with your existing data infrastructure\n\nFor details about specific integration capabilities and how we can work with your systems, contact us at jason.deacon@truenorthmaterials.com"
    },
    'features': {
      keywords: ['features', 'benefits', 'advantages', 'why choose', 'unique'],
      response: "⭐ **Why TrueNorth Materials:**\n\n• **AI-Driven Intelligence** - Transform sensors and big data into actionable insights\n• **Sustainable Innovation** - Focus on materials solutions for a better future\n• **2025 Vision** - Leading the year of AI agents in materials innovation\n• **Data-Driven Decisions** - Make informed choices based on real intelligence\n\nWe're transforming how organizations work with materials data.\n\nTo learn more about how TrueNorth can benefit your organization, reach out to jason.deacon@truenorthmaterials.com"
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
    
    // Enhanced greeting responses
    if (lowerInput.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)/)) {
      const greetings = [
        "Hello! Welcome to TrueNorth Materials. How can I assist you today?",
        "Hi there! I'm here to help you discover how our AI-driven materials intelligence can transform your business. What would you like to know?",
        "Greetings! Ready to explore the future of materials innovation? Ask me anything!"
      ];
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    if (lowerInput.match(/thank|thanks/)) {
      return "You're very welcome! Is there anything else about TrueNorth Materials I can help you with?";
    }
    
    if (lowerInput.match(/bye|goodbye|see you|exit|quit/)) {
      return "Thank you for your interest in TrueNorth Materials! Feel free to return anytime you have questions. Have a wonderful day! 👋";
    }

    if (lowerInput.match(/who are you|what are you/)) {
      return "I'm the TrueNorth Materials virtual assistant! I'm here to help you learn about our AI-driven materials intelligence platform that transforms sensors and big data into actionable intelligence for sustainable innovation. Feel free to ask me about our services, technology, or how to get in touch!";
    }
    
    // Default response with suggestions
    return "I'm not quite sure about that specific question. Here are some topics I can help you with:\n\n• 🔬 **Services** - Our AI solutions and capabilities\n• 🤖 **Technology** - How our AI works\n• 🌱 **Sustainability** - Environmental impact solutions\n• 🏭 **Industries** - Sectors we serve\n• 💰 **Pricing** - Plans and packages\n• 🔒 **Security** - Data protection measures\n• 🚀 **Demo** - Try our platform\n• 📞 **Contact** - Get in touch\n\nWhat would you like to explore?";
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
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
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
      {/* Chat Button with Logo */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        aria-label="Open chat"
      >
        <img 
          src="/favicon-32x32.png" 
          alt="TrueNorth Logo" 
          className="w-8 h-8"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[400px] bg-transparent rounded-xl shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        } ${isMinimized ? 'h-16' : 'h-[650px]'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/favicon-32x32.png" 
              alt="TrueNorth Logo" 
              className="w-8 h-8"
            />
            <div>
              <h3 className="font-semibold text-lg">TrueNorth Assistant</h3>
              <p className="text-xs opacity-90 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                AI Materials Intelligence Assistant
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="hover:bg-transparent/20 rounded p-1 transition-colors"
              aria-label="Minimize chat"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-transparent/20 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {message.sender === 'bot' && (
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <img 
                          src="/favicon-32x32.png" 
                          alt="Bot" 
                          className="w-5 h-5"
                        />
                      </div>
                    )}
                    <div>
                      <div
                        className={`p-3 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {formatTimestamp(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <img 
                        src="/favicon-32x32.png" 
                        alt="Bot" 
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-gray-50 border-t">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {['Our Services', 'Request Demo', 'Contact Us'].map((action) => (
                  <button
                    key={action}
                    onClick={() => {
                      setInputValue(action);
                      handleSendMessage();
                    }}
                    className="text-xs bg-white hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4 rounded-b-xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2.5 rounded-lg transition-colors"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Powered by TrueNorth Materials
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Chatbot;