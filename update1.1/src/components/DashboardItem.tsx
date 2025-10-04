// FIX: Implemented the DashboardItem component to resolve import errors and provide a reusable UI element for dashboards.
import React from 'react';
import type { DetectedComponent } from '../types';

interface DashboardItemProps {
    component: DetectedComponent;
    icon: React.ElementType;
    isSelected: boolean;
    isLoading: boolean;
    onSelect: (component: DetectedComponent) => void;
    onHover?: (id: string | null) => void;
}

// FIX: Updated the default onHover handler to accept an argument to fix a TypeScript error.
// The previous `() => {}` was inferred as taking 0 arguments, causing a mismatch at the call site.
const DashboardItem: React.FC<DashboardItemProps> = ({ component, icon: Icon, isSelected, isLoading, onSelect, onHover = (_id) => {} }) => {
    const baseClasses = 'relative w-full text-right p-3 pr-4 flex items-center gap-4 border rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary transform hover:-translate-y-px';
    const stateClasses = isSelected
        ? 'bg-brand-surface border-brand-primary/50 shadow-lg'
        : 'bg-brand-surface border-brand-border hover:border-brand-primary/50 hover:shadow-md';

    return (
        <button
            onClick={() => onSelect(component)}
            onMouseEnter={() => onHover(component.id)}
            onMouseLeave={() => onHover(null)}
            className={`${baseClasses} ${stateClasses}`}
            aria-pressed={isSelected}
        >
            {isSelected && <div className="absolute top-2 bottom-2 right-0 w-1 bg-brand-primary rounded-r-full"></div>}
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${isSelected ? 'bg-brand-primary/20 border-brand-primary/30' : 'bg-brand-bg border-brand-border'}`}>
                 <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-brand-primary' : 'text-brand-text-secondary'}`} />
            </div>
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-brand-text-primary truncate">{component.name}</h3>
                <p className="text-sm text-brand-text-secondary">{component.type || 'مكون غير محدد'}</p>
            </div>
             <div className="flex-shrink-0 text-left">
                {isLoading ? (
                     <div className="w-5 h-5 border-2 border-brand-text-tertiary border-t-brand-primary rounded-full animate-spin"></div>
                ) : (
                    <div className={`text-xs font-bold px-2 py-1 rounded-md ${isSelected ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-surface-alt text-brand-text-secondary'}`}>
                        {Math.round(component.confidence * 100)}%
                    </div>
                )}
            </div>
        </button>
    );
};

export default React.memo(DashboardItem);