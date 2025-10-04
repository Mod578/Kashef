import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { Logo } from './Logo';
import { useAppContext } from '../context/AppContext';

const DemoView: React.FC = () => {
    const { dispatch } = useAppContext();

    const handleExitDemo = () => {
        dispatch({ type: 'EXIT_DEMO_MODE' });
    };
    
    return (
        <div className="relative w-full h-full flex flex-col bg-brand-bg">
            <div className="absolute top-4 left-4 z-20">
                <button
                    onClick={handleExitDemo}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-surface text-brand-text-primary font-bold rounded-xl hover:bg-brand-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary transition-all duration-200 border border-brand-border shadow-lg animate-fade-in"
                    aria-label="إنهاء الوضع التجريبي"
                >
                    <FaTimes />
                    <span>إنهاء التجربة</span>
                </button>
            </div>
            
             <div className="w-full h-full flex flex-col items-center justify-center bg-brand-bg p-8 text-center">
                <div className="relative w-32 h-32 mb-6 flex items-center justify-center rounded-3xl bg-brand-surface border border-brand-border shadow-lg p-4">
                    <Logo className="w-20 h-20 text-brand-text-tertiary" />
                </div>
                <h2 className="text-xl font-bold text-brand-text-primary">الوضع التجريبي نشط</h2>
                <p className="text-brand-text-secondary max-w-md">الكاميرا معطلة أثناء الوضع التجريبي.</p>
            </div>
        </div>
    );
};

export default React.memo(DemoView);