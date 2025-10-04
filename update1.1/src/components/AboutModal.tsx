import React from 'react';
import { FaTimes, FaUsers } from 'react-icons/fa';
import { FaCircleInfo } from 'react-icons/fa6';
import { Logo } from './Logo';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="relative bg-brand-surface rounded-2xl w-full max-w-sm mx-auto animate-slide-up flex flex-col overflow-hidden border border-brand-border"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full text-brand-text-secondary hover:bg-brand-surface-alt transition-colors z-10"
            aria-label="إغلاق النافذة"
        >
            <FaTimes />
        </button>
        
        <div className="flex-grow flex flex-col items-center p-8 text-center bg-brand-bg">
            <div className="w-20 h-20 mb-4 flex items-center justify-center rounded-3xl bg-brand-surface border border-brand-border">
                <Logo className="w-12 h-12 text-brand-primary" />
            </div>
            <h2 id="about-modal-title" className="text-3xl font-extrabold text-brand-text-primary">كاشف</h2>
            <p className="text-brand-text-secondary mt-2">
                مساعدك الذكي للتعرف الفوري على مكونات الحاسب.
            </p>
        </div>

        <div className="p-6 space-y-4 bg-brand-surface">
            <div className="text-right">
                <h3 className="font-bold text-brand-text-primary flex items-center gap-2 justify-start"><FaCircleInfo /><span>عن المشروع</span></h3>
                <p className="text-sm text-brand-text-secondary mt-1">
                    تم تطوير هذا التطبيق كمشروع تخرج نهائي لدبلوم علوم البيانات والذكاء الاصطناعي في أكاديمية طويق.
                </p>
            </div>
             <div className="text-right">
                <h3 className="font-bold text-brand-text-primary flex items-center gap-2 justify-start"><FaUsers /><span>فريق العمل</span></h3>
                <ul className="text-sm text-brand-text-secondary mt-1 list-disc list-inside">
                    <li>محمد المطيري</li>
                    <li>خالد العصماني</li>
                </ul>
            </div>
        </div>
        
        <div className="p-3 bg-brand-bg border-t border-brand-border text-center">
            <p className="text-xs text-brand-text-tertiary">هذا التطبيق هو نسخة تجريبية، وقد لا تكون النتائج دقيقة دائمًا.</p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(AboutModal);