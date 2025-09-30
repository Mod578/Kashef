// FIX: Implemented the DashboardItem component to resolve import errors and provide a reusable UI element for dashboards.
import React from 'react';
import type { DetectedComponent } from '../types';

interface DashboardItemProps {
    /** The component data to display. */
    component: DetectedComponent;
    /** The icon component to render for this item. */
    icon: React.ElementType;
    /** Whether the item is currently selected. */
    isSelected: boolean;
    /** Whether the item is in a loading state (e.g., fetching details). */
    isLoading: boolean;
    /** Callback function when the item is selected. */
    onSelect: (component: DetectedComponent) => void;
}

/**
 * A clickable item used within a dashboard list, representing a single detected component.
 * It displays the component's name, type, and detection confidence, along with a relevant icon.
 * It changes its appearance based on whether it is selected or loading.
 *
 * @param {DashboardItemProps} props The props for the component.
 * @returns {React.ReactElement} The rendered dashboard item.
 */
const DashboardItem: React.FC<DashboardItemProps> = ({ component, icon: Icon, isSelected, isLoading, onSelect }) => {
    const baseClasses = 'relative w-full text-right p-3 pr-4 flex items-center gap-4 border border-transparent rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary transform';
    const stateClasses = isSelected
        ? 'bg-brand-primary/10'
        : 'bg-brand-surface border-brand-border hover:bg-brand-surface-alt hover:-translate-y-0.5';

    return (
        <button
            onClick={() => onSelect(component)}
            className={`${baseClasses} ${stateClasses}`}
            aria-pressed={isSelected}
            aria-label={`تحديد ${component.name}`}
        >
            {/* Selection Indicator */}
            {isSelected && <div className="absolute top-2 bottom-2 right-0 w-1 bg-brand-primary rounded-r-full animate-fade-in"></div>}
            
            {/* Icon */}
            <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border transition-colors ${isSelected ? 'bg-brand-primary/20 border-brand-primary/30' : 'bg-brand-bg border-brand-border'}`}>
                 <Icon className={`w-6 h-6 transition-colors ${isSelected ? 'text-brand-primary' : 'text-brand-text-secondary'}`} />
            </div>

            {/* Component Info */}
            <div className="flex-grow min-w-0">
                <h3 className="font-bold text-brand-text-primary truncate">{component.name}</h3>
                <p className="text-sm text-brand-text-secondary">{component.type || 'مكون غير محدد'}</p>
            </div>

            {/* Confidence/Loading Indicator */}
             <div className="flex-shrink-0 text-left w-12 flex items-center justify-end">
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