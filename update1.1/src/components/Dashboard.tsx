import React from 'react';

interface DashboardProps {
    title: React.ReactNode;
    subtitle?: string;
    children: React.ReactNode;
    footer?: React.ReactNode | null;
    icon?: React.ElementType;
    actions?: React.ReactNode;
}

const Dashboard: React.FC<DashboardProps> = ({ title, subtitle, children, footer, icon: Icon, actions }) => {
    return (
        <div className="flex flex-col h-full bg-brand-bg">
            <div className="flex-shrink-0 p-4 border-b border-brand-border bg-brand-surface">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {Icon && <Icon className="w-6 h-6 text-brand-text-secondary" />}
                        <h2 className="text-lg font-bold text-brand-text-primary truncate">{title}</h2>
                    </div>
                    {actions && <div className="flex-shrink-0">{actions}</div>}
                </div>
                {subtitle && <p className="text-sm text-brand-text-secondary mt-1">{subtitle}</p>}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {children}
            </div>
            {footer && (
                <div className="flex-shrink-0 p-4 border-t border-brand-border bg-brand-surface">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default React.memo(Dashboard);