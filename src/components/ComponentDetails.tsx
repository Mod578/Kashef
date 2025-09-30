// FIX: Implemented the ComponentDetails component to resolve import errors and provide component detail view functionality.
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { getSpecIcon } from '../utils';
import { IoDocumentTextOutline, IoAlertCircleOutline, IoCopyOutline, IoCheckmark, IoListCircleOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import type { DetectedComponent } from '../types';

// --- Sub-components for better readability ---

interface ComponentImageProps {
  component: DetectedComponent;
  imageUrl: string | null;
  isGeneratingImage: boolean;
  isDemoMode: boolean;
}

/**
 * Displays the component's image with various states: loading, success, failure, or a demo placeholder.
 */
const ComponentImage: React.FC<ComponentImageProps> = React.memo(({ component, imageUrl, isGeneratingImage, isDemoMode }) => {
    const showImageFailure = !isGeneratingImage && !imageUrl && !isDemoMode;
    const showDemoPlaceholder = !imageUrl && isDemoMode;

    if (isGeneratingImage) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-brand-surface">
                <div className="w-8 h-8 border-2 border-brand-text-tertiary border-t-brand-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    if (imageUrl) {
        return <img src={imageUrl} alt={component.name} className="w-full h-full object-contain" />;
    }

    if (showImageFailure) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surface-alt text-brand-text-secondary p-4 text-center">
                <IoAlertCircleOutline className="w-12 h-12 text-brand-danger mb-2" />
                <h4 className="font-bold text-brand-text-primary">تعذر إنشاء الصورة</h4>
                <p className="text-xs mt-1">قد يكون هناك مشكلة فنية أو تم تجاوز حدود الاستخدام.</p>
            </div>
        );
    }
    
    if (showDemoPlaceholder) {
        return (
             <div className="w-full h-full flex items-center justify-center bg-brand-surface-alt text-brand-text-tertiary overflow-hidden relative">
                <div className="w-full h-full bg-gradient-to-r from-brand-surface-alt via-brand-surface to-brand-surface-alt bg-[length:200%_100%] animate-shimmer opacity-50 absolute inset-0" />
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return null;
});

interface ComponentDetailsProps {
    /** Optional callback for mobile view to handle tab switching when selection is cleared. */
    onClearSelection?: () => void;
}

/**
 * Renders the detailed view of a selected component, including its generated image,
 * summary, and technical specifications.
 */
const ComponentDetails: React.FC<ComponentDetailsProps> = ({ onClearSelection }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent: component, generatedImageUrl: imageUrl, isLoadingImage: isGeneratingImage, isDemoMode } = state;
    const [copiedSpec, setCopiedSpec] = useState<string | null>(null);
    
    /**
     * Clears the selected component. It calls the `onClearSelection` prop if provided (for mobile),
     * otherwise it dispatches an action to update the global context (for desktop).
     */
    const handleClearSelection = () => {
        if (onClearSelection) {
            onClearSelection();
        } else {
            dispatch({ type: 'SELECT_COMPONENT', payload: null });
        }
    };

    const handleCopy = (specText: string) => {
        navigator.clipboard.writeText(specText).then(() => {
            toast.success(`'${specText}' تم نسخه!`);
            setCopiedSpec(specText);
            setTimeout(() => setCopiedSpec(null), 2000);
        }).catch(err => {
            toast.error('فشل النسخ.');
            console.error('Failed to copy: ', err);
        });
    };

    // Placeholder view when no component is selected
    if (!component) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-brand-bg p-8 text-center">
                 <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-3xl bg-brand-surface border border-brand-border">
                    <IoDocumentTextOutline className="w-12 h-12 text-brand-text-tertiary" />
                </div>
                <h3 className="text-xl font-bold text-brand-text-primary">تفاصيل المكون</h3>
                <p className="text-brand-text-secondary mt-2">الرجاء تحديد مكون من لوحة النظام لعرض تفاصيله التقنية.</p>
            </div>
        );
    }

    return (
        <div className="relative flex flex-col h-full bg-brand-bg">
            {/* Close button for mobile view */}
            <button 
                onClick={handleClearSelection} 
                className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors z-20 sm:hidden"
                aria-label="إغلاق التفاصيل"
            >
                <FaTimes />
            </button>

            {/* Image Section */}
            <div className="flex-shrink-0 h-56 w-full bg-brand-surface relative">
                <ComponentImage 
                    component={component}
                    imageUrl={imageUrl}
                    isGeneratingImage={isGeneratingImage}
                    isDemoMode={isDemoMode}
                />
            </div>

            {/* Details Section */}
            <div className="flex-grow p-4 overflow-y-auto">
                <h2 className="text-2xl font-extrabold text-brand-text-primary">{component.name}</h2>
                <p className="font-semibold text-brand-primary mb-3">{component.type}</p>
                
                <h3 className="flex items-center gap-2 text-base font-bold text-brand-text-primary mt-4 mb-2">
                    <IoDocumentTextOutline className="w-5 h-5 text-brand-primary" />
                    <span>ملخص تقني</span>
                </h3>
                <p className="text-brand-text-secondary text-sm">{component.short_summary}</p>
                
                <div className="mt-4 border-t border-brand-border pt-4">
                    <h3 className="flex items-center gap-2 font-bold text-brand-text-primary mb-3">
                        <IoListCircleOutline className="w-5 h-5 text-brand-primary" />
                        <span>المواصفات الرئيسية</span>
                    </h3>
                    <ul className="space-y-2">
                        {component.specs?.map((spec, index) => {
                            const Icon = getSpecIcon(spec.name);
                            const specText = `${spec.name}: ${spec.value}`;
                            const isCopied = copiedSpec === specText;
                            return (
                                <li key={index} className="flex items-center justify-between text-sm p-2 rounded-lg bg-brand-surface hover:bg-brand-surface-alt group">
                                    <div className="flex items-center gap-3">
                                        {Icon && <Icon className="w-4 h-4 text-brand-text-secondary" />}
                                        <span className="font-semibold text-brand-text-primary">{spec.name}:</span>
                                        <span className="text-brand-text-secondary">{spec.value}</span>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(specText)}
                                        className="p-1.5 rounded-md text-brand-text-tertiary group-hover:text-brand-text-secondary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        aria-label={`نسخ ${specText}`}
                                    >
                                        {isCopied ? <IoCheckmark className="text-brand-success" /> : <IoCopyOutline />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default React.memo(ComponentDetails);