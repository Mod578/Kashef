import React from 'react';
import { FaTimes, FaExternalLinkAlt, FaImage } from 'react-icons/fa';
import { getSpecIcon } from '../utils';
import { IoDocumentTextOutline, IoCopyOutline, IoCheckmark, IoListCircleOutline, IoGlobeOutline } from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';

interface ComponentDetailsProps {
    onClearSelection?: () => void; // Made optional for desktop view
}

const ImagePlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="w-full h-full bg-brand-surface-alt flex flex-col items-center justify-center text-brand-text-tertiary">
        <FaImage className="w-12 h-12 mb-4" />
        <p className="text-sm font-medium">{message}</p>
    </div>
);

const ImageShimmer: React.FC = () => (
    <div className="w-full h-full bg-brand-surface-alt relative overflow-hidden">
        <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-surface to-transparent"
            style={{
                animation: 'shimmer 2s infinite linear'
            }}
        />
    </div>
);

const ComponentDetails: React.FC<ComponentDetailsProps> = ({ onClearSelection }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent: component, isLoadingImage, generatedImageUrl, imageGenerationErrors } = state;
    const [copiedSpec, setCopiedSpec] = React.useState<string | null>(null);
    
    const handleClearSelection = () => {
        if (onClearSelection) {
            onClearSelection(); // For mobile tab switching
        } else {
            dispatch({ type: 'SELECT_COMPONENT', payload: null }); // For desktop
        }
    };

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
    
    const hasGenerationFailed = imageGenerationErrors[component.id];

    return (
        <div className="relative flex flex-col h-full bg-brand-bg">
            
            {/* Image Section */}
            <div className="flex-shrink-0 w-full aspect-video bg-brand-surface-alt relative border-b border-brand-border">
                {isLoadingImage ? (
                    <ImageShimmer />
                ) : hasGenerationFailed ? (
                    <ImagePlaceholder message="تعذر عرض الصورة" />
                ) : generatedImageUrl ? (
                    <img src={generatedImageUrl} alt={`صورة لـ ${component.name}`} className="w-full h-full object-contain" />
                ) : (
                    <ImagePlaceholder message="لا توجد صورة متاحة" />
                )}
                 <button 
                    onClick={handleClearSelection} 
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20 md:hidden"
                    aria-label="إغلاق التفاصيل"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Details Section */}
            <div className="flex-grow p-4 pt-6 overflow-y-auto">
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
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {component.specs.map(spec => {
                            const Icon = getSpecIcon(spec.label);
                            const specTextToCopy = `${spec.label}: ${spec.value}`;
                            return (
                                <div key={spec.label} className="group bg-brand-surface p-3 rounded-xl border border-brand-border flex flex-col justify-between">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-brand-text-secondary">
                                            {Icon && <Icon className="w-4 h-4 text-brand-primary" />}
                                            <span className="text-xs">{spec.label}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleCopy(specTextToCopy)} 
                                            className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-md text-brand-text-tertiary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-brand-surface-alt focus:outline-none focus-visible:ring-1 focus-visible:ring-brand-primary"
                                            aria-label={`نسخ ${specTextToCopy}`}
                                        >
                                            {copiedSpec === specTextToCopy ? <IoCheckmark className="text-brand-primary" /> : <IoCopyOutline />}
                                        </button>
                                    </div>

                                    <p className="font-bold text-brand-text-primary mt-1 truncate text-right" title={spec.value}>{spec.value}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {component.source && component.source !== "unknown" && (
                    <div className="mt-4 border-t border-brand-border pt-4">
                        <h3 className="flex items-center gap-2 font-bold text-brand-text-primary mb-3">
                            <IoGlobeOutline className="w-5 h-5 text-brand-primary" />
                            <span>المصدر</span>
                        </h3>
                        <a 
                        href={component.source} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
                        >
                            <span className="truncate max-w-full">{component.source}</span>
                            <FaExternalLinkAlt className="flex-shrink-0" />
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default React.memo(ComponentDetails);