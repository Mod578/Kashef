import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { SystemSlot, DetectedComponent } from '../types';
import { LuServer } from 'react-icons/lu';
import { FaPlus, FaTrash, FaCheck } from 'react-icons/fa';
import Dashboard from './Dashboard';
import SystemSlotItem from './SystemSlotItem';
import DashboardItem from './DashboardItem';
import SystemSlotSkeleton from './SystemSlotSkeleton';
import { getComponentTypeInfo } from '../utils';
import { useAppContext } from '../context/AppContext';

interface SystemDashboardProps {
    slots: SystemSlot[];
    unassigned: DetectedComponent[];
    onAddNewScan: () => void;
}

const SystemDashboard: React.FC<SystemDashboardProps> = ({ slots, unassigned, onAddNewScan }) => {
    const { state, dispatch } = useAppContext();
    const { selectedComponent, isProcessingFrame } = state;
    
    const [isConfirmingReset, setIsConfirmingReset] = useState(false);
    const resetTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        // Cleanup timeout on component unmount to prevent memory leaks
        return () => {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    const handleSelectComponent = (component: DetectedComponent) => {
        dispatch({ type: 'SELECT_COMPONENT', payload: component });
    };

    const handleResetDetection = () => {
        if (isConfirmingReset) {
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
            dispatch({ type: 'RESET_DETECTION' });
            setIsConfirmingReset(false);
            toast.success("تم حذف جميع المكونات المكتشفة.");
        } else {
            setIsConfirmingReset(true);
            resetTimeoutRef.current = window.setTimeout(() => {
                setIsConfirmingReset(false);
            }, 3000); // 3-second confirmation window
        }
    };

    const totalComponents = slots.reduce((acc, slot) => acc + slot.detected.length, 0) + unassigned.length;
    const hasComponents = totalComponents > 0;

    const renderContent = () => {
        if (isProcessingFrame && !hasComponents) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.from({ length: 8 }).map((_, i) => <SystemSlotSkeleton key={i} />)}
                </div>
            );
        }

        if (!hasComponents) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center text-brand-text-secondary p-4">
                    <LuServer className="w-16 h-16 mb-4 text-brand-text-tertiary" />
                    <h3 className="font-bold text-lg">لم يتم اكتشاف أي مكونات بعد</h3>
                    <p className="text-sm">استخدم الكاميرا أو ارفع صورة لبدء الفحص.</p>
                     <button
                        onClick={onAddNewScan}
                        className="mt-4 flex sm:hidden items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-brand-primary-fg font-bold rounded-xl hover:bg-brand-primary/90 transition-colors"
                    >
                        <FaPlus />
                        <span>بدء فحص جديد</span>
                    </button>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {slots.map(slot => (
                        <SystemSlotItem
                            key={slot.key}
                            slot={slot}
                            isSelected={!!(slot.detected.length > 0 && selectedComponent?.id === slot.detected[0].id)}
                            isLoading={isProcessingFrame && !slot.detected.length}
                            onSelect={handleSelectComponent}
                        />
                    ))}
                </div>
                {unassigned.length > 0 && (
                    <div>
                        <h4 className="font-bold text-sm text-brand-text-secondary mb-2 px-1">مكونات غير مخصصة</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {unassigned.map(component => {
                                const typeInfo = getComponentTypeInfo(component.type);
                                return (
                                    <DashboardItem
                                        key={component.id}
                                        component={component}
                                        icon={typeInfo?.icon || LuServer}
                                        isSelected={selectedComponent?.id === component.id}
                                        isLoading={false}
                                        onSelect={handleSelectComponent}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    };
    
    return (
        <Dashboard
            title="نظام الحاسب"
            subtitle={`${totalComponents} مكونات تم التعرف عليها`}
            icon={LuServer}
            actions={
                hasComponents && !isProcessingFrame && (
                    <button
                        onClick={handleResetDetection}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                            isConfirmingReset
                                ? 'bg-brand-danger/20 text-brand-danger'
                                : 'text-brand-text-secondary hover:bg-brand-surface-alt hover:text-brand-text-primary'
                        }`}
                        aria-label={isConfirmingReset ? "تأكيد الحذف" : "حذف جميع المكونات"}
                        title={isConfirmingReset ? "تأكيد الحذف" : "حذف جميع المكونات"}
                    >
                        {isConfirmingReset ? <FaCheck className="w-5 h-5" /> : <FaTrash className="w-5 h-5" />}
                    </button>
                )
            }
        >
            {renderContent()}
        </Dashboard>
    );
};

export default React.memo(SystemDashboard);