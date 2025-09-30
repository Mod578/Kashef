// FIX: Implemented the SystemDashboard component to display assigned and unassigned hardware components and resolve module errors.
import React from 'react';
import type { SystemSlot, DetectedComponent, DemoComponent } from '../types';
import Dashboard from './Dashboard';
import SystemSlotItem from './SystemSlotItem';
import DashboardItem from './DashboardItem';
import SystemSlotSkeleton from './SystemSlotSkeleton';
import { getComponentTypeInfo } from '../utils';
import { FaPuzzlePiece, FaTrash, FaSave } from 'react-icons/fa';
import { LuLayoutDashboard } from 'react-icons/lu';
import { IoAddCircleOutline } from 'react-icons/io5';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

interface SystemDashboardProps {
    slots: SystemSlot[];
    unassigned: DetectedComponent[];
}

/**
 * A small, reusable action button for dashboards and other UI elements.
 *
 * @param {object} props - The component props.
 * @param {() => void} props.onClick - Click handler.
 * @param {string} props.title - Accessible label and tooltip.
 * @param {React.ReactNode} props.children - Button content, usually an icon.
 * @param {string} [props.className] - Additional CSS classes.
 * @param {boolean} [props.iconOnly=false] - If true, renders as a smaller, square icon button.
 * @returns {React.ReactElement} The rendered action button.
 */
const ActionButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode, className?: string, iconOnly?: boolean }> = ({ onClick, title, children, className = '', iconOnly = false }) => (
    <button
        onClick={onClick}
        title={title}
        aria-label={title}
        className={`flex items-center justify-center ${iconOnly ? 'w-8 h-8' : 'gap-2 px-3 py-1.5'} bg-brand-surface text-brand-text-primary text-xs font-bold rounded-lg hover:bg-brand-surface-alt focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-surface focus-visible:ring-brand-primary transition-all duration-200 border border-brand-border shadow-sm ${className}`}
    >
        {children}
    </button>
);

/**
 * The main dashboard for displaying system components.
 * It shows assigned components in their respective slots and a list of unassigned components.
 * It also provides actions to start a new scan, clear the current analysis, or save the results.
 *
 * @param {SystemDashboardProps} props - The component props.
 * @returns {React.ReactElement} The rendered system dashboard.
 */
const SystemDashboard: React.FC<SystemDashboardProps> = ({ slots, unassigned }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent, isProcessingFrame, detectedComponents } = state;

    const handleSelectComponent = (component: DetectedComponent | DemoComponent) => {
        dispatch({ type: 'SELECT_COMPONENT', payload: component });
    };

    const handleNewScan = () => {
        dispatch({ type: 'RESET_VIEW' });
    };

    const handleClearAnalysis = () => {
        dispatch({ type: 'RESET_SCAN' });
    };

    const handleSaveScan = () => {
        const scanName = window.prompt("الرجاء إدخال اسم لهذا الفحص:", `فحص ${new Date().toLocaleDateString('ar-SA')}`);
        if (scanName && scanName.trim()) {
            dispatch({ type: 'SAVE_SCAN', payload: scanName.trim() });
            toast.success(`تم حفظ الفحص باسم "${scanName.trim()}"!`);
        }
    };
    
    const hasAnyDetections = detectedComponents.length > 0;

    const dashboardActions = (
        <div className="flex items-center gap-2">
            {hasAnyDetections && (
                <>
                    <ActionButton onClick={handleSaveScan} title="حفظ الفحص" iconOnly>
                        <FaSave className="w-3 h-3" />
                    </ActionButton>
                    <ActionButton onClick={handleNewScan} title="فحص جديد" iconOnly>
                        <IoAddCircleOutline className="w-4 h-4" />
                    </ActionButton>
                     <ActionButton onClick={handleClearAnalysis} title="مسح الكل" className="bg-brand-surface-alt" iconOnly>
                        <FaTrash className="w-3 h-3" />
                    </ActionButton>
                </>
            )}
        </div>
    );

    const renderContent = () => {
        if (isProcessingFrame && !hasAnyDetections) {
            return (
                <div>
                    <h3 className="text-sm font-bold text-brand-text-secondary mb-2 px-1">جاري تحليل المكونات...</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Array.from({ length: 8 }).map((_, index) => (
                            <SystemSlotSkeleton key={index} />
                        ))}
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-bold text-brand-text-secondary mb-2 px-1">مكونات النظام الأساسية</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {slots.map((slot, index) => (
                            <div
                                key={slot.key}
                                className={hasAnyDetections ? 'animate-fade-in-up' : ''}
                                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
                            >
                                <SystemSlotItem
                                    slot={slot}
                                    isSelected={slot.detected.length > 0 && selectedComponent?.id === slot.detected[0].id}
                                    // FIX: Added the required 'isLoading' prop to resolve a TypeScript error.
                                    isLoading={false}
                                    onSelect={handleSelectComponent}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {unassigned.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-brand-text-secondary mb-2 mt-4 px-1">مكونات أخرى</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {unassigned.map((component, index) => {
                                const componentType = getComponentTypeInfo(component.type);
                                const Icon = componentType?.icon || FaPuzzlePiece;
                                return (
                                    <div
                                        key={component.id}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: `${(slots.length + index) * 50}ms`, animationFillMode: 'backwards' }}
                                    >
                                        <DashboardItem
                                            component={component}
                                            icon={Icon}
                                            isSelected={selectedComponent?.id === component.id}
                                            isLoading={false}
                                            onSelect={() => handleSelectComponent(component)}
                                            onHover={() => {}}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        )
    };

    return (
        <Dashboard
            title="لوحة النظام"
            subtitle="نظرة عامة على المكونات المكتشفة"
            icon={LuLayoutDashboard}
            actions={dashboardActions}
        >
            {renderContent()}
        </Dashboard>
    );
};

export default React.memo(SystemDashboard);
