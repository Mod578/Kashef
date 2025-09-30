import React from 'react';

interface DashboardProps {
    /** The main title of the dashboard panel. Can be a string or a React node for custom rendering. */
    title: React.ReactNode;
    /** An optional subtitle displayed below the title for additional context. */
    subtitle?: string;
    /** The main content of the dashboard. */
    children: React.ReactNode;
    /** An optional footer section, typically used for forms or actions. */
    footer?: React.ReactNode | null;
    /** An optional icon component to be displayed next to the title. */
    icon?: React.ElementType;
    /** Optional action elements, like buttons or menus, displayed in the header. */
    actions?: React.ReactNode;
}

/**
 * A generic, reusable dashboard panel component.
 * It provides a consistent structure with a header (title, subtitle, icon, actions),
 * a scrollable content area, and an optional footer.
 *
 * @param {DashboardProps} props The props for the component.
 * @returns {React.ReactElement} The rendered dashboard panel.
 */
const Dashboard: React.FC<DashboardProps> = ({ title, subtitle, children, footer, icon: Icon, actions }) => {
    return (
        <div className="flex flex-col h-full bg-brand-bg rounded-lg overflow-hidden border border-brand-border">
            {/* Header */}
            <div className="flex-shrink-0 p-4 border-b border-brand-border bg-brand-surface">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        {Icon && (
                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                                <Icon className="w-6 h-6 text-brand-text-secondary" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-brand-text-primary truncate">{title}</h2>
                            {subtitle && <p className="text-sm text-brand-text-secondary truncate">{subtitle}</p>}
                        </div>
                    </div>
                    {actions && <div className="flex-shrink-0 ml-4">{actions}</div>}
                </div>
            </div>

            {/* Content */}
            <div className="flex-grow p-4 overflow-y-auto">
                {children}
            </div>

            {/* Footer */}
            {footer && (
                <div className="flex-shrink-0 p-4 border-t border-brand-border bg-brand-surface">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default React.memo(Dashboard);
