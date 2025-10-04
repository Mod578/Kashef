import React from 'react';

const SystemSlotSkeleton: React.FC = () => {
    return (
        <div className="w-full text-right p-2 pr-3 flex items-center gap-3 border border-brand-border rounded-xl bg-brand-surface">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-brand-surface-alt animate-shimmer" />
            <div className="flex-grow min-w-0 space-y-2">
                <div className="h-3 w-3/4 rounded bg-brand-surface-alt animate-shimmer" />
                <div className="h-3 w-1/2 rounded bg-brand-surface-alt animate-shimmer" />
            </div>
        </div>
    );
};

export default SystemSlotSkeleton;