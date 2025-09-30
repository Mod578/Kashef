import React from 'react';
import { FaTimes, FaStethoscope } from 'react-icons/fa';
import { FaMugHot, FaGear } from 'react-icons/fa6';
import type { UseCase } from '../types';
import { useAppContext } from '../context/AppContext';

interface DemoSelectionModalProps {
  /** Whether the modal is currently open. */
  isOpen: boolean;
  /** Callback function to close the modal. */
  onClose: () => void;
}

const DEMO_OPTIONS = [
    {
        useCase: 'coffee' as UseCase,
        icon: FaMugHot,
        title: 'تحليل عدة القهوة',
        description: 'تعرف على أدوات تحضير القهوة المختصة.'
    },
    {
        useCase: 'medical' as UseCase,
        icon: FaStethoscope,
        title: 'مساعد طبي للجراحة',
        description: 'تعرف على مجموعة من الأدوات الجراحية.'
    },
    {
        useCase: 'drone' as UseCase,
        icon: FaGear,
        title: 'فحص مكونات طائرة مُسيرة',
        description: 'اكتشف المكونات الأساسية لطائرة FPV.'
    }
];

/**
 * A modal that allows the user to select a pre-configured demo scenario.
 * Each scenario (use case) loads a specific set of data to demonstrate
 * the application's capabilities without needing a live analysis.
 *
 * @param {DemoSelectionModalProps} props The props for the component.
 * @returns {React.ReactElement | null} The rendered modal or null if it's not open.
 */
const DemoSelectionModal: React.FC<DemoSelectionModalProps> = ({ isOpen, onClose }) => {
  const { dispatch } = useAppContext();

  if (!isOpen) {
    return null;
  }

  const handleSelectUseCase = (useCase: UseCase) => {
    dispatch({ type: 'START_DEMO_MODE', payload: useCase });
    onClose();
  };

  const handleContentClick = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-modal-title"
    >
      <div
        className="relative bg-brand-surface rounded-2xl w-full max-w-md mx-auto animate-slide-up flex flex-col overflow-hidden border border-brand-border"
        onClick={handleContentClick}
        role="document"
      >
        <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-brand-text-secondary hover:bg-brand-surface-alt transition-colors z-10"
            aria-label="إغلاق النافذة"
        >
            <FaTimes />
        </button>
        
        <div className="p-8 text-center border-b border-brand-border">
            <h2 id="demo-modal-title" className="text-2xl font-extrabold text-brand-text-primary">
              استكشف الإمكانيات
            </h2>
            <p className="text-brand-text-secondary mt-2 max-w-md mx-auto">
              اختر أحد السيناريوهات التالية لتجربة إمكانيات التطبيق ببيانات مُعدة مسبقًا.
            </p>
        </div>
        
        <div className="flex-grow p-6 flex flex-col gap-3 bg-brand-bg">
          {DEMO_OPTIONS.map(({ useCase, icon: Icon, title, description }) => (
            <button
              key={useCase}
              onClick={() => handleSelectUseCase(useCase)}
              className="group w-full text-right p-4 flex items-center gap-4 bg-brand-surface border border-brand-border rounded-2xl hover:border-brand-primary/50 hover:bg-brand-surface-alt transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-bg focus-visible:ring-brand-primary"
            >
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand-bg rounded-lg border border-brand-border transition-colors group-hover:border-brand-primary/20 group-hover:bg-brand-surface">
                <Icon className="w-6 h-6 text-brand-primary transition-colors" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-brand-text-primary">{title}</h3>
                <p className="text-sm text-brand-text-secondary">{description}</p>
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 bg-brand-surface border-t border-brand-border text-center">
            <p className="text-xs text-brand-text-tertiary">يستخدم الوضع التجريبي بيانات مُعدة مسبقًا ولا يعكس تحليلًا مباشرًا.</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DemoSelectionModal);
