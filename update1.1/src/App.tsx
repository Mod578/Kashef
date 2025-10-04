import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Chat as GeminiChat } from '@google/genai';

// Components
import Header from './components/Header';
import VideoPlayer from './components/VideoPlayer';
import SystemDashboard from './components/SystemDashboard';
import ComponentDetails from './components/ComponentDetails';
import ChatAssistant from './components/ChatAssistant';
import AboutModal from './components/AboutModal';

// Context and Hooks
import { useAppContext } from './context/AppContext';
import { useSystemSlots } from './hooks/useSystemSlots';

// Services and constants
import { GeminiService } from './services/geminiService';
import { GENERAL_CHAT_SYSTEM_INSTRUCTION, getComponentChatSystemInstruction } from './constants';

// Types
import type { VideoPlayerRef, MobileTab } from './types';

// Icons
import { LuLayoutDashboard, LuScanLine } from 'react-icons/lu';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { FaRobot } from 'react-icons/fa6';


// Main App Component
const App: React.FC = () => {
    // STATE MANAGEMENT (from Context)
    // =================================================================
    const { state, dispatch } = useAppContext();
    const { 
        theme, 
        detectedComponents, 
        selectedComponent, 
        isProcessingFrame,
        scanStateKey,
        imageCache,
        imageGenerationErrors,
    } = state;

    // LOCAL UI STATE
    // =================================================================
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('scan');

    // Gemini Service and Chat State
    const geminiService = useRef<GeminiService | null>(null);
    const [chatSession, setChatSession] = useState<GeminiChat | null>(null);
    const [chatHistory, setChatHistory] = useState([]);

    // Refs
    const videoPlayerRef = useRef<VideoPlayerRef>(null);

    // DERIVED STATE
    // =================================================================
    const { slots, unassigned } = useSystemSlots(detectedComponents);


    // EFFECTS
    // =================================================================
    // Initialize Gemini Service
    useEffect(() => {
        try {
            geminiService.current = new GeminiService();
        } catch (error: any) {
            toast.error(error.message, { duration: 10000 });
        }
    }, []);

    // Apply theme to HTML element
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    
    // Initialize or update chat session when selected component changes
    useEffect(() => {
        if (!geminiService.current) return;
        
        const instruction = selectedComponent 
            ? getComponentChatSystemInstruction(selectedComponent.name, selectedComponent.type, selectedComponent.specs)
            : GENERAL_CHAT_SYSTEM_INSTRUCTION;
            
        const newChat = geminiService.current.startChatSession(instruction);
        setChatSession(newChat);
        setChatHistory([]); // Reset history when context changes

    }, [selectedComponent]);
    
    // Generate component image when a new component is selected
    useEffect(() => {
        const generateImage = async () => {
            if (!selectedComponent) {
                dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: null });
                return;
            }
            
            // Check cache first
            if (imageCache[selectedComponent.id]) {
                dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: imageCache[selectedComponent.id] });
                return;
            }
            
            // Check if generation has already failed for this component to prevent infinite loops
            if (imageGenerationErrors[selectedComponent.id]) {
                dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: null });
                return;
            }

            if (!geminiService.current) return;

            dispatch({ type: 'SET_IS_LOADING_IMAGE', payload: true });
            dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: null });

            try {
                const imageUrl = await geminiService.current.generateComponentImage(selectedComponent.name, selectedComponent.type);
                dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: imageUrl });
                if (imageUrl) {
                    dispatch({ type: 'CACHE_IMAGE', payload: { componentId: selectedComponent.id, imageUrl } });
                }
            } catch (error: any) {
                console.error("Error generating image:", error);
                toast.error("تعذر إنشاء صورة توضيحية للمكون.");
                dispatch({ type: 'SET_GENERATED_IMAGE_URL', payload: null });
                // Mark this component's image generation as failed to prevent retries
                dispatch({ type: 'MARK_IMAGE_GENERATION_FAILED', payload: selectedComponent.id });
            } finally {
                dispatch({ type: 'SET_IS_LOADING_IMAGE', payload: false });
            }
        };

        generateImage();
    }, [selectedComponent, dispatch, imageCache, imageGenerationErrors]);

    // HANDLERS
    // =================================================================
    const handleAnalyzeFrame = useCallback(async () => {
        if (!geminiService.current || isProcessingFrame) return;

        const frame = videoPlayerRef.current?.getFrameData();
        if (!frame) {
            toast.error("تعذر التقاط الإطار. حاول مرة أخرى.");
            return;
        }

        dispatch({ type: 'SET_IS_PROCESSING_FRAME', payload: true });
        try {
            const components = await geminiService.current.analyzeImage(frame.data, frame.mimeType);
            if (components.length === 0) {
                toast.success("لم يتم التعرف على أي مكونات. حاول التقاط صورة أوضح.");
            } else {
                dispatch({ type: 'ADD_DETECTED_COMPONENTS', payload: components });
                toast.success(`تم التعرف على ${components.length} مكون جديد!`);
                setActiveMobileTab('dashboard');
            }
        } catch (error: any) {
            console.error("Analysis failed:", error);
            toast.error(error.message || "حدث خطأ غير متوقع أثناء التحليل.");
        } finally {
            dispatch({ type: 'SET_IS_PROCESSING_FRAME', payload: false });
            videoPlayerRef.current?.resume();
        }
    }, [isProcessingFrame, dispatch]);
    
    const handleResetChat = useCallback(() => {
        if (!geminiService.current) return;
        const instruction = selectedComponent
            ? getComponentChatSystemInstruction(selectedComponent.name, selectedComponent.type, selectedComponent.specs)
            : GENERAL_CHAT_SYSTEM_INSTRUCTION;
        setChatSession(geminiService.current.startChatSession(instruction));
        setChatHistory([]);
        toast.success("تم إعادة تعيين المحادثة.");
    }, [selectedComponent]);

    // RENDER LOGIC
    // =================================================================
    const renderMobileTabContent = () => {
        switch (activeMobileTab) {
            case 'scan':
                return (
                    <div className="h-full w-full">
                        <VideoPlayer
                            key={scanStateKey}
                            ref={videoPlayerRef}
                            onAnalyzeFrame={handleAnalyzeFrame}
                            onError={(msg) => toast.error(msg)}
                        />
                    </div>
                );
            case 'dashboard':
                return (
                    <SystemDashboard
                        slots={slots}
                        unassigned={unassigned}
                        onAddNewScan={() => setActiveMobileTab('scan')}
                    />
                );
            case 'details':
                return (
                    <ComponentDetails
                        onClearSelection={() => {
                            dispatch({ type: 'SELECT_COMPONENT', payload: null });
                            setActiveMobileTab('dashboard');
                        }}
                    />
                );
            case 'chat':
                return (
                    <ChatAssistant
                        chatSession={chatSession}
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        onResetChat={handleResetChat}
                    />
                );
            default: return null;
        }
    };
    
    const MobileBottomNav = () => (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-brand-surface border-t border-brand-border h-[calc(4rem+env(safe-area-inset-bottom))] pb-[env(safe-area-inset-bottom)] flex items-center justify-around z-40">
            {[
                { tab: 'scan', icon: LuScanLine, label: 'مسح' },
                { tab: 'dashboard', icon: LuLayoutDashboard, label: 'لوحة النظام' },
                { tab: 'details', icon: IoDocumentTextOutline, label: 'التفاصيل', disabled: !selectedComponent },
                { tab: 'chat', icon: FaRobot, label: 'المساعد' },
            ].map(({tab, icon: Icon, label, disabled}) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveMobileTab(tab as MobileTab)}
                    disabled={disabled}
                    className="relative flex flex-col items-center justify-center h-full w-1/4 p-2 transition-colors focus:outline-none group"
                 >
                    <div className={`absolute top-0 h-1 w-10 bg-brand-primary rounded-b-full transition-all duration-300 transform ${activeMobileTab === tab ? 'scale-x-100' : 'scale-x-0'}`}></div>
                    <div className={`transition-colors ${activeMobileTab === tab ? 'text-brand-primary' : 'text-brand-text-secondary'} group-disabled:opacity-40 group-disabled:cursor-not-allowed flex flex-col items-center`}>
                        <Icon className="w-6 h-6 mb-1"/>
                        <span className="text-xs font-bold">{label}</span>
                    </div>
                 </button>
            ))}
        </nav>
    );


    return (
        <div dir="rtl" className="h-screen w-screen bg-brand-bg text-brand-text-primary flex flex-col font-sans overflow-hidden">
            <Toaster
                position="bottom-center"
                toastOptions={{
                    className: 'font-sans',
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                }}
            />
            <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />

            <Header onOpenAboutModal={() => setIsAboutModalOpen(true)} />

            <main className="flex-grow overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-px bg-brand-border">
                {/* Mobile View */}
                <div className="md:hidden col-span-1 h-full w-full overflow-y-auto pb-[calc(4rem+env(safe-area-inset-bottom))]">
                   {renderMobileTabContent()}
                </div>
                
                {/* ======================================= */}
                {/* Desktop View (Static Layout)          */}
                {/* ======================================= */}
                
                {/* Right Column (40%): Scan + Dashboard */}
                <div className="hidden md:flex md:col-span-5 flex-col h-full bg-brand-bg overflow-hidden">
                    <>
                        {/* Top Part: Camera */}
                        <div className="flex-shrink-0 h-1/2 border-b border-brand-border">
                            <VideoPlayer
                                key={scanStateKey}
                                ref={videoPlayerRef}
                                onAnalyzeFrame={handleAnalyzeFrame}
                                onError={(msg) => toast.error(msg)}
                            />
                        </div>
                        {/* Bottom Part: System Dashboard */}
                        <div className="flex-grow h-1/2 overflow-hidden">
                             <SystemDashboard
                                slots={slots}
                                unassigned={unassigned}
                                onAddNewScan={() => { /* No-op on desktop */ }}
                            />
                        </div>
                    </>
                </div>

                {/* Middle Column: Details (35%) */}
                <div className="hidden md:block md:col-span-4 h-full overflow-y-auto">
                    <ComponentDetails />
                </div>
                
                {/* Left-most Column: Chat (25%) */}
                <div className="hidden md:flex md:col-span-3 flex-col h-full overflow-hidden">
                     <ChatAssistant
                        chatSession={chatSession}
                        chatHistory={chatHistory}
                        setChatHistory={setChatHistory}
                        onResetChat={handleResetChat}
                    />
                </div>
            </main>
            
            <MobileBottomNav />
        </div>
    );
};

export default App;
