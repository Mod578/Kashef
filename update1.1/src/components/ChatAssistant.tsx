import React, { useState, useEffect, useRef } from 'react';
import { Chat as GeminiChat } from '@google/genai';
import type { ChatMessage, GroundingChunk } from '../types';
import Dashboard from './Dashboard';
import { FaRobot } from 'react-icons/fa6';
import { FaTimes, FaCheck } from 'react-icons/fa';
import { IoArrowBack, IoGlobeOutline } from 'react-icons/io5';
import { GrPowerReset } from "react-icons/gr";
import toast from 'react-hot-toast';
import { getDomainFromUrl } from '../utils';
import { CHAT_LOADING_MESSAGES } from '../constants';
import { useAppContext } from '../context/AppContext';

// A simple component to render markdown-like text from the model.
const SimpleMarkdownRenderer: React.FC<{ content: string }> = React.memo(({ content }) => {
    // WARNING: This component uses dangerouslySetInnerHTML.
    // While the content is from a trusted API (Google Gemini), this is generally
    // not recommended due to potential XSS vulnerabilities if the API response
    // was ever compromised or contained malicious content.
    // For this specific use-case, we are accepting the risk to enable rich text formatting.
    const createMarkup = () => {
        const html = content
            // Remove all asterisks to ensure plain text output
            .replace(/\*/g, '')
            // Basic HTML escaping
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            // Links [text](url) - must be processed first.
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-accent hover:underline">$1</a>')
            // Replace newlines with <br> for paragraph breaks.
            .replace(/\n/g, '<br />');
        
        return { __html: html };
    };

    return <div dangerouslySetInnerHTML={createMarkup()} />;
});


