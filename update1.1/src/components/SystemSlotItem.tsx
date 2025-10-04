import React from 'react';
import type { SystemSlot, DetectedComponent } from '../types';
import { FaQuestionCircle } from 'react-icons/fa';

interface SystemSlotItemProps {
    slot: SystemSlot;
    isSelected: boolean;
    isLoading: boolean;
    onSelect: (component: DetectedComponent) => void;
}

const SystemSlotItem: React.FC<SystemSlotItemProps> = ({ slot, isSelected, isLoading, onSelect }) => {
    const isDetected = slot.detected.length > 0;
    const detectedComponent = isDetected ? slot.detected[0] : null; // Taking the first detected for simplicity
    const Icon = slot.icon || FaQuestionCircle;

    const baseClasses = 'relative w-full text-right p-2 pr-3 flex items-center gap-3 border rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary transform hover:-translate-y-px';
    
    const stateClasses = isDetected
        ? isSelected
            ? 'bg-brand-surface border-brand-primary/50 shadow-md'
            : 'bg-brand-surface border-brand-border hover:border-brand-primary/50 hover:shadow-md cursor-pointer'
        : 'bg-brand-surface-alt border-transparent opacity-50 cursor-not-allowed';

    const handleSelect = () => {
        if (detectedComponent) {
            onSelect(detectedComponent);
        }
    };

    return (
        <button
            onClick={handleSelect}
            disabled={!isDetected}
            className={`${baseClasses} ${stateClasses}`}
            aria-pressed={isSelected}
            aria-label={detectedComponent ? detectedComponent.name : `${slot.label} (لم يتم الكشف عنه)`}
        >
            {isSelected && <div className="absolute top-2 bottom-2 right-0 w-1 bg-brand-primary rounded-r-full"></div>}
            
            <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${isSelected ? 'bg-brand-primary/20 border-brand-primary/30' : isDetected ? 'bg-brand-surface-alt border-brand-border' : 'bg-brand-surface-alt border-brand-border'}`}>
                 <Icon className={`w-5 h-5 transition-colors ${isSelected ? 'text-brand-primary' : isDetected ? 'text-brand-text-secondary' : 'text-brand-text-tertiary'}`} />
            </div>
            
            <div className="flex-grow min-w-0">
                <h3 className={`font-bold truncate ${isDetected ? 'text-brand-text-primary' : 'text-brand-text-secondary'}`}>
                    {slot.label}
                </h3>
                <p className="text-sm text-brand-text-secondary truncate">
                    {detectedComponent ? detectedComponent.name : 'لم يتم الكشف عنه'}
                </p>
            </div>
            
            <div className="flex-shrink-0 text-left w-10 flex items-center justify-end">
                {isLoading ? (
                     <div className="w-4 h-4 border-2 border-brand-text-tertiary border-t-brand-primary rounded-full animate-spin"></div>
                ) : detectedComponent ? (
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-surface-alt text-brand-text-secondary'}`}>
                        {Math.round(detectedComponent.confidence * 100)}%
                    </div>
                ) : null}
            </div>
        </button>
    );
};

export default React.memo(SystemSlotItem);