interface ChatAssistantProps {
    chatSession: GeminiChat | null;
    chatHistory: ChatMessage[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    onResetChat: () => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ 
    chatSession, 
    chatHistory, 
    setChatHistory, 
    onResetChat,
}) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent } = state;
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConfirmingReset, setIsConfirmingReset] = useState(false);
    const resetTimeoutRef = useRef<number | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chatHistory]);
    
    useEffect(() => {
        // Cleanup timeout on component unmount
        return () => {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, []);
    
    const isFormDisabled = !chatSession || isLoading;

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !chatSession) return;

        const userMessage: ChatMessage = { id: `user-${Date.now()}-${Math.random()}`, role: 'user', content: input };
        setChatHistory(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        
        const thinkingMessageId = `model-thinking-${Date.now()}`;
        const randomMessage = CHAT_LOADING_MESSAGES[Math.floor(Math.random() * CHAT_LOADING_MESSAGES.length)];
        setChatHistory(prev => [...prev, { id: thinkingMessageId, role: 'model', content: randomMessage }]);

        try {
            const stream = await chatSession.sendMessageStream({ message: userMessage.content });
            
            let modelResponse = '';
            const modelMessageId = `model-${Date.now()}-${Math.random()}`;
            let firstChunk = true;
            let collectedSources: GroundingChunk[] = [];

            for await (const chunk of stream) {
                const chunkText = chunk.text;
                if(chunkText) {
                    modelResponse += chunkText;
                }
                
                const newChunks = chunk.candidates?.[0]?.groundingMetadata?.groundingChunks;
                if (newChunks) {
                    collectedSources.push(...newChunks);
                }
                
                if (firstChunk) {
                     // On the first chunk, replace the "thinking" message with the real one
                    setChatHistory(prev => prev.map(msg => 
                        msg.id === thinkingMessageId ? { id: modelMessageId, role: 'model', content: modelResponse } : msg
                    ));
                    firstChunk = false;
                } else {
                    setChatHistory(prev => prev.map(msg => 
                        msg.id === modelMessageId ? { ...msg, content: modelResponse } : msg
                    ));
                }
            }
            
            if (firstChunk) {
                 // Stream was empty, remove the thinking message
                 setChatHistory(prev => prev.filter(msg => msg.id !== thinkingMessageId));
            } else {
                // Stream ended, update final message with unique sources
                const uniqueSources = collectedSources.filter(
                    (source, index, self) =>
                        source.web?.uri && self.findIndex(s => s.web?.uri === source.web?.uri) === index
                ).slice(0, 5); // Limit to a maximum of 5 sources.

                setChatHistory(prev => prev.map(msg => 
                    msg.id === modelMessageId ? { ...msg, sources: uniqueSources } : msg
                ));
            }

        } catch (error: any) {
            console.error("Error sending message:", error);
            toast.error("حدث خطأ أثناء إرسال الرسالة.");
            setChatHistory(prev => prev.filter(msg => msg.id !== thinkingMessageId)); // Just remove the thinking message
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        if (isConfirmingReset) {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
            onResetChat();
            setIsConfirmingReset(false);
        } else {
            setIsConfirmingReset(true);
            resetTimeoutRef.current = window.setTimeout(() => {
                setIsConfirmingReset(false);
            }, 3000);
        }
    }
    
    const handleClearComponentSelection = () => {
        dispatch({ type: 'SELECT_COMPONENT', payload: null });
    };

    const isOnline = !!chatSession;

    // A custom component for the dashboard header icon, combining the robot with a status indicator.
    const AssistantIcon: React.FC = () => (
        <div className="relative w-8 h-8"> {/* Use a fixed-size container to ensure alignment and space for the dot */}
            <div className="w-full h-full flex items-center justify-center bg-brand-surface-alt rounded-full border border-brand-border">
                <FaRobot className="w-5 h-5 text-brand-text-primary" />
            </div>
            
            {/* The status dot, positioned at the corner of the circular container */}
            <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
                 <div className="relative flex h-3.5 w-3.5 items-center justify-center">
                    <span className={`relative inline-flex rounded-full h-3 w-3 border-2 border-brand-surface ${isOnline ? 'bg-brand-success' : 'bg-brand-text-tertiary'}`}></span>
                </div>
            </div>
        </div>
    );


    return (
        <Dashboard
            title="المساعد الذكي"
            subtitle={'اسأل عن أي شيء متعلق بمكونات الكمبيوتر'}
            icon={AssistantIcon}
            footer={
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            isFormDisabled 
                                ? "المحادثة معطلة" 
                                : selectedComponent 
                                    ? `اسأل عن ${selectedComponent.name}...`
                                    : "اكتب رسالتك..."
                        }
                        className="w-full bg-brand-bg text-brand-text-primary placeholder:text-brand-text-tertiary border border-brand-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50"
                        disabled={isFormDisabled}
                        aria-label="رسالة المحادثة"
                    />
                    <button
                        type="submit"
                        disabled={isFormDisabled || !input.trim()}
                        className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-brand-primary text-brand-primary-fg rounded-lg disabled:bg-brand-surface-alt disabled:text-brand-text-tertiary hover:bg-brand-primary/90 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface focus-visible:ring-brand-primary"
                        aria-label="إرسال الرسالة"
                    >
                        {isLoading ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <IoArrowBack />}
                    </button>
                </form>
            }
        >
            <div className="h-full flex flex-col">
                {selectedComponent && (
                     <div className="flex-shrink-0 flex items-center justify-between p-2 mb-3 bg-brand-surface-alt rounded-lg text-sm border border-brand-border animate-fade-in">
                        <div className="flex items-center gap-2 min-w-0">
                            <span className="text-brand-text-secondary flex-shrink-0">تسأل عن:</span>
                            <strong className="text-brand-text-primary truncate" title={selectedComponent.name}>{selectedComponent.name}</strong>
                        </div>
                        <button 
                            onClick={handleClearComponentSelection} 
                            className="p-1 rounded-full text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary transition-colors flex-shrink-0"
                            aria-label="إلغاء تحديد المكون"
                        >
                            <FaTimes />
                        </button>
                    </div>
                )}

                {chatHistory.length === 0 ? (
                    <div className="flex-grow flex flex-col items-center justify-center text-center text-brand-text-secondary p-4">
                        <FaRobot className="w-16 h-16 mb-4 text-brand-text-tertiary" />
                        <p className="font-bold">
                           {selectedComponent ? `مستعد للإجابة عن ${selectedComponent.type}` : 'مرحباً بك!'}
                        </p>
                        <p className="text-sm">
                           {selectedComponent ? 'اطرح سؤالاً محدداً حول هذا المكون.' : 'يمكنك طرح أسئلة حول المكونات التي تم تحديدها أو أي استفسار آخر يتعلق بمكونات الكمبيوتر.'}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="flex-grow space-y-4">
                            {chatHistory.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-brand-primary text-brand-primary-fg rounded-br-lg' : 'bg-brand-surface border border-brand-border text-brand-text-primary rounded-bl-lg'}`}>
                                        {msg.role === 'model' ? (
                                            <SimpleMarkdownRenderer content={msg.content} />
                                        ) : (
                                            <p className="whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                    </div>
                                    {msg.role === 'model' && msg.sources && msg.sources.length > 0 && (
                                        <div className="mt-2 max-w-[85%] text-xs w-full">
                                            <h4 className="flex items-center gap-1.5 text-brand-text-secondary font-bold mb-1">
                                                <IoGlobeOutline />
                                                <span>المصادر</span>
                                            </h4>
                                            <ul className="space-y-1 bg-brand-surface border border-brand-border rounded-lg p-2">
                                                {msg.sources.map((source, index) => (
                                                    source.web?.uri && (
                                                        <li key={`${msg.id}-source-${index}`} className="flex items-start gap-2">
                                                            <span className="text-brand-text-tertiary">{index + 1}.</span>
                                                            <a 
                                                                href={source.web.uri} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer" 
                                                                className="text-brand-accent hover:underline truncate"
                                                                title={source.web.uri}
                                                            >
                                                                {source.web.title || getDomainFromUrl(source.web.uri)}
                                                            </a>
                                                        </li>
                                                    )
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <button 
                            onClick={handleReset} 
                            className={`mt-4 mx-auto flex items-center gap-2 text-xs transition-colors ${
                                isConfirmingReset 
                                ? 'text-brand-danger font-bold' 
                                : 'text-brand-text-tertiary hover:text-brand-text-secondary'
                            }`}
                        >
                            {isConfirmingReset ? <FaCheck /> : <GrPowerReset />}
                            <span>{isConfirmingReset ? "هل أنت متأكد؟" : "إعادة تعيين المحادثة"}</span>
                        </button>
                    </>
                )}
            </div>
        </Dashboard>
    );
};

export default React.memo(ChatAssistant